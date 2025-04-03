
import { useState } from "react";
import { Child, AgeGroup } from "@/types/models";
import { format } from "date-fns";

export function useMemberForm() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [childFormData, setChildFormData] = useState<Partial<Child>>({
    firstName: "",
    lastName: "",
    birthDate: format(new Date(), "yyyy-MM-dd"),
    ageGroup: "4-6",
    category: "Membru",
    parents: [""],
    phone: "",
    email: "",
    hasAllergies: false,
    allergiesDetails: "",
    hasSpecialNeeds: false,
    specialNeedsDetails: ""
  });
  
  const handleAddNewClick = () => {
    setIsEditing(false);
    setSelectedChildId(null);
    setChildFormData({
      firstName: "",
      lastName: "",
      birthDate: format(new Date(), "yyyy-MM-dd"),
      ageGroup: "4-6",
      category: "Membru",
      parents: [""],
      phone: "",
      email: "",
      hasAllergies: false,
      allergiesDetails: "",
      hasSpecialNeeds: false,
      specialNeedsDetails: ""
    });
    setIsDialogOpen(true);
  };
  
  const handleEditClick = (child: Child) => {
    setIsEditing(true);
    setSelectedChildId(child.id);
    setChildFormData({
      firstName: child.firstName,
      lastName: child.lastName,
      birthDate: child.birthDate,
      ageGroup: child.ageGroup,
      category: child.category,
      parents: [...child.parents],
      phone: child.phone || "",
      email: child.email || "",
      hasAllergies: child.hasAllergies || false,
      allergiesDetails: child.allergiesDetails || "",
      hasSpecialNeeds: child.hasSpecialNeeds || false,
      specialNeedsDetails: child.specialNeedsDetails || ""
    });
    setIsDialogOpen(true);
  };
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setChildFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleParentChange = (index: number, value: string) => {
    const newParents = [...(childFormData.parents || [])];
    newParents[index] = value;
    setChildFormData(prev => ({
      ...prev,
      parents: newParents
    }));
  };
  
  const handleAddParent = () => {
    setChildFormData(prev => ({
      ...prev,
      parents: [...(prev.parents || []), ""]
    }));
  };
  
  const handleRemoveParent = (index: number) => {
    const newParents = [...(childFormData.parents || [])];
    newParents.splice(index, 1);
    setChildFormData(prev => ({
      ...prev,
      parents: newParents
    }));
  };
  
  const handleCheckboxChange = (field: string, checked: boolean) => {
    setChildFormData(prev => ({
      ...prev,
      [field]: checked
    }));
  };

  const handleAgeGroupChange = (value: string) => {
    setChildFormData(prev => ({ 
      ...prev, 
      ageGroup: value as AgeGroup 
    }));
  };

  const handleCategoryChange = (value: string) => {
    setChildFormData(prev => ({ 
      ...prev, 
      category: value as "Membru" | "Guest" 
    }));
  };
  
  return {
    isDialogOpen,
    setIsDialogOpen,
    isEditing,
    selectedChildId,
    childFormData,
    handleAddNewClick,
    handleEditClick,
    handleInputChange,
    handleParentChange,
    handleAddParent,
    handleRemoveParent,
    handleCheckboxChange,
    handleAgeGroupChange,
    handleCategoryChange
  };
}
