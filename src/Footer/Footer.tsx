import { memo, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useToast } from '@/hooks/use-toast';
import { Cafesito } from '@/options/subComponents/Cafesito';
import { ModeToggle } from '@/options/subComponents/changeThemeDrop';
import LanguageSelector from '@/options/subComponents/LanguageSelector';

const Footer = memo(() => {
  const {
    t,
    i18n: { changeLanguage, language },
  } = useTranslation();
  const { toast } = useToast();

  /**
   * Loads language from chrome storage
   */
  const loadLanguages = useCallback(() => {
    chrome.storage.sync.get(['lng'], result => {
      const lng = result.lng || ('' as string);
      if (lng) changeLanguage(lng);
    });
  }, [changeLanguage]);

  /**
   * Wraps changeLanguage and store it
   */
  const updateLanguage = (lng: string): void => {
    if (!lng) return;
    changeLanguage(lng);
    chrome.storage.sync.set({ lng }, () => {
      if (chrome.runtime.lastError) {
        // alert("Error while creating new environment. Contact with creator!");
        toast({
          variant: 'destructive',
          title: t('error.save_language'),
        });
        return;
      }
    });
  };

  /**
   * Load all data when mount
   */
  useEffect(() => {
    loadLanguages();
  }, [loadLanguages]);

  return (
    <div className="w-full flex flex-row flex-nowrap justify-between items-center">
      <ModeToggle />
      <Cafesito />
      <LanguageSelector
        handleChangeLanguage={updateLanguage}
        currentLanguage={language}
      ></LanguageSelector>
    </div>
  );
});

export default Footer;
