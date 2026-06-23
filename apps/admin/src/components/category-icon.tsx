import { createElement } from "react";
import {
  ArmchairIcon,
  BathIcon,
  BoltIcon,
  BrushIcon,
  Building2Icon,
  DropletIcon,
  HammerIcon,
  HomeIcon,
  PaintRollerIcon,
  PlugIcon,
  SparklesIcon,
  WrenchIcon,
  type LucideIcon,
} from "lucide-react";

const categoryIconRules: Array<[RegExp, LucideIcon]> = [
  [/bath|toilet|sink/i, BathIcon],
  [/plumb|pipe|water|heater/i, DropletIcon],
  [/electric|power|wire|light|socket/i, BoltIcon],
  [/install|ac|hvac|appliance/i, PlugIcon],
  [/paint|painting/i, PaintRollerIcon],
  [/clean/i, SparklesIcon],
  [/carpent|wood|furniture|cabinet/i, ArmchairIcon],
  [/renovat|repair|fix|maintenance/i, HammerIcon],
  [/build|mason|construction|partition/i, Building2Icon],
  [/home|house|interior/i, HomeIcon],
  [/design|decor/i, BrushIcon],
];

export function getCategoryIcon(categoryName: string | null | undefined) {
  const normalizedName = categoryName?.trim() ?? "";
  return (
    categoryIconRules.find(([pattern]) => pattern.test(normalizedName))?.[1] ??
    WrenchIcon
  );
}

export function CategoryIcon({
  categoryName,
  className,
}: {
  categoryName: string | null | undefined;
  className?: string;
}) {
  return createElement(getCategoryIcon(categoryName), {
    "aria-hidden": true,
    className,
  });
}
