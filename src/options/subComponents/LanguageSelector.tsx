import { memo } from "react";
import { Toggle } from "@/components/ui/toggle";

interface LanguageSelectorProps {
  handleChangeLanguage: (lng: string) => void;
  currentLanguage: string;
}

const LanguageSelector = memo(
  ({ handleChangeLanguage, currentLanguage }: LanguageSelectorProps) => {
    return (
      <div className="absolute bottom-0 right-0 p-1 m-0">
        <Toggle
          size="sm"
          pressed={currentLanguage === "en"}
          onPressedChange={() => handleChangeLanguage("en")}
        >
          EN
        </Toggle>

        <Toggle
          size="sm"
          pressed={currentLanguage === "es"}
          onPressedChange={() => handleChangeLanguage("es")}
        >
          ES
        </Toggle>
      </div>
    );
  }
);

export default LanguageSelector;
