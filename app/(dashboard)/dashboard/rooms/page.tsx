import React from "react";
import { columns } from "./columns";
import DataTable from "@/components/DataTableComponents/DataTable";
import { getUserRooms } from "@/actions/rooms";
import TableHeader from "@/components/dashboard/Tables/TableHeader";

export default async function page() {
  const rooms = await getUserRooms() || []
  return (
    <div className="p-1">
       <TableHeader
        title="Rooms"
        linkTitle="Add Room"
        href="/dashboard/rooms/new"
        data={rooms}
         model="room"
       />
        <DataTable data={rooms} columns={columns} />
    </div>
  );
}
