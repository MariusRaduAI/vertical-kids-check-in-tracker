
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ParentsListProps {
  parents: string[];
  onParentChange: (index: number, value: string) => void;
  onAddParent: () => void;
  onRemoveParent: (index: number) => void;
}

const ParentsList: React.FC<ParentsListProps> = ({
  parents,
  onParentChange,
  onAddParent,
  onRemoveParent,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Părinți</Label>
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={onAddParent}
        >
          + Adaugă
        </Button>
      </div>
      {parents.map((parent, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            value={parent}
            onChange={(e) => onParentChange(index, e.target.value)}
            placeholder="Nume părinte"
          />
          {parents.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => onRemoveParent(index)}
            >
              ×
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ParentsList;
