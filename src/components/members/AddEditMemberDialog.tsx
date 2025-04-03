
import React from "react";
import { Child } from "@/types/models";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useApp } from "@/context/AppContext";

// Import refactored components
import PersonalInfoSection from "./dialog/PersonalInfoSection";
import ContactInfoSection from "./dialog/ContactInfoSection";
import ParentsList from "./dialog/ParentsList";
import SiblingsSection from "./dialog/SiblingsSection";
import AllergiesSection from "./dialog/AllergiesSection";
import SpecialNeedsSection from "./dialog/SpecialNeedsSection";

interface AddEditMemberDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  childFormData: Partial<Child>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onParentChange: (index: number, value: string) => void;
  onAddParent: () => void;
  onRemoveParent: (index: number) => void;
  onCheckboxChange: (field: string, checked: boolean) => void;
  onSave: () => void;
  onAgeGroupChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onAddSibling?: (siblingId: string) => void;
  onRemoveSibling?: (siblingId: string) => void;
}

const AddEditMemberDialog: React.FC<AddEditMemberDialogProps> = ({
  isOpen,
  onOpenChange,
  isEditing,
  childFormData,
  onInputChange,
  onParentChange,
  onAddParent,
  onRemoveParent,
  onCheckboxChange,
  onSave,
  onAgeGroupChange,
  onCategoryChange,
  onAddSibling,
  onRemoveSibling,
}) => {
  const { children, getSiblings } = useApp();
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editează Detalii Copil" : "Adaugă Copil Nou"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Actualizează informațiile profilului"
              : "Completează toate detaliile despre noul copil"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <PersonalInfoSection 
            firstName={childFormData.firstName || ""}
            lastName={childFormData.lastName || ""}
            birthDate={childFormData.birthDate || ""}
            ageGroup={childFormData.ageGroup || "4-6"}
            category={childFormData.category || "Membru"}
            onInputChange={onInputChange}
            onAgeGroupChange={onAgeGroupChange}
            onCategoryChange={onCategoryChange}
          />
          
          {/* Siblings Section */}
          {isEditing && onAddSibling && onRemoveSibling && (
            <SiblingsSection
              childId={childFormData.id}
              siblingIds={childFormData.siblingIds}
              children={children}
              getSiblings={getSiblings}
              onAddSibling={onAddSibling}
              onRemoveSibling={onRemoveSibling}
            />
          )}
          
          <ParentsList
            parents={childFormData.parents || [""]}
            onParentChange={onParentChange}
            onAddParent={onAddParent}
            onRemoveParent={onRemoveParent}
          />
          
          <ContactInfoSection
            phone={childFormData.phone || ""}
            email={childFormData.email || ""}
            onInputChange={onInputChange}
          />
          
          <AllergiesSection
            hasAllergies={childFormData.hasAllergies || false}
            allergiesDetails={childFormData.allergiesDetails}
            onCheckboxChange={onCheckboxChange}
            onInputChange={onInputChange}
          />
          
          <SpecialNeedsSection
            hasSpecialNeeds={childFormData.hasSpecialNeeds || false}
            specialNeedsDetails={childFormData.specialNeedsDetails}
            onCheckboxChange={onCheckboxChange}
            onInputChange={onInputChange}
          />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Anulează
          </Button>
          <Button onClick={onSave}>
            {isEditing ? "Salvează Modificările" : "Adaugă Copil"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditMemberDialog;
