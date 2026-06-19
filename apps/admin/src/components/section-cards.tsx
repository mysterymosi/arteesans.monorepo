import type { DashboardStats } from "@arteesans/shared";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const cards = [
  {
    key: "matchingRequests" as const,
    label: "Open requests",
    description: "Requests waiting for artisan matching",
  },
  {
    key: "pendingArtisans" as const,
    label: "Pending artisans",
    description: "Applications awaiting review",
  },
  {
    key: "activeJobs" as const,
    label: "Active jobs",
    description: "Matched or in-progress jobs",
  },
];

export function SectionCards({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3 dark:*:data-[slot=card]:bg-card">
      {cards.map((card) => (
        <Card key={card.key} className="@container/card">
          <CardHeader>
            <CardDescription>{card.label}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {stats[card.key]}
            </CardTitle>
          </CardHeader>
          <CardFooter className="text-sm text-muted-foreground">
            {card.description}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
