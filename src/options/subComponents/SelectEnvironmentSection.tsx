import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

import { OpenEnvDialog } from './OpenEnvDialog';
import { Environments } from '../../types/Environment';

interface SelectEnvironmentSectionProps {
  environments: Environments;
  selectedEnv: string | null;
  handleChangeEnvironment: (selectedEnv: string) => void;
  handleOpenSettings: () => void;
}

export default function SelectEnvironmentSection({
  environments,
  selectedEnv,
  handleChangeEnvironment,
  handleOpenSettings,
}: SelectEnvironmentSectionProps): JSX.Element {
  const { t } = useTranslation();
  const { toast } = useToast();

  const sortedEnvs = useMemo(
    () => Object.keys(environments).sort(),
    [environments],
  );

  const areEnvironmentsAvailable = sortedEnvs.length > 0;

  /**
   * Calls backgrounds functions to open tabs with specific command to keep or delete other tabs
   */
  const callBackground = (command: string): void => {
    if (
      !selectedEnv ||
      !environments[selectedEnv] ||
      !(environments[selectedEnv].length > 0)
    ) {
      toast({
        variant: 'destructive',
        title: t('error.must_have_tabs'),
      });
      return;
    }

    chrome.runtime.sendMessage(
      {
        action: 'executeMainFunction',
        selectedEnv: selectedEnv,
        command: command,
      },
      response => {
        if (response?.success) {
          window.close();
        } else {
          toast({
            variant: 'destructive',
            title: t('error.fail_app'),
          });
        }
      },
    );
  };

  if (!areEnvironmentsAvailable)
    return (
      <Button
        className="w-[80%] mx-auto px-4 py-2 text-base"
        variant="default"
        onClick={handleOpenSettings}
      >
        {t('button.create_env')}
      </Button>
    );

  return (
    <>
      <div className="w-[80%] mx-auto flex items-center mb-3">
        <Select
          value={selectedEnv || ''}
          onValueChange={value => {
            handleChangeEnvironment(value);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('button.select_env')} />
          </SelectTrigger>
          <SelectContent className="overflow-y-auto max-h-[75vh]">
            {sortedEnvs.map((env, idx) => (
              <SelectItem key={idx} value={env}>
                {env}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="w-[50%] mx-auto flex items-center justify-center mb-10">
        <OpenEnvDialog
          onOpenEnvKeepTabs={() => {
            callBackground('open_work_environment');
          }}
          onOpenEnvDiscardTabs={() => {
            callBackground('reset_work_environment');
          }}
        />
      </div>
    </>
  );
}
