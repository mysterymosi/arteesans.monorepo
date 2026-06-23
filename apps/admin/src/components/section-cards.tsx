import Link from "next/link";
import type { DashboardStats } from "@arteesans/shared";
import {
  ArrowRightIcon,
  BriefcaseBusinessIcon,
  ClipboardListIcon,
  UserCheckIcon,
} from "lucide-react";

const metrics = [
  {
    key: "matchingRequests" as const,
    label: "Requests needing match",
    description: "Open service requests waiting for assignment.",
    href: "/requests?status=matching",
    icon: ClipboardListIcon,
  },
  {
    key: "pendingArtisans" as const,
    label: "Applications in review",
    description: "Artisan profiles pending an admin decision.",
    href: "/artisans/applications?status=pending",
    icon: UserCheckIcon,
  },
  {
    key: "activeJobs" as const,
    label: "Active jobs",
    description: "Matched work currently moving through the queue.",
    href: "/requests?status=matched",
    icon: BriefcaseBusinessIcon,
  },
];

export function SectionCards({ stats }: { stats: DashboardStats }) {
  return (
    <div className="px-4 lg:px-6">
      <div className="grid max-w-5xl gap-3 md:grid-cols-3">
        {metrics.map((metric) => (
          <Link
            key={metric.key}
            href={metric.href}
            className="group rounded-lg border bg-card p-4 transition-colors hover:border-primary/35 hover:bg-accent/50"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="grid size-9 place-items-center rounded-md bg-accent text-primary">
                <metric.icon className="size-4" />
              </div>
              <ArrowRightIcon className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
            </div>
            <div className="mt-5 text-3xl font-semibold leading-none tabular-nums">
              {stats[metric.key]}
            </div>
            <div className="mt-3 text-sm font-medium text-foreground">
              {metric.label}
            </div>
            <div className="mt-1 min-h-10 text-sm leading-5 text-muted-foreground">
              {metric.description}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
