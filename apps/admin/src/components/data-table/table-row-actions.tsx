"use client";

import { MoreHorizontalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type TableRowAction = {
  label: string;
  onSelect?: () => void;
  render?: React.ReactElement;
  disabled?: boolean;
  destructive?: boolean;
};

export function TableRowActions({
  actions,
  label = "Open row actions",
}: {
  actions: TableRowAction[];
  label?: string;
}) {
  const visibleActions = actions.filter(Boolean);

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button type="button" variant="outline" size="icon-sm" />}
        >
          <MoreHorizontalIcon />
          <span className="sr-only">{label}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuGroup>
            {visibleActions.map((action) => (
              <DropdownMenuItem
                key={action.label}
                render={action.render}
                disabled={action.disabled}
                variant={action.destructive ? "destructive" : "default"}
                onClick={action.onSelect}
              >
                {action.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
