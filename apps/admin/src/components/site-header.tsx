"use client";

import Link from "next/link";
import * as React from "react";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

type BreadcrumbPart = {
  label: string;
  href?: string;
};

function formatSegment(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getBreadcrumbs(pathname: string): BreadcrumbPart[] {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return [{ label: "Overview" }];
  }

  if (segments[0] === "requests") {
    const crumbs: BreadcrumbPart[] = [
      { label: "Requests", href: "/requests" },
    ];

    if (segments[1]) {
      crumbs.push({
        label: segments[1],
        href: segments[2] ? `/requests/${segments[1]}` : undefined,
      });
    }

    if (segments[2] === "match") {
      crumbs.push({ label: "Match artisan" });
    }

    return crumbs;
  }

  if (segments[0] === "artisans" && segments[1] === "applications") {
    const crumbs: BreadcrumbPart[] = [
      { label: "Applications", href: "/artisans/applications" },
    ];

    if (segments[2]) {
      crumbs.push({ label: "Application detail" });
    }

    return crumbs;
  }

  if (segments[0] === "categories") {
    return [{ label: "Categories" }];
  }

  return segments.map((segment, index) => ({
    label: formatSegment(segment),
    href:
      index === segments.length - 1
        ? undefined
        : `/${segments.slice(0, index + 1).join("/")}`,
  }));
}

export function SiteHeader() {
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);

  return (
    <header className="flex h-(--header-height) shrink-0 items-center border-b bg-card py-4">
      <div className="flex w-full items-center gap-2 px-4 lg:px-5">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 h-4 data-vertical:self-auto"
        />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((breadcrumb, index) => {
              const isLast = index === breadcrumbs.length - 1;

              return (
                <React.Fragment key={`${breadcrumb.label}-${index}`}>
                  <BreadcrumbItem>
                    {breadcrumb.href && !isLast ? (
                      <BreadcrumbLink render={<Link href={breadcrumb.href} />}>
                        {breadcrumb.label}
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                  {!isLast ? <BreadcrumbSeparator /> : null}
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
