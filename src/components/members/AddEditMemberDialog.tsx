
import React, { useState } from "react";
import { Child, AgeGroup } from "@/types/models";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApp } from "@/context/AppContext";
import { Badge } from "@/components/ui/badge";
import { Users, X } from "lucide-react";

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
  const [siblingSearch, setSiblingSearch] = useState("");
  const [showSiblingSearch, setShowSiblingSearch] = useState(false);
  
  // Filter siblings that are not already added
  const filteredSiblings = siblingSearch.trim() ? 
    children.filter(c => 
      c.id !== childFormData.id && 
      !childFormData.siblingIds?.includes(c.id) &&
      c.fullName.toLowerCase().includes(siblingSearch.toLowerCase())
    ) : [];
  
  // Get current siblings
  const currentSiblings = childFormData.id ? getSiblings(childFormData.id) : [];
  
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prenume</Label>
              <Input
                id="firstName"
                name="firstName"
                value={childFormData.firstName}
                onChange={onInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nume</Label>
              <Input
                id="lastName"
                name="lastName"
                value={childFormData.lastName}
                onChange={onInputChange}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="birthDate">Data Nașterii</Label>
              <Input
                id="birthDate"
                name="birthDate"
                type="date"
                value={childFormData.birthDate}
                onChange={onInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ageGroup">Grupa de Vârstă</Label>
              <Select
                name="ageGroup"
                value={childFormData.ageGroup}
                onValueChange={onAgeGroupChange}
              >
                <SelectTrigger id="ageGroup">
                  <SelectValue placeholder="Selectează grupa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-1">0-1 ani</SelectItem>
                  <SelectItem value="1-2">1-2 ani</SelectItem>
                  <SelectItem value="2-3">2-3 ani</SelectItem>
                  <SelectItem value="4-6">4-6 ani</SelectItem>
                  <SelectItem value="7-12">7-12 ani</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Categorie</Label>
            <Select
              name="category"
              value={childFormData.category}
              onValueChange={onCategoryChange}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Selectează categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Membru">Membru</SelectItem>
                <SelectItem value="Guest">Guest</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Siblings Section */}
          {isEditing && onAddSibling && onRemoveSibling && (
            <div className="space-y-2 border p-4 rounded-md">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Users className="h-4 w-4" /> Frați/Surori
                </Label>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setShowSiblingSearch(!showSiblingSearch)}
                >
                  {showSiblingSearch ? "Anulează" : "+ Adaugă"}
                </Button>
              </div>
              
              {currentSiblings.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {currentSiblings.map(sibling => (
                    <Badge key={sibling.id} variant="secondary" className="flex items-center gap-1">
                      {sibling.fullName}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-4 w-4 p-0" 
                        onClick={() => onRemoveSibling(sibling.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
              
              {showSiblingSearch && (
                <div className="mt-2 space-y-2">
                  <Input
                    placeholder="Caută un copil pentru a-l adăuga ca frate/soră..."
                    value={siblingSearch}
                    onChange={(e) => setSiblingSearch(e.target.value)}
                  />
                  
                  {filteredSiblings.length > 0 && (
                    <div className="max-h-32 overflow-y-auto border rounded-md divide-y">
                      {filteredSiblings.map(child => (
                        <div
                          key={child.id}
                          className="p-2 cursor-pointer hover:bg-muted"
                          onClick={() => {
                            onAddSibling(child.id);
                            setSiblingSearch("");
                          }}
                        >
                          {child.fullName}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {siblingSearch && filteredSiblings.length === 0 && (
                    <p className="text-sm text-muted-foreground">Nu a fost găsit niciun copil</p>
                  )}
                </div>
              )}
            </div>
          )}
          
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
            {childFormData.parents?.map((parent, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={parent}
                  onChange={(e) => onParentChange(index, e.target.value)}
                  placeholder="Nume părinte"
                />
                {childFormData.parents!.length > 1 && (
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
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                name="phone"
                value={childFormData.phone}
                onChange={onInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={childFormData.email}
                onChange={onInputChange}
              />
            </div>
          </div>
          
          <div className="space-y-4 border p-4 rounded-md">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="hasAllergies" 
                checked={childFormData.hasAllergies}
                onCheckedChange={(checked) => 
                  onCheckboxChange('hasAllergies', checked === true)
                } 
              />
              <Label htmlFor="hasAllergies" className="font-medium">Are alergii</Label>
            </div>
            
            {childFormData.hasAllergies && (
              <div className="space-y-2">
                <Label htmlFor="allergiesDetails">Detalii alergii</Label>
                <Input
                  id="allergiesDetails"
                  name="allergiesDetails"
                  value={childFormData.allergiesDetails}
                  onChange={onInputChange}
                  placeholder="Specificați alergiile"
                />
              </div>
            )}
          </div>
          
          <div className="space-y-4 border p-4 rounded-md">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="hasSpecialNeeds" 
                checked={childFormData.hasSpecialNeeds}
                onCheckedChange={(checked) => 
                  onCheckboxChange('hasSpecialNeeds', checked === true)
                } 
              />
              <Label htmlFor="hasSpecialNeeds" className="font-medium">Are nevoi speciale</Label>
            </div>
            
            {childFormData.hasSpecialNeeds && (
              <div className="space-y-2">
                <Label htmlFor="specialNeedsDetails">Detalii nevoi speciale</Label>
                <Input
                  id="specialNeedsDetails"
                  name="specialNeedsDetails"
                  value={childFormData.specialNeedsDetails}
                  onChange={onInputChange}
                  placeholder="Ex: ADHD, sindrom Down, etc."
                />
              </div>
            )}
          </div>
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
