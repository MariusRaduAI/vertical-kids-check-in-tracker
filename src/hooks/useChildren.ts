
import { useState, useEffect } from "react";
import { Child } from "@/types/models";
import { useToast } from "@/hooks/use-toast";

export const useChildren = (initialChildren: Child[]) => {
  const [children, setChildren] = useState<Child[]>(initialChildren);
  const { toast } = useToast();

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('scoala-duminicala-children', JSON.stringify(children));
  }, [children]);

  const addChild = (childData: Omit<Child, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString();
    const newChild: Child = {
      ...childData,
      id: `child-${Date.now()}`, // Using timestamp for more unique IDs
      createdAt: now,
      updatedAt: now,
    };
    
    setChildren((prev) => [...prev, newChild]);
    toast({
      title: "Copil adăugat",
      description: `${newChild.fullName} a fost adăugat cu succes.`,
    });
    
    return newChild;
  };
  
  const updateChild = (id: string, data: Partial<Child>) => {
    const childIndex = children.findIndex((c) => c.id === id);
    if (childIndex === -1) {
      throw new Error(`Copilul cu ID-ul ${id} nu a fost găsit.`);
    }
    
    const updatedChild = {
      ...children[childIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    
    const newChildren = [...children];
    newChildren[childIndex] = updatedChild;
    setChildren(newChildren);
    
    toast({
      title: "Copil actualizat",
      description: `${updatedChild.fullName} a fost actualizat cu succes.`,
    });
    
    return updatedChild;
  };
  
  const getChildById = (id: string) => {
    return children.find((c) => c.id === id);
  };
  
  const searchChildren = (query: string) => {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    return children.filter(
      (child) =>
        child.fullName.toLowerCase().includes(lowerQuery) ||
        child.firstName.toLowerCase().includes(lowerQuery) ||
        child.lastName.toLowerCase().includes(lowerQuery)
    );
  };

  return {
    children,
    setChildren,
    addChild,
    updateChild,
    getChildById,
    searchChildren,
  };
};
