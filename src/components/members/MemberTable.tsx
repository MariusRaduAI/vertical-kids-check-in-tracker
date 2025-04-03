
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDistanceToNow, parseISO, isBefore, subDays } from "date-fns";
import { Child } from "@/types/models";
import AgeGroupBadge from "@/components/common/AgeGroupBadge";
import CategoryBadge from "@/components/common/CategoryBadge";
import NewChildBadge from "@/components/common/NewChildBadge";
import { Button } from "@/components/ui/button";
import { Edit, Users } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MemberTableProps {
  filteredChildren: Child[];
  onEditClick: (child: Child) => void;
}

const MemberTable: React.FC<MemberTableProps> = ({ filteredChildren, onEditClick }) => {
  const { getSiblings } = useApp();
  
  // Helper function to check if a date is less than 30 days old
  const isNew = (date?: string) => {
    if (!date) return false;
    const thirtyDaysAgo = subDays(new Date(), 30);
    return isBefore(thirtyDaysAgo, parseISO(date));
  };
  
  return (
    <div className="rounded-md border overflow-hidden">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Nume</TableHead>
            <TableHead>Grupa</TableHead>
            <TableHead className="hidden md:table-cell">Părinți</TableHead>
            <TableHead className="hidden md:table-cell">Adăugat</TableHead>
            <TableHead className="hidden sm:table-cell">Frați/Surori</TableHead>
            <TableHead className="text-right">Acțiuni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredChildren.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center p-6 text-muted-foreground">
                Niciun copil găsit
              </TableCell>
            </TableRow>
          ) : (
            filteredChildren.map((child) => {
              // Get siblings for this child
              const siblings = getSiblings(child.id);
              const siblingNames = siblings.map(s => s.fullName).join(", ");
              
              return (
                <TableRow key={child.id}>
                  <TableCell>
                    <div className="font-medium">{child.fullName}</div>
                    <div className="flex items-center space-x-1 mt-1">
                      <CategoryBadge category={child.category} />
                      {isNew(child.firstAttendanceDate) && <NewChildBadge />}
                    </div>
                  </TableCell>
                  <TableCell>
                    <AgeGroupBadge ageGroup={child.ageGroup} />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {child.parents.join(", ")}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {formatDistanceToNow(parseISO(child.createdAt), { addSuffix: true })}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {siblings.length > 0 ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center text-sm text-cyan-600 cursor-default">
                              <Users className="h-4 w-4 mr-1" />
                              <span>{siblings.length}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{siblingNames}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditClick(child)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editează
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default MemberTable;
