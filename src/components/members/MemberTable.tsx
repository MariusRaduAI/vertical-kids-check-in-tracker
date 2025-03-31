
import React from "react";
import { Child } from "@/types/models";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format, parseISO } from "date-fns";
import AgeGroupBadge from "@/components/common/AgeGroupBadge";
import CategoryBadge from "@/components/common/CategoryBadge";
import { AlertTriangle, Edit } from "lucide-react";

interface MemberTableProps {
  filteredChildren: Child[];
  onEditClick: (child: Child) => void;
}

const MemberTable: React.FC<MemberTableProps> = ({ 
  filteredChildren, 
  onEditClick 
}) => {
  return (
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
                <Button variant="ghost" size="sm" onClick={() => onEditClick(child)}>
                  <Edit className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MemberTable;
