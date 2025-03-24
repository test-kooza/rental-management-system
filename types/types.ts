import { SystemRole, User } from "@prisma/client";
import type { Notification as PrismaNotification } from "@prisma/client"


export type CategoryProps = {
  title: string;
  slug: string;
  imageUrl: string;
  description: string;
};
export type SavingProps = {
  amount: number;
  month: string;
  name: string;
  userId: string;
  paymentDate: any;
};
export interface UserProps {
  email: string;
  password: string;
  name: string;
  image?: string;
}
export interface UserProp {
  id:string;
  email: string;
  name: string;
  image?: string;
  role:SystemRole
}
export type LoginProps = {
  email: string;
  password: string;
};
export type ForgotPasswordProps = {
  email: string;
};

// types/types.ts

export interface RoleFormData {
  displayName: string;
  description?: string;
  permissions: string[];
}

export interface UserWithRoles extends User {
  // roles: Role[];
}

export interface RoleOption {
  label: string;
  value: string;
}

export interface UpdateUserRoleResponse {
  error: string | null;
  status: number;
  // data: UserWithRoles | null;
}

export interface RoleResponse {
  id: string;
  displayName: string;
  description?: string;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}
import type { Booking, Property, Address } from "@prisma/client"

export interface BookingWithProperty extends Booking {
  property: Property & {
    address?: Address | null
  }
}

export interface BookingStats {
  totalSpent: string
  bookingCount: number
  activeBookings: number
  nextCheckIn: {
    date: string | null
    propertyName: string | null
  }
  nextCheckOut: {
    date: string | null
    daysLeft: number | null
    propertyName: string | null
  }
}

export type Notification = PrismaNotification
