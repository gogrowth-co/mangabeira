import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    hbspt?: {
      forms: {
        create: (config: {
          region: string;
          portalId: string;
          formId: string;
          target: string;
        }) => void;
      };
    };
  }
}

interface HubSpotFormProps {
  portalId: string;
  formId: string;
  region?: string;
}

const HubSpotForm = ({ portalId, formId, region = "na1" }: HubSpotFormProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.hsforms.net/forms/embed/v2.js";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (window.hbspt && containerRef.current) {
        window.hbspt.forms.create({
          region,
          portalId,
          formId,
          target: `#hubspot-form-${formId}`,
        });
        setIsLoading(false);
      }
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [portalId, formId, region]);

  return (
    <div className="hubspot-form-wrapper">
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(var(--aqua-bright))]"></div>
        </div>
      )}
      <div
        ref={containerRef}
        id={`hubspot-form-${formId}`}
        className={isLoading ? "opacity-0" : "opacity-100 transition-opacity duration-300"}
      />
    </div>
  );
};

export default HubSpotForm;
