import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";
import { X } from "lucide-react"; // Import the X icon from lucide-react
import React from "react";

type ImageInputProps = {
  title: string;
  imageUrl: string;
  setImageUrl: (url: string) => void;
  endpoint: any;
};

export default function ImageInput({
  title,
  imageUrl,
  setImageUrl,
  endpoint,
}: ImageInputProps) {
  return (
    <Card className="overflow-hidden relative">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative grid gap-2">
          {imageUrl && (
            <>
              <Image
                alt={title}
                className="h-40 w-full object-cover"
                height="300"
                src={imageUrl}
                width="300"
              />
              {/* Remove Icon */}
              <button
                onClick={() => setImageUrl("")}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </>
          )}
          <UploadButton
            className="col-span-full"
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
              console.log("Files: ", res);
              setImageUrl(res[0].url);
            }}
            onUploadError={(error: Error) => {
              alert(`ERROR! ${error.message}`);
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
