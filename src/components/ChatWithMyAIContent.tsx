import { Locale } from "@/lib/translations";
import ChatWithMyAIContent from "./ChatWithMyAIContent";

interface ChatWithMyAIProps {
  locale: Locale;
}

const ChatWithMyAI = ({ locale }: ChatWithMyAIProps) => {
  return <ChatWithMyAIContent />;
};

export default ChatWithMyAI;
