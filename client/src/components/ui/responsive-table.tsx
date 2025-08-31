import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ResponsiveTableProps {
  children: ReactNode;
  className?: string;
}

export function ResponsiveTable({ children, className }: ResponsiveTableProps) {
  return (
    <div className={cn("w-full", className)}>
      {/* Desktop Table */}
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <Table>
            {children}
          </Table>
        </div>
      </div>
      
      {/* Mobile Cards - will be handled by parent component */}
      <div className="md:hidden">
        {children}
      </div>
    </div>
  );
}

interface MobileCardProps {
  children: ReactNode;
  className?: string;
}

export function MobileCard({ children, className }: MobileCardProps) {
  return (
    <Card className={cn("mb-4", className)}>
      <CardContent className="p-4">
        {children}
      </CardContent>
    </Card>
  );
}

interface ResponsiveTableHeaderProps {
  children: ReactNode;
  className?: string;
}

export function ResponsiveTableHeader({ children, className }: ResponsiveTableHeaderProps) {
  return (
    <div className="hidden md:block">
      <TableHeader className={className}>
        {children}
      </TableHeader>
    </div>
  );
}

interface ResponsiveTableBodyProps {
  children: ReactNode;
  className?: string;
}

export function ResponsiveTableBody({ children, className }: ResponsiveTableBodyProps) {
  return (
    <TableBody className={className}>
      {children}
    </TableBody>
  );
}