"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import type { SidebarNavItem } from "@/types";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";

export interface MobileNavProps extends React.HTMLAttributes<HTMLDivElement> {
  items: SidebarNavItem[];
}

export function MobileNav({ items, className, ...props }: MobileNavProps) {
  const segment = useSelectedLayoutSegment();

  if (!items?.length) return null;

  return (
    <div
      className={cn("flex w-full justify-evenly gap-2", className)}
      {...props}
    >
      {items.map((item, index) => {
        const Icon =
          item.icon && Icons.hasOwnProperty(item.icon)
            ? Icons[item.icon as keyof typeof Icons]
            : Icons.arrowLeft;

        return item.href ? (
          <Link aria-label={item.title} key={index} href={item.href}>
            <span
              className={cn(
                "group flex h-full w-full items-center rounded-md border border-transparent px-3 py-2 hover:bg-muted hover:text-foreground",
                item.href.includes(String(segment))
                  ? "bg-primary font-medium text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                  : "text-muted-foreground",
                item.disabled && "pointer-events-none"
              )}
            >
              <Icon className="h-6 w-6" aria-hidden="true" />
              {item.href.includes(String(segment)) && (
                <span className="ml-2 truncate whitespace-nowrap">
                  {item.title}
                </span>
              )}
            </span>
          </Link>
        ) : (
          <span
            key={index}
            className="flex w-full cursor-not-allowed items-center rounded-md p-2 text-muted-foreground hover:underline"
          >
            {item.title}
          </span>
        );
      })}
    </div>
  );
}
