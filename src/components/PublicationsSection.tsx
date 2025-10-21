import PublicationsContent from "./PublicationsContent";
import { Locale } from "@/lib/translations";

interface PublicationsSectionProps {
  locale: Locale;
}

const PublicationsSection = ({ locale }: PublicationsSectionProps) => {
  return <PublicationsContent locale={locale} />;
};

export default PublicationsSection;
