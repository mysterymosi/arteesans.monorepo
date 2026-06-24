"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { MatchSuggestion } from "@arteesans/shared";
import { DataTableColumnHeader } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { AssignSuggestionAction } from "./assign-suggestion-action";

function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}

function formatDistance(value: number | null) {
  if (value == null) return "Unknown";
  if (value < 1000) return `${Math.round(value)} m`;
  return `${(value / 1000).toFixed(1)} km`;
}

function formatAvailability(value: string | null) {
  if (!value) return "Not set";
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function ScoreCell({ value }: { value: number }) {
  return (
    <div className="flex min-w-28 flex-col gap-1">
      <div className="flex items-center gap-2">
        <Badge variant={value >= 0.75 ? "success" : value >= 0.55 ? "info" : "secondary"}>
          {formatPercent(value)}
        </Badge>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${Math.round(value * 100)}%` }}
        />
      </div>
    </div>
  );
}

export function getMatchSuggestionColumns({
  requestId,
}: {
  requestId: string;
}): ColumnDef<MatchSuggestion>[] {
  return [
    {
      accessorKey: "artisanName",
      meta: { label: "Artisan" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Artisan" />
      ),
      cell: ({ row }) => (
        <div className="min-w-48">
          <div className="font-medium text-foreground">
            {row.original.artisanName}
          </div>
          <div className="text-sm text-muted-foreground">
            {[row.original.cityLga, row.original.state].filter(Boolean).join(", ") ||
              "Location not set"}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "score",
      meta: { label: "Score" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Score" />
      ),
      cell: ({ row }) => <ScoreCell value={row.original.score} />,
    },
    {
      id: "category",
      meta: { label: "Category" },
      header: "Category",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">
            {formatPercent(row.original.breakdown.category)}
          </div>
          <div className="text-sm text-muted-foreground">
            {row.original.categoryName ?? "Matched skill"}
          </div>
        </div>
      ),
    },
    {
      id: "distance",
      meta: { label: "Distance" },
      header: "Distance",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">
            {formatPercent(row.original.breakdown.location)}
          </div>
          <div className="text-sm text-muted-foreground">
            {formatDistance(row.original.distanceMeters)}
          </div>
        </div>
      ),
    },
    {
      id: "availability",
      meta: { label: "Availability" },
      header: "Availability",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">
            {formatPercent(row.original.breakdown.availability)}
          </div>
          <div className="text-sm text-muted-foreground">
            {formatAvailability(row.original.availability)}
          </div>
        </div>
      ),
    },
    {
      id: "rating",
      meta: { label: "Rating" },
      header: "Rating",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">
            {row.original.averageRating.toFixed(1)} / 5
          </div>
          <div className="text-sm text-muted-foreground">
            {row.original.completedJobs} completed
          </div>
        </div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      header: () => <div className="text-right">Action</div>,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <AssignSuggestionAction
            requestId={requestId}
            suggestion={row.original}
          />
        </div>
      ),
    },
  ];
}
