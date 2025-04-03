
import React from "react";
import { useApp } from "@/context/AppContext";
import PageHeader from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Child } from "@/types/models";

// Import components and hooks
import MemberTable from "@/components/members/MemberTable";
import MemberFilters from "@/components/members/MemberFilters";
import AddEditMemberDialog from "@/components/members/AddEditMemberDialog";
import MemberActions from "@/components/members/MemberActions";
import { useMemberForm } from "@/hooks/useMemberForm";

const MembersPage: React.FC = () => {
  const { children, addChild, updateChild } = useApp();
  
  // State for search filtering
  const [searchQuery, setSearchQuery] = React.useState("");
  
  // Custom hook for form management
  const {
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
  } = useMemberForm();
  
  // Filter children based on search query
  const getFilteredChildren = () => {
    if (!searchQuery) return children;
    
    const query = searchQuery.toLowerCase();
    return children.filter(child => 
      child.fullName.toLowerCase().includes(query) ||
      child.parents.some(parent => parent.toLowerCase().includes(query))
    );
  };
  
  const filteredChildren = getFilteredChildren();
  
  // Save child handler
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
        birthDate: childFormData.birthDate || "",
        age: 0,
        daysUntilBirthday: 0,
        ageGroup: childFormData.ageGroup!,
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
