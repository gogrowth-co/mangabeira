import { Locale } from "@/lib/translations";
import MethodsContent from "./MethodsContent";

interface MethodsSectionProps {
  locale: Locale;
}

const MethodsSection = ({ locale }: MethodsSectionProps) => {
  return <MethodsContent />;
};

export default MethodsSection;
