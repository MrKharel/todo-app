import { Link } from "@tanstack/react-router";
import { cn } from "cn";

import { HouseIcon, PlusIcon, Trash2Icon } from "lucide-react";

import type { LinkProps } from "@tanstack/react-router";

type NavTo = Extract<LinkProps["to"], "/" | "/create" | "/deleted">;

const ITEMS: { to: NavTo; label: string; icon: typeof HouseIcon }[] = [
  { to: "/", label: "Home", icon: HouseIcon },
  { to: "/create", label: "Create", icon: PlusIcon },
  { to: "/deleted", label: "Deleted", icon: Trash2Icon },
];

export function Nav() {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur"
    >
      <ul className="mx-auto grid max-w-md grid-cols-3 items-center">
        {ITEMS.map(({ to, label, icon: Icon }) => {
          const isCreate = to === "/create";
          return (
            <li key={to}>
              <Link
                to={to}
                activeOptions={{ exact: true }}
                className={cn(
                  "group flex flex-col items-center gap-1 py-2 text-xs font-medium text-muted-foreground outline-none transition-colors focus-visible:text-foreground data-[status=active]:text-foreground",
                  isCreate && "-mt-5",
                )}
              >
                <span
                  className={cn(
                    "flex items-center justify-center rounded-full transition-colors",
                    isCreate
                      ? "size-12 bg-primary text-primary-foreground shadow-md group-focus-visible:ring-[3px] group-focus-visible:ring-ring/50"
                      : "h-7 w-12 group-data-[status=active]:bg-secondary",
                  )}
                >
                  <Icon className={isCreate ? "size-6" : "size-5"} />
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
