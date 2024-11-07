import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

interface OpenEnvDialogProps {
  onOpenEnvKeepTabs: () => void;
  onOpenEnvDiscardTabs: () => void;
  isDisabled: boolean;
}
export function OpenEnvDialog({
  onOpenEnvKeepTabs,
  onOpenEnvDiscardTabs,
  isDisabled,
}: OpenEnvDialogProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="px-4 py-2 ml-2 w-full text-base"
          variant="default"
          disabled={isDisabled}
        >
          {t('button.open')}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[80vw]">
        <DialogTitle>{t('dialog.openEnvTitle')}</DialogTitle>
        <DialogDescription>{t('dialog.openEnvDescription')}</DialogDescription>
        <DialogDescription className="text-xs">
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
        </DialogDescription>
        <DialogFooter>
          <Button variant="outline" onClick={onOpenEnvDiscardTabs}>
            {t('dialog.openEnv.discardTabs')}
          </Button>
          <Button
            className="mb-3"
            variant="default"
            onClick={onOpenEnvKeepTabs}
          >
            {t('dialog.openEnv.keepTabs')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
