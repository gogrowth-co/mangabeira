import { Locale } from "@/lib/translations";
import CapabilitiesContent from "./CapabilitiesContent";

interface CapabilitiesSectionProps {
  locale: Locale;
}

const CapabilitiesSection = ({ locale }: CapabilitiesSectionProps) => {
  return <CapabilitiesContent />;
};

export default CapabilitiesSection;
