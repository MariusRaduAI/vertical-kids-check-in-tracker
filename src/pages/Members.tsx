import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import PageHeader from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, parseISO } from "date-fns";
import AgeGroupBadge from "@/components/common/AgeGroupBadge";
import CategoryBadge from "@/components/common/CategoryBadge";
import { Child, AgeGroup } from "@/types/models";
import { Search, PlusCircle, Edit, Download, AlertTriangle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
        actions={
          <>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={handleAddNewClick}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Adaugă Copil
            </Button>
          </>
        }
      />
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Membri Înregistrați</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Caută după nume..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nume Complet</TableHead>
                  <TableHead>Data Nașterii</TableHead>
                  <TableHead>Vârstă</TableHead>
                  <TableHead>Grupa</TableHead>
                  <TableHead>Categorie</TableHead>
                  <TableHead>Părinți</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Alergii</TableHead>
                  <TableHead>Nevoi Speciale</TableHead>
                  <TableHead className="text-right">Acțiuni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredChildren.map(child => (
                  <TableRow key={child.id}>
                    <TableCell className="font-medium">{child.fullName}</TableCell>
                    <TableCell>{format(parseISO(child.birthDate), "dd.MM.yyyy")}</TableCell>
                    <TableCell>
                      <div>
                        {child.age} ani
                        {child.daysUntilBirthday === 0 ? (
                          <span className="block text-xs text-primary font-medium">
                            Astăzi e ziua lui!
                          </span>
                        ) : (
                          <span className="block text-xs text-muted-foreground">
                            {child.daysUntilBirthday} zile până la zi
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <AgeGroupBadge ageGroup={child.ageGroup} />
                    </TableCell>
                    <TableCell>
                      <CategoryBadge category={child.category} />
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px]">
                        {child.parents.map((parent, index) => (
                          <div key={index} className="text-sm">
                            {parent}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {child.phone && <div>{child.phone}</div>}
                        {child.email && <div className="text-xs text-muted-foreground">{child.email}</div>}
                      </div>
                    </TableCell>
                    <TableCell>
                      {child.hasAllergies ? (
                        <div className="flex items-start">
                          <AlertTriangle className="h-4 w-4 text-yellow-500 mr-1 mt-0.5 flex-shrink-0" />
                          <span className="text-xs">{child.allergiesDetails}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">Nu</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {child.hasSpecialNeeds ? (
                        <div className="flex items-start">
                          <AlertTriangle className="h-4 w-4 text-blue-500 mr-1 mt-0.5 flex-shrink-0" />
                          <span className="text-xs">{child.specialNeedsDetails}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">Nu</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleEditClick(child)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nume</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={childFormData.lastName}
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ageGroup">Grupa de Vârstă</Label>
                <Select
                  name="ageGroup"
                  value={childFormData.ageGroup}
                  onValueChange={(value) => 
                    setChildFormData(prev => ({ ...prev, ageGroup: value as AgeGroup }))
                  }
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
                onValueChange={(value) => 
                  setChildFormData(prev => ({ ...prev, category: value as "Membru" | "Guest" }))
                }
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
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Părinți</Label>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={handleAddParent}
                >
                  + Adaugă
                </Button>
              </div>
              {childFormData.parents?.map((parent, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={parent}
                    onChange={(e) => handleParentChange(index, e.target.value)}
                    placeholder="Nume părinte"
                  />
                  {childFormData.parents!.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      type="button"
                      onClick={() => handleRemoveParent(index)}
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
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={childFormData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="space-y-4 border p-4 rounded-md">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="hasAllergies" 
                  checked={childFormData.hasAllergies}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange('hasAllergies', checked === true)
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
                    onChange={handleInputChange}
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
                    handleCheckboxChange('hasSpecialNeeds', checked === true)
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
                    onChange={handleInputChange}
                    placeholder="Ex: ADHD, sindrom Down, etc."
                  />
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Anulează
            </Button>
            <Button onClick={handleSaveChild}>
              {isEditing ? "Salvează Modificările" : "Adaugă Copil"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MembersPage;
