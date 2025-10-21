import { Locale } from "@/lib/translations";
import CaseStudiesContent from "./CaseStudiesContent";

interface CaseStudiesSectionProps {
  locale: Locale;
}

const CaseStudiesSection = ({ locale }: CaseStudiesSectionProps) => {
  return <CaseStudiesContent />;
};

export default CaseStudiesSection;
