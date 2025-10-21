import { Locale } from "@/lib/translations";
import ToolsContent from "./ToolsContent";

interface ToolsSectionProps {
  locale: Locale;
}

const ToolsSection = ({ locale }: ToolsSectionProps) => {
  return <ToolsContent />;
};

export default ToolsSection;
