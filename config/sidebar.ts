import {
  BaggageClaim,
  BarChart2,
  BarChart4,
  Book,
  BookA,
  Cable,
  CircleDollarSign,
  CircleSlashIcon,
  FolderTree,
  Heart,
  Home,
  House,
  HouseIcon,
  Key,
  LucideIcon,
  Presentation,
  Settings,
  Users,
} from "lucide-react";

export type role = "USER" | "HOST" | "ADMIN";

export interface ISidebarLink {
  title: string;
  href?: string;
  icon: LucideIcon;
  dropdown: boolean;
  allowedRoles: role[]; 
  dropdownMenu?: MenuItem[];
}

type MenuItem = {
  title: string;
  href: string;
  allowedRoles: role[];
};

export const sidebarLinks: ISidebarLink[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
    dropdown: false,
    allowedRoles: ["USER", "HOST", "ADMIN"], // Everyone can view dashboard
  },
  {
    title: "Users",
    icon: Users,
    href: "/dashboard/users",
    dropdown: true,
    allowedRoles: ["ADMIN"], // Only ADMIN can manage users
    dropdownMenu: [
      {
        title: "Users",
        href: "/dashboard/users",
        allowedRoles: ["ADMIN"],
      },
   
    
    ],
  },
  {
    title: "Property Categories",
    icon: BaggageClaim,
    dropdown: true,
    href: "/dashboard/property-category",
    allowedRoles: [ "ADMIN"],
    dropdownMenu: [
      {
        title: "Categories",
        href: "/dashboard/property-category",
        allowedRoles: [ "ADMIN"],
      },
      
    ],
  },
  
  {
    title: "Financials",
    icon: CircleSlashIcon,
    dropdown: false,
    href: "/dashboard/financials",
    allowedRoles: ["HOST", "ADMIN"], 
  },
  {
    title: "Bookings",
    icon: BookA,
    dropdown: false,
    href: "/dashboard/bookings",
    allowedRoles: ["USER"], 
  },
  {
    title: "Reservations",
    icon: Book,
    dropdown: false,
    href: "/dashboard/reservation-overview",
    allowedRoles: ["HOST", "ADMIN"], 
  },
  {
    title: "Properties",
    icon: House,
    dropdown: false,
    href: "/dashboard/properties",
    allowedRoles: ["ADMIN" , "HOST"], 
  },
  {
    title: "Rooms",
    icon: HouseIcon,
    dropdown: false,
    href: "/dashboard/rooms",
    allowedRoles: ["ADMIN" , "HOST"], 
  },

  {
    title: "WishList",
    href: "/wishlist",
    icon: Heart,
    dropdown: false,
    allowedRoles: ["ADMIN"  , "USER" , "HOST"],
  },
  {
    title: "Notifications",
    href: "/dashboard/notifications",
    icon: Heart,
    dropdown: false,
    allowedRoles: ["ADMIN"  , "USER" , "HOST"],
  },
 
  {
    title: "Reports",
    icon: BarChart4,
    dropdown: true,
    href: "/dashboard",
    allowedRoles: ["HOST", "ADMIN"], 
  },
  {
    title: "Change password",
    icon: Key,
    dropdown: true,
    href: "/change-password",
    allowedRoles: ["HOST", "ADMIN" , "USER"], 
   
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    dropdown: false,
    allowedRoles: ["ADMIN"  , "USER" , "HOST"],
  },
];