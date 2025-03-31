
import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import PageHeader from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Child, AgeGroup } from "@/types/models";

// Import refactored components
import MemberTable from "@/components/members/MemberTable";
import MemberFilters from "@/components/members/MemberFilters";
import AddEditMemberDialog from "@/components/members/AddEditMemberDialog";
import MemberActions from "@/components/members/MemberActions";

const MembersPage: React.FC = () => {
  const { children, addChild, updateChild } = useApp();
  
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [childFormData, setChildFormData] = useState<Partial<Child>>({
    firstName: "",
    lastName: "",
    birthDate: "",
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
  
  const getFilteredChildren = () => {
    if (!searchQuery) return children;
    
    const query = searchQuery.toLowerCase();
    return children.filter(child => 
      child.fullName.toLowerCase().includes(query) ||
      child.parents.some(parent => parent.toLowerCase().includes(query))
    );
  };
  
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
  
  const handleSaveChild = () => {
    if (!childFormData.firstName || !childFormData.lastName) {
      return;
    }
    
    const fullName = `${childFormData.firstName} ${childFormData.lastName}`;
    
    if (isEditing && selectedChildId) {
      updateChild(selectedChildId, {
        ...childFormData,
        fullName
      });
    } else {
      addChild({
        firstName: childFormData.firstName || "",
        lastName: childFormData.lastName || "",
        fullName: fullName,
        birthDate: childFormData.birthDate || format(new Date(), "yyyy-MM-dd"),
        age: 0,
        daysUntilBirthday: 0,
        ageGroup: childFormData.ageGroup as AgeGroup,
        category: childFormData.category as "Membru" | "Guest",
        parents: childFormData.parents || [],
        phone: childFormData.phone,
        email: childFormData.email,
        hasAllergies: childFormData.hasAllergies,
        allergiesDetails: childFormData.allergiesDetails,
        hasSpecialNeeds: childFormData.hasSpecialNeeds,
        specialNeedsDetails: childFormData.specialNeedsDetails
      });
    }
    
    setIsDialogOpen(false);
  };
  
  const filteredChildren = getFilteredChildren();

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Centralizator Membri"
        description="Gestionarea profilelor copiilor înregistrați"
        actions={<MemberActions onAddNewClick={handleAddNewClick} />}
      />
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Membri Înregistrați</CardTitle>
          <MemberFilters 
            searchQuery={searchQuery} 
            onSearchChange={setSearchQuery} 
          />
        </CardHeader>
        <CardContent>
          <MemberTable 
            filteredChildren={filteredChildren} 
            onEditClick={handleEditClick} 
          />
        </CardContent>
      </Card>
      
      <AddEditMemberDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        isEditing={isEditing}
        childFormData={childFormData}
        onInputChange={handleInputChange}
        onParentChange={handleParentChange}
        onAddParent={handleAddParent}
        onRemoveParent={handleRemoveParent}
        onCheckboxChange={handleCheckboxChange}
        onSave={handleSaveChild}
        onAgeGroupChange={handleAgeGroupChange}
        onCategoryChange={handleCategoryChange}
      />
    </div>
  );
};

export default MembersPage;
