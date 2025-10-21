import CapabilitiesContent from "./CapabilitiesContent";
import { Locale } from "@/lib/translations";

interface CapabilitiesSectionProps {
  locale: Locale;
}

const CapabilitiesSection = ({ locale }: CapabilitiesSectionProps) => {
  return <CapabilitiesContent locale={locale} />;
};

export default CapabilitiesSection;
