import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/translations';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const CHAT_ENDPOINT = '/api/chat';

const ChatWithMyAIContent = () => {
  const { locale } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Same-origin Cloudflare Worker (routed at mangabeira.net/api/chat);
      // streams SSE in the same OpenAI chunk format the old edge function used.
      const response = await fetch(CHAT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';

      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                assistantContent += content;
                setMessages(prev => {
                  const newMessages = [...prev];
                  newMessages[newMessages.length - 1].content = assistantContent;
                  return newMessages;
                });
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    { key: 'case_studies', text: t('chat', 'quick_action_cases', locale) },
    { key: 'book_call', text: t('chat', 'quick_action_book', locale) },
    { key: 'my_experience', text: t('chat', 'quick_action_pubs', locale) },
  ];

  return (
    <>
      {/* Chat Bubble */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl md:h-16 md:w-16 ${
          isOpen ? 'hidden' : ''
        }`}
        aria-label={t('chat', 'aria_open_chat', locale)}
        title={t('chat', 'bubble_tooltip', locale)}
      >
        <MessageSquare className="h-6 w-6 mx-auto" />
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:inset-auto md:bottom-6 md:right-6 md:h-[600px] md:w-[400px]">
          <div className="flex h-full flex-col bg-background shadow-2xl md:rounded-2xl border border-border">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border p-4 bg-primary/5">
              <div>
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  {t('chat', 'header_title', locale)}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t('chat', 'header_subtitle', locale)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              {messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mb-4 opacity-50" />
                  <p className="text-sm mb-1">{t('chat', 'empty_state_line1', locale)}</p>
                  <p className="text-xs">{t('chat', 'empty_state_line2', locale)}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                          msg.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                  {isLoading && messages[messages.length - 1]?.role === 'user' && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] rounded-2xl bg-muted px-4 py-2">
                        <p className="text-sm text-muted-foreground">{t('chat', 'loading_thinking', locale)}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>

            {/* Quick Actions */}
            {messages.length === 0 && (
              <div className="border-t border-border p-3 space-y-2">
                {quickActions.map(action => (
                  <button
                    key={action.key}
                    onClick={() => sendMessage(action.text)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
                  >
                    {action.text}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="border-t border-border p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage(input);
                }}
                className="flex gap-2"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t('chat', 'input_placeholder', locale)}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button type="submit" size="icon" disabled={isLoading || !input.trim()} aria-label={t('chat', 'button_send', locale)}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
              <p className="mt-2 text-xs text-muted-foreground text-center">
                {t('chat', 'disclaimer', locale)}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWithMyAIContent;
