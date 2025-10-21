import { Locale } from "@/lib/translations";
import MyJourneyContent from "./MyJourneyContent";

interface MyJourneySectionProps {
  locale: Locale;
}

const MyJourneySection = ({ locale }: MyJourneySectionProps) => {
  return <MyJourneyContent />;
};

export default MyJourneySection;
