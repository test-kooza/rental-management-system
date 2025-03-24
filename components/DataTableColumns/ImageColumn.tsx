import Image from "next/image";
import React from "react";

export default function ImageColumn({
  row,
  accessorKey,
}: {
  row: any;
  accessorKey: any;
}) {
  const imageUrl = row.getValue(`${accessorKey}`);
  // const thum = row.getValue(`${accessorKey}`);
  // console.log(imageUrl);
  return (
    <div className="shrink-0">
      <Image
        alt={`${accessorKey}`}
        className=" rounded-full object-cover"
        height="30"
        src={imageUrl ?? "/placeholder.png"}
        width="30"
      />
    </div>
  );
}
