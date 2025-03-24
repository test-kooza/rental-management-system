"use client";
import { X } from "lucide-react";
import Image from "next/image";
import React from "react";
import { CardDescription, CardHeader, CardTitle } from "../ui/card";
import { UploadButton } from "@/lib/uploadthing";

export default function ImageUploader({ label, imageUrls, setImageUrls, endpoint }: any) {
  const handleImageRemove = (index: any) => {
    const updatedImages = imageUrls.filter((_: any, i: any) => i !== index);
    setImageUrls(updatedImages);
  };

  return (
    <div className="grid auto-rows-max items-start gap-4">
      <CardHeader className="px-0">
        <CardTitle className="text-xl font-semibold">{label}</CardTitle>
        <CardDescription className="text-sm text-gray-500">
          Upload images (500x500 recommended)
        </CardDescription>
      </CardHeader>

      <div className="grid gap-4">
        {imageUrls && imageUrls.length > 0 ? (
          <>
            <div className="relative aspect-square w-full max-w-[500px] mx-auto overflow-hidden">
              <Image
                alt={label}
                className="rounded-lg object-contain shadow-md hover:shadow-lg transition-shadow w-full h-auto"
                height={500}
                width={500}
                src={imageUrls[0]}
                priority
              />
              <button
                className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors"
                onClick={() => handleImageRemove(0)}
                aria-label="Remove image"
              >
                <X className="h-5 w-5 text-red-500" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {imageUrls.slice(1, 4).map((imgUrl: string, index: any) => (
                <div key={index} className="relative aspect-square overflow-hidden">
                  <Image
                    alt={`${label} thumbnail ${index + 2}`}
                    className="rounded-lg object-contain shadow-md hover:shadow-lg transition-shadow w-full h-auto"
                    height={500}
                    width={500}
                    src={imgUrl}
                  />
                  <button
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors"
                    onClick={() => handleImageRemove(index + 1)}
                    aria-label="Remove image"
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="relative aspect-square w-full max-w-[500px] mx-auto overflow-hidden">
              <Image
                alt="Main placeholder"
                className="rounded-lg object-contain bg-gray-100 w-full h-auto"
                height={500}
                width={500}
                src="/placeholder.jpg"
                priority
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="relative aspect-square overflow-hidden">
                  <Image
                    alt={`Placeholder ${index + 1}`}
                    className="rounded-lg object-contain bg-gray-100 w-full h-auto"
                    height={500}
                    width={500}
                    src="/placeholder.jpg"
                  />
                </div>
              ))}
            </div>
          </>
        )}

        <div className="mt-2">
          <UploadButton
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
              const newImages = res.map((item) => item.url);
              setImageUrls([...imageUrls, ...newImages]);
            }}
            appearance={{
              button: "bg-primary hover:bg-primary/90 text-white transition-colors",
              allowedContent: "text-sm text-gray-500",
            }}
          />
        </div>
      </div>
    </div>
  );
}
