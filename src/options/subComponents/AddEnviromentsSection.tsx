import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AddEnvironmentSectionProps {
  handleAddEnvironment: (envName: string) => void;
}

const AddEnvironmentSection = memo(
  ({ handleAddEnvironment }: AddEnvironmentSectionProps) => {
    const [envName, setEnvName] = useState<string>('');
    const { t } = useTranslation();

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
      if (e.key === 'Enter') {
        handleAddEnvironment(envName);
        setEnvName('');
      }
    };

    return (
      <div className="w-[80%] mx-auto flex items-center mb-5">
        <Input
          id="name"
          type="text"
          placeholder={t('button.new_env')}
          value={envName}
          onChange={e => setEnvName(e.target.value)}
          onKeyUp={handleKeyDown}
          className="px-4 py-2 w-full"
        />
        <Button
          type="button"
          onClick={() => handleAddEnvironment(envName)}
          className="px-4 py-2 ml-2"
        >
          {t('button.add')}
        </Button>
      </div>
    );
  },
);

export default AddEnvironmentSection;
