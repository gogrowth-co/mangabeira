import ToolsContent from "./ToolsContent";
import { Locale } from "@/lib/translations";

interface ToolsSectionProps {
  locale: Locale;
}

const ToolsSection = ({ locale }: ToolsSectionProps) => {
  return <ToolsContent locale={locale} />;
};

export default ToolsSection;
