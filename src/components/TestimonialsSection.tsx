import TestimonialsContent from "./TestimonialsContent";
import { Locale } from "@/lib/translations";

interface TestimonialsSectionProps {
  locale: Locale;
}

const TestimonialsSection = ({ locale }: TestimonialsSectionProps) => {
  return <TestimonialsContent locale={locale} />;
};

export default TestimonialsSection;
