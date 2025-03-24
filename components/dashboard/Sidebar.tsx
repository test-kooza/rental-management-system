"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Bell,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Palette,
  Plus,
  Power,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ISidebarLink, role, sidebarLinks } from "@/config/sidebar";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { NotificationMenu } from "../NotificationMenu";
import { UserDropdownMenu } from "../UserDropdownMenu";
import Logo from "../frontend/Logo";

interface SidebarProps {
  session: Session;
  notifications?: any[]; // Using any since Notification type is not defined in the provided code
}

export default function Sidebar({ session, notifications = [] }: SidebarProps) {
  const router = useRouter();
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);
  const pathname = usePathname();
  const user = session.user;

  // Helper function to check if user has the required role
  const hasRole = (allowedRoles: role[]): boolean => {
    if (!user.role) return false;
    return allowedRoles.includes(user.role as role);
  };

  // Filter sidebar links based on roles
  const filterSidebarLinks = (links: ISidebarLink[]): ISidebarLink[] => {
    return links
      .filter((link) => hasRole(link.allowedRoles))
      .map((link) => ({
        ...link,
        dropdownMenu: link.dropdownMenu?.filter((item) =>
          hasRole(item.allowedRoles)
        ),
      }))
      .filter(
        (link) =>
          !link.dropdown || (link.dropdownMenu && link.dropdownMenu.length > 0)
      );
  };

  const filteredLinks = filterSidebarLinks(sidebarLinks);

  async function handleLogout() {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="fixed top-0 left-0 h-full w-[220px] lg:w-[280px] border-r bg-muted/40 hidden md:block overflow-y-auto">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex flex-shrink-0 justify-between h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Logo/>
          <NotificationMenu notifications={notifications} />
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {filteredLinks.map((item, i) => {
              const Icon = item.icon;
              const isHrefIncluded =
                item.dropdownMenu &&
                item.dropdownMenu.some((link) => link.href === pathname);

              const isOpen = openDropdownIndex === i;

              return (
                <div key={i}>
                  {item.dropdown ? (
                    <Collapsible open={isOpen}>
                      <CollapsibleTrigger
                        onClick={() => setOpenDropdownIndex(isOpen ? null : i)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary w-full",
                          isHrefIncluded && "bg-muted text-primary"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {item.title}
                        {isOpen ? (
                          <ChevronDown className="h-5 w-5 ml-auto flex shrink-0 items-center justify-center rounded-full" />
                        ) : (
                          <ChevronRight className="h-5 w-5 ml-auto flex shrink-0 items-center justify-center rounded-full" />
                        )}
                      </CollapsibleTrigger>
                      <CollapsibleContent className="dark:bg-slate-950 rounded mt-1">
                        {item.dropdownMenu?.map((menuItem, i) => (
                          <Link
                            key={i}
                            href={menuItem.href}
                            className={cn(
                              "mx-4 flex items-center gap-3 rounded-lg px-3 py-1 text-muted-foreground transition-all hover:text-primary justify-between text-xs ml-6",
                              pathname === menuItem.href &&
                                "bg-muted text-primary"
                            )}
                          >
                            {menuItem.title}
                            <span className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                              <Plus className="w-4 h-4" />
                            </span>
                          </Link>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <Link
                      href={item.href ?? "#"}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                        pathname === item.href && "bg-muted text-primary"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.title}
                    </Link>
                  )}
                </div>
              );
            })}
            <Link
              href="/"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              target="_blank"
            >
              <ExternalLink className="h-4 w-4" />
              Live Website
            </Link>
          </nav>
        </div>

        <div 
            className="mt-4 py-3 px-3 bg-gradient-to-r from-blue-50 to-red-50 rounded-md flex items-center justify-between text-xs border border-blue-100/50 shadow-sm"
        
          >
            <div className="flex items-center gap-2 text-red-600">
              <Palette className="h-3 w-3 text-yellow-500" />
              <span>Arbnb</span>
            </div>
            <span className="text-red-600 bg-red-100 px-1.5 py-0.5 rounded-sm text-[10px] font-medium">Active</span>
          </div>
      </div>
    </div>
  );
}