import { Locale } from "@/lib/translations";
import TestimonialsContent from "./TestimonialsContent";

interface TestimonialsSectionProps {
  locale: Locale;
}

const TestimonialsSection = ({ locale }: TestimonialsSectionProps) => {
  return <TestimonialsContent />;
};

export default TestimonialsSection;
