
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDistanceToNow, parseISO, isBefore, subDays } from "date-fns";
import { Child } from "@/types/models";
import AgeGroupBadge from "@/components/common/AgeGroupBadge";
import CategoryBadge from "@/components/common/CategoryBadge";
import NewChildBadge from "@/components/common/NewChildBadge";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

interface MemberTableProps {
  filteredChildren: Child[];
  onEditClick: (child: Child) => void;
}

const MemberTable: React.FC<MemberTableProps> = ({ filteredChildren, onEditClick }) => {
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
            <TableHead className="text-right">Acțiuni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredChildren.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center p-6 text-muted-foreground">
                Niciun copil găsit
              </TableCell>
            </TableRow>
          ) : (
            filteredChildren.map((child) => (
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
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default MemberTable;
