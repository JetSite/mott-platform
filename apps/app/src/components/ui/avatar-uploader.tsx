"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { UploadCloud } from "lucide-react";

import { cn } from "@mott/ui";
import { toast } from "@mott/ui/toast";

interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

interface AvatarUploaderProps {
  rounded?: boolean;
  name?: string;
}

const MAX_FILE_SIZE_MB = 2;
const ALLOWED_FILE_TYPES = ["image/png", "image/jpeg"] as const;

export default function AvatarUploader({
  rounded = false,
  name = "image",
}: AvatarUploaderProps) {
  const [image, setImage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const validateFile = useCallback((file: File): FileValidationResult => {
    if (file.size / 1024 / 1024 > MAX_FILE_SIZE_MB) {
      return {
        isValid: false,
        error: `File size too big (max ${MAX_FILE_SIZE_MB}MB)`,
      };
    }

    if (
      !ALLOWED_FILE_TYPES.includes(
        file.type as (typeof ALLOWED_FILE_TYPES)[number],
      )
    ) {
      return {
        isValid: false,
        error: "File type not supported (.png or .jpg only)",
      };
    }

    return { isValid: true };
  }, []);

  const handleFileRead = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Here you would typically upload the image to your server
    toast.success("Image uploaded successfully");
  }, []);

  const onChangePicture = useCallback(
    (file: File) => {
      const validation = validateFile(file);
      if (!validation.isValid) {
        toast.error(validation.error);
        return;
      }
      handleFileRead(file);
    },
    [validateFile, handleFileRead],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      const file = e.dataTransfer.files[0];
      if (file) {
        onChangePicture(file);
      }
    },
    [onChangePicture],
  );

  const handleDragEvents = useCallback(
    (e: React.DragEvent<HTMLDivElement>, isDragActive: boolean) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(isDragActive);
    },
    [],
  );

  const roundedClass = rounded ? "rounded-full" : "rounded-md";

  return (
    <div className="mt-4">
      <label
        htmlFor={name}
        className={cn(
          "hover:bg-background-subtle group relative mt-1 flex h-11 w-11 cursor-pointer flex-col items-center justify-center border border-border bg-background shadow-sm transition-all",
          roundedClass,
        )}
      >
        <div
          className={cn("absolute z-[5] h-full w-full", roundedClass)}
          onDragOver={(e) => handleDragEvents(e, true)}
          onDragEnter={(e) => handleDragEvents(e, true)}
          onDragLeave={(e) => handleDragEvents(e, false)}
          onDrop={handleDrop}
        />
        <div
          className={cn(
            `${
              dragActive
                ? "cursor-copy border-2 border-black bg-gray-50 opacity-100"
                : ""
            } absolute z-[3] flex h-full w-full flex-col items-center justify-center bg-white transition-all ${
              image
                ? "opacity-0 group-hover:opacity-100"
                : "group-hover:bg-gray-50"
            }`,
            roundedClass,
          )}
        >
          <UploadCloud
            className={`${
              dragActive ? "scale-110" : "scale-100"
            } h-5 w-5 text-gray-500 transition-all duration-75 group-hover:scale-110 group-active:scale-95`}
          />
        </div>
        {image && (
          <Image
            src={image}
            alt="Preview"
            className={cn("h-full w-full object-cover", roundedClass)}
            width={44}
            height={44}
          />
        )}
      </label>
      <input
        id={name}
        name={name}
        type="file"
        accept={ALLOWED_FILE_TYPES.join(",")}
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            onChangePicture(file);
          }
        }}
      />
    </div>
  );
}
