import { URGENCY_LEVELS, type RequestStatus } from "@arteesans/shared";
import type { DataTableFilter } from "@/components/data-table";

const REQUEST_TABLE_STATUSES = [
  "matching",
  "submitted",
  "matched",
  "confirmed",
  "cancelled",
] satisfies RequestStatus[];

export function createRequestTableFilters(
  categories: Array<{ id: string; name: string }>,
) {
  return [
    {
      key: "status",
      label: "Status",
      allLabel: "All statuses",
      className: "w-40",
      options: REQUEST_TABLE_STATUSES.map((status) => ({
        label: status,
        value: status,
      })),
    },
    {
      key: "urgency",
      label: "Priority",
      allLabel: "All priorities",
      className: "w-40",
      options: URGENCY_LEVELS.map((urgency) => ({
        label: urgency,
        value: urgency,
      })),
    },
    {
      key: "categoryId",
      label: "Category",
      allLabel: "All categories",
      className: "w-48",
      options: categories.map((category) => ({
        label: category.name,
        value: category.id,
      })),
    },
  ] satisfies DataTableFilter[];
}
