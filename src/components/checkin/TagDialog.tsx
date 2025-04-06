
import React from "react";
import { format } from "date-fns";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { TagPreviewType } from "@/types/checkin";
import TagPreview from "./TagPreview";

interface TagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tags: TagPreviewType[] | null;
  childName: string | undefined;
  tagCount: number;
  onTagCountChange: (count: number) => void;
  onPrint: () => void;
}

const TagDialog: React.FC<TagDialogProps> = ({
  open,
  onOpenChange,
  tags,
  childName,
  tagCount,
  onTagCountChange,
  onPrint
}) => {
  if (!tags) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${tags && tags.length > 1 ? 'sm:max-w-xl' : 'sm:max-w-md'}`}>
        <DialogHeader>
          <DialogTitle>Etichetă Generată</DialogTitle>
          <DialogDescription>
            Etichete pentru {childName}
          </DialogDescription>
        </DialogHeader>
        
        <div className={`${tags.length > 1 ? 'grid grid-cols-2 gap-4' : ''}`}>
          {tags.map((tag, index) => (
            <TagPreview key={index} tag={tag} />
          ))}
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="tagCount">Număr de etichete:</Label>
            <Select
              value={tagCount.toString()}
              onValueChange={(value) => onTagCountChange(parseInt(value))}
            >
              <SelectTrigger id="tagCount" className="w-20">
                <SelectValue placeholder="3" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Anulează
          </Button>
          <Button onClick={onPrint}>
            <Printer className="mr-2 h-4 w-4" />
            Printează {tagCount * (tags?.length || 1)} etichete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TagDialog;
