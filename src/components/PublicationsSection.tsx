import { Locale } from "@/lib/translations";
import PublicationsContent from "./PublicationsContent";

interface PublicationsSectionProps {
  locale: Locale;
}

const PublicationsSection = ({ locale }: PublicationsSectionProps) => {
  return <PublicationsContent />;
};

export default PublicationsSection;
