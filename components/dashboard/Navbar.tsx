"use client";
import React, { useState } from "react";
import Link from "next/link";
import { 
  ChevronDown, 
  ChevronRight, 
  ExternalLink, 
  Menu, 
  Plus, 
  Power 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { Session } from "next-auth";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { ISidebarLink, role, sidebarLinks } from "@/config/sidebar";
import { UserDropdownMenu } from "../UserDropdownMenu";
import { NotificationMenu } from "../NotificationMenu";
import Logo from "../frontend/Logo";

export default function Navbar({ session, notifications = [] }: { session: Session, notifications?: any[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const user = session.user;
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);

  // Helper function to check if user has the required role
  const hasRole = (allowedRoles: role[]): boolean => {
    if (!user.role) return false;
    return allowedRoles.includes(user.role as role);
  };

  // Filter sidebar links based on roles - same logic as desktop sidebar
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
      router.push("/login");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-muted/60 px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col overflow-y-auto">
          <div className="flex items-center justify-between mb-4 py-2 border-b">
            <Logo />
            <NotificationMenu notifications={notifications} />
          </div>
          
          <nav className="grid gap-2 text-sm font-medium flex-1">
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

          <div className="mt-auto pt-4 border-t">
            <UserDropdownMenu
              username={session?.user?.name ?? ""}
              email={session?.user?.email ?? ""}
              avatarUrl={
                session?.user?.image ??
                "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%20(54)-NX3G1KANQ2p4Gupgnvn94OQKsGYzyU.png"
              }
            />
            <Button onClick={handleLogout} size="sm" className="w-full mt-4">
              Logout
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <div className="w-full flex-1"></div>
      <div className="md:hidden">
        <NotificationMenu notifications={notifications} />
      </div>
      <div className="p-4 hidden md:block">
        <UserDropdownMenu
          username={session?.user?.name ?? ""}
          email={session?.user?.email ?? ""}
          avatarUrl={
            session?.user?.image ??
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%20(54)-NX3G1KANQ2p4Gupgnvn94OQKsGYzyU.png"
          }
        />
      </div>
    </header>
  );
}