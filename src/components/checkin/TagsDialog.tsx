
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Printer } from "lucide-react";
import TagPreview, { TagData } from "./TagPreview";

interface TagsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tags: TagData[] | null;
  tagCount: number;
  setTagCount: (count: number) => void;
  onPrintTags: () => void;
}

const TagsDialog: React.FC<TagsDialogProps> = ({
  open,
  onOpenChange,
  tags,
  tagCount,
  setTagCount,
  onPrintTags
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${tags && tags.length > 1 ? 'sm:max-w-xl' : 'sm:max-w-md'}`}>
        <DialogHeader>
          <DialogTitle>
            {tags && tags.length > 1 
              ? "Etichete Generate" 
              : "Etichetă Generată"}
          </DialogTitle>
          <DialogDescription>
            {tags && tags.length > 1 
              ? `${tags.length} etichete pentru copii selectați` 
              : `Etichete pentru ${tags?.[0]?.childName}`}
          </DialogDescription>
        </DialogHeader>
        
        {tags && (
          <div className={`${tags.length > 1 ? 'grid grid-cols-2 gap-4 max-h-96 overflow-y-auto' : ''}`}>
            {tags.map((tag, index) => (
              <TagPreview key={index} tag={tag} />
            ))}
          </div>
        )}
        
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="tagCount">Număr de etichete per copil:</Label>
            <Select
              value={tagCount.toString()}
              onValueChange={(value) => setTagCount(parseInt(value))}
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
          <Button onClick={onPrintTags}>
            <Printer className="mr-2 h-4 w-4" />
            Printează {tagCount * (tags?.length || 1)} etichete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TagsDialog;
