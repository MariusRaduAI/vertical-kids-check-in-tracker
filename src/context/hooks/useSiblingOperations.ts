
import { Child } from "@/types/models";

export function useSiblingOperations(
  getChildById: (id: string) => Child | undefined,
  updateChild: (id: string, data: Partial<Child>) => Child,
  children: Child[]
) {
  const getSiblings = (childId: string) => {
    const child = getChildById(childId);
    if (!child || !child.siblingIds || child.siblingIds.length === 0) {
      return [];
    }
    
    return children.filter(c => child.siblingIds?.includes(c.id));
  };
  
  const addSibling = (childId: string, siblingId: string) => {
    if (childId === siblingId) return;
    
    const child = getChildById(childId);
    const sibling = getChildById(siblingId);
    
    if (!child || !sibling) return;
    
    // Update the child's siblings
    const childSiblingIds = [...(child.siblingIds || [])];
    if (!childSiblingIds.includes(siblingId)) {
      childSiblingIds.push(siblingId);
      updateChild(childId, { siblingIds: childSiblingIds });
    }
    
    // Update the sibling's siblings
    const siblingIds = [...(sibling.siblingIds || [])];
    if (!siblingIds.includes(childId)) {
      siblingIds.push(childId);
      updateChild(siblingId, { siblingIds });
    }
  };
  
  const removeSibling = (childId: string, siblingId: string) => {
    const child = getChildById(childId);
    const sibling = getChildById(siblingId);
    
    if (!child || !sibling) return;
    
    // Remove sibling from child
    if (child.siblingIds) {
      const updatedSiblingIds = child.siblingIds.filter(id => id !== siblingId);
      updateChild(childId, { siblingIds: updatedSiblingIds });
    }
    
    // Remove child from sibling
    if (sibling.siblingIds) {
      const updatedSiblingIds = sibling.siblingIds.filter(id => id !== childId);
      updateChild(siblingId, { siblingIds: updatedSiblingIds });
    }
  };

  return {
    getSiblings,
    addSibling,
    removeSibling
  };
}
