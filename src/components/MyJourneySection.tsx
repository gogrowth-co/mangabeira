import MyJourneyContent from "./MyJourneyContent";
import { Locale } from "@/lib/translations";

interface MyJourneySectionProps {
  locale: Locale;
}

const MyJourneySection = ({ locale }: MyJourneySectionProps) => {
  return <MyJourneyContent locale={locale} />;
};

export default MyJourneySection;
