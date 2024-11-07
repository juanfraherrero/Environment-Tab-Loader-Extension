import { t } from 'i18next';
import { HelpCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export function HelpPopOver(): JSX.Element {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-0 right-0 mr-1 h-9 w-9 mt-1"
        >
          <HelpCircle className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[70vw] p-4 mr-4">
        <h4 className="text-lg font-semibold mb-2 tracking-tight">
          {t('help.init_title')}
          <span className="italic">{t('title')}</span>?
        </h4>
        <p className="text-sm mb-2 tracking-tight">
          {t('help.app_description')}
        </p>
        <div className="text-xs">
          {t('dialog.openEnvShortcuts.description')}
          <ul>
            <li>
              <b>windows</b>:{' '}
              <code className="italic">
                {t('dialog.openEnvShortcuts.windows')}
              </code>
            </li>
            <li>
              <b>mac</b>:{' '}
              <code className="italic">{t('dialog.openEnvShortcuts.mac')}</code>
            </li>
            <li>
              <b>linux</b>:{' '}
              <code className="italic">
                {t('dialog.openEnvShortcuts.linux')}
              </code>
            </li>
          </ul>
        </div>
      </PopoverContent>
    </Popover>
  );
}
