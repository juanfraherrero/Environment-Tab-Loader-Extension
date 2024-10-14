import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Label } from "@/components/ui/label";

interface TabsForEnvironmentSectionProps {
  newPageUrl: string;
  setNewPageUrl: (url: string) => void;
  handleAddPage: () => void;
  handleDeletePage: (urlToDelete: string) => void;
  handleEditPage: (urlToDelete: string, newUrl: string) => void;
  pages: string[];
}

const TabsForEnvironmentSection: React.FC<TabsForEnvironmentSectionProps> = ({
  newPageUrl,
  setNewPageUrl,
  handleAddPage,
  handleDeletePage,
  handleEditPage,
  pages,
}) => {
  const [urlDialog, setUrlDialog] = useState<string>("");

  return (
    <>
      <div className="w-[70%] mx-auto flex items-center mb-5 ">
        <Input type="text" placeholder="URL of new tab" value={newPageUrl}
          onChange={(e) => setNewPageUrl(e.target.value)}
          onKeyUp={(e) => { if (e.key === "Enter") handleAddPage() }}
          className="px-4 py-2 w-full"
        />
        <Button
          type="button" onClick={handleAddPage}
          className="px-4 py-2 ml-2">Add</Button>
      </div >
      <div className="w-full mx-auto mb-3 max-h-[300px] overflow-y-scroll">
        {pages.map((page, idx) => {
          return (
            <div key={idx} className="w-[70%] border rounded-md pl-0.5 pl-2.5 shadow-md mx-auto mb-3">
              <div className="flex justify-between items-center m-2">
                <span className="truncate text-center">{page}</span>
                <Dialog >
                  <DialogTrigger asChild>
                    <Button variant="ghost" className="p-1 px-4" onClick={() => { setUrlDialog(page) }}>Edit</Button>
                  </DialogTrigger>
                  <DialogContent className="w-[75%]">
                    <DialogHeader>
                      <DialogTitle>Edit tab</DialogTitle>
                      <DialogDescription>
                        Change url tab. Click save when you're done.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="w-full py-5">
                      <Label htmlFor="name" className="text-right">
                        URL
                      </Label>
                      <Input id="name" value={urlDialog} onChange={(e) => { console.log("onchange input dialog ->", urlDialog); setUrlDialog(e.target.value) }} className="w-full" />
                    </div>
                    <DialogFooter className="w-full flex flex-row flex-nowrap justify-around" >
                      <Button type="button" variant="default" onClick={() => handleEditPage(urlDialog, page)}>Save</Button>
                      <Button type="button" variant="destructive" onClick={() => handleDeletePage(page)}>Delete</Button>
                    </DialogFooter>
                  </DialogContent>

                </Dialog>
              </div>
            </div >
          )
        })}
      </div >
    </>
  );
};

export default TabsForEnvironmentSection;
