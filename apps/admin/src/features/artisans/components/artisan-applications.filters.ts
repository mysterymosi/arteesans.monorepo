import {
  VERIFICATION_STATUSES,
  type VerificationStatus,
} from "@arteesans/shared";
import type { DataTableFilter } from "@/components/data-table";

export const artisanApplicationFilters = [
  {
    key: "status",
    label: "Status",
    defaultValue: "pending",
    className: "w-44",
    options: VERIFICATION_STATUSES.map((status: VerificationStatus) => ({
      label: status,
      value: status,
    })),
  },
] satisfies DataTableFilter[];
