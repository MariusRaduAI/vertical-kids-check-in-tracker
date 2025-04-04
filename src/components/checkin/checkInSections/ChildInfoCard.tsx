
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { X, AlertTriangle } from "lucide-react";
import { Child } from "@/types/models";
import AgeGroupBadge from "@/components/common/AgeGroupBadge";
import CategoryBadge from "@/components/common/CategoryBadge";
import NewChildBadge from "@/components/common/NewChildBadge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface ChildInfoCardProps {
  selectedChild: Child;
  selectedSiblings: Child[];
  handleSiblingSelect: (siblingId: string, selected: boolean) => void;
  getSiblings: (childId: string) => Child[];
  clearSelection: () => void;
}

const ChildInfoCard: React.FC<ChildInfoCardProps> = ({
  selectedChild,
  selectedSiblings,
  handleSiblingSelect,
  getSiblings,
  clearSelection
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">Informații copil</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={clearSelection}
        >
          <X className="h-4 w-4 mr-1" />
          Anulează
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-lg">{selectedChild.fullName}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <AgeGroupBadge ageGroup={selectedChild.ageGroup} />
                  <CategoryBadge category={selectedChild.category} />
                  {selectedChild.isNew && <NewChildBadge />}
                </div>
              </div>
            </div>
            
            {selectedChild.parents.length > 0 && (
              <div>
                <h5 className="text-sm font-medium">Părinți:</h5>
                <p className="text-sm">{selectedChild.parents.join(", ")}</p>
              </div>
            )}
            
            {selectedChild.hasAllergies && (
              <Alert variant="destructive" className="py-2">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Alergii</AlertTitle>
                <AlertDescription>
                  {selectedChild.allergiesDetails || "Informații indisponibile"}
                </AlertDescription>
              </Alert>
            )}
            
            {selectedChild.hasSpecialNeeds && (
              <Alert className="py-2 bg-amber-50 border-amber-200">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <AlertTitle className="text-amber-800">Nevoi speciale</AlertTitle>
                <AlertDescription className="text-amber-700">
                  {selectedChild.specialNeedsDetails || "Informații indisponibile"}
                </AlertDescription>
              </Alert>
            )}
            
            {/* Siblings section */}
            {getSiblings(selectedChild.id).length > 0 && (
              <div className="border-t pt-2 mt-2">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-sm font-medium">Frați/Surori:</h5>
                </div>
                <div className="space-y-2">
                  {getSiblings(selectedChild.id).map(sibling => (
                    <div key={sibling.id} className="flex items-center gap-2">
                      <Checkbox 
                        id={`sibling-${sibling.id}`}
                        checked={selectedSiblings.some(s => s.id === sibling.id)}
                        onCheckedChange={(checked) => 
                          handleSiblingSelect(sibling.id, checked === true)
                        }
                      />
                      <Label htmlFor={`sibling-${sibling.id}`} className="cursor-pointer">
                        {sibling.fullName} 
                        <span className="ml-1 text-xs text-muted-foreground">
                          ({sibling.ageGroup})
                        </span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChildInfoCard;
