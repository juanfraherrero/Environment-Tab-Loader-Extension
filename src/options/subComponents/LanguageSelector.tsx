import { memo } from 'react';

import { Toggle } from '@/components/ui/toggle';

interface LanguageSelectorProps {
  handleChangeLanguage: (lng: string) => void;
  currentLanguage: string;
}

const LanguageSelector = memo(
  ({ handleChangeLanguage, currentLanguage }: LanguageSelectorProps) => {
    return (
      <div className="p-1 m-0 ">
        <Toggle
          size="sm"
          pressed={currentLanguage === 'en'}
          onPressedChange={() => handleChangeLanguage('en')}
          className="h-[2.25rem] w-[2.25rem]"
        >
          EN
        </Toggle>

        <Toggle
          size="sm"
          pressed={currentLanguage === 'es'}
          onPressedChange={() => handleChangeLanguage('es')}
          className="h-[2.25rem] w-[2.25rem]"
        >
          ES
        </Toggle>
      </div>
    );
  },
);

export default LanguageSelector;
