import { Trash } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';

interface ListOfEnvsProps {
  envs: string[];
  onDeleteEnv: (selectedEnv: string) => void;
}

export function ListOfEnvs({
  envs,
  onDeleteEnv,
}: ListOfEnvsProps): JSX.Element {
  const { t } = useTranslation();

  return (
    <>
      <div
        className=" flex-grow w-full mx-auto overflow-y-auto 
        scrollbar-thin scrollbar-thumb-primary scrollbar-track-transparent 
       scrollbar-thumb-rounded-full"
      >
        {envs.map((envName, idx) => {
          return (
            <div
              key={idx}
              className="w-[70%] border rounded-md pl-2.5 shadow-md mx-auto mb-3"
            >
              <div className="flex justify-between items-center m-2">
                <span className="truncate text-center">{envName}</span>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => {}}
                    >
                      <Trash className="h-[1.2rem] w-[1.2rem]" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-[80%]">
                    <DialogHeader>
                      <DialogTitle>{t('dialog.deleteEnv.title')}</DialogTitle>
                      <DialogDescription>
                        {t('dialog.deleteEnv.description', { env: envName })}
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="w-full flex flex-row flex-nowrap justify-around">
                      <DialogClose asChild>
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => {
                            onDeleteEnv(envName);
                          }}
                        >
                          {t('button.delete')}
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
