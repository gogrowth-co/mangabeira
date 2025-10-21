import CaseStudiesContent from "./CaseStudiesContent";
import { Locale } from "@/lib/translations";

interface CaseStudiesSectionProps {
  locale: Locale;
}

const CaseStudiesSection = ({ locale }: CaseStudiesSectionProps) => {
  return <CaseStudiesContent locale={locale} />;
};

export default CaseStudiesSection;
