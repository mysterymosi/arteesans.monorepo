import Link from "next/link";
import { ChevronLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DetailBackButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Button
      nativeButton={false}
      render={<Link href={href} />}
      variant="link"
      className="h-auto w-fit px-0 text-base"
    >
      <ChevronLeftIcon className="size-5" />
      {children}
    </Button>
  );
}
