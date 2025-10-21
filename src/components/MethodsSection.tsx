import MethodsContent from "./MethodsContent";
import { Locale } from "@/lib/translations";

interface MethodsSectionProps {
  locale: Locale;
}

const MethodsSection = ({ locale }: MethodsSectionProps) => {
  return <MethodsContent locale={locale} />;
};

export default MethodsSection;
