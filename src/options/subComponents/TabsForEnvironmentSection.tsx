import { useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TabsForEnvironmentSectionProps {
  newPageUrl: string;
  setNewPageUrl: (url: string) => void;
  handleAddPage: () => void;
  handleDeletePage: (urlToDelete: string) => void;
  handleEditPage: (urlToDelete: string, newUrl: string) => void;
  pages: string[];
  isSelectedEnv: boolean;
}

const TabsForEnvironmentSection: React.FC<TabsForEnvironmentSectionProps> = ({
  newPageUrl,
  setNewPageUrl,
  handleAddPage,
  handleDeletePage,
  handleEditPage,
  pages,
  isSelectedEnv,
}) => {
  const [urlDialog, setUrlDialog] = useState<string>('');
  const { t } = useTranslation();

  return (
    <>
      {isSelectedEnv && (
        <div className="w-[70%] mx-auto flex items-center mb-5 ">
          <Input
            type="text"
            placeholder={t('button.new_tab')}
            value={newPageUrl}
            onChange={e => setNewPageUrl(e.target.value)}
            onKeyUp={e => {
              if (e.key === 'Enter') handleAddPage();
            }}
            className="px-4 py-2 w-full"
          />
          <Button
            type="button"
            onClick={handleAddPage}
            className="px-4 py-2 ml-2"
          >
            {t('button.add')}
          </Button>
        </div>
      )}
      <div
        className=" flex-grow w-full mx-auto overflow-y-auto 
        scrollbar-thin scrollbar-thumb-primary scrollbar-track-transparent 
       scrollbar-thumb-rounded-full"
      >
        {pages.map((page, idx) => {
          return (
            <div
              key={idx}
              className="w-[70%] border rounded-md pl-2.5 shadow-md mx-auto mb-3"
            >
              <div className="flex justify-between items-center m-2">
                <span className="truncate text-center">{page}</span>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      className="p-1 px-4"
                      onClick={() => {
                        setUrlDialog(page);
                      }}
                    >
                      {t('button.edit')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-[75%]">
                    <DialogHeader>
                      <DialogTitle>{t('dialog.editTab.title')}</DialogTitle>
                      <DialogDescription>
                        {t('dialog.editTab.description')}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="w-full py-5">
                      <Label htmlFor="name" className="text-right">
                        URL
                      </Label>
                      <Input
                        id="name"
                        value={urlDialog}
                        onChange={e => {
                          setUrlDialog(e.target.value);
                        }}
                        className="w-full"
                      />
                    </div>
                    <DialogFooter className="w-full flex flex-row flex-nowrap justify-around">
                      <DialogClose asChild>
                        <Button
                          type="button"
                          variant="default"
                          onClick={() => handleEditPage(urlDialog, page)}
                        >
                          {t('button.save')}
                        </Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => handleDeletePage(page)}
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
};

export default TabsForEnvironmentSection;
