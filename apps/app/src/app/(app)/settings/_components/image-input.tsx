import Image from "next/image";
import { useRef, useState } from "react";

import { Button } from "@mott/ui/button";
import { Input } from "@mott/ui/input";

import { toBase64 } from "~/utils/toBase64";

interface ImageInputProps {
  defaultLogo: string;
  title: string;
  placeholder: string;
}

export const ImageInput = ({
  defaultLogo,
  title,
  placeholder,
}: ImageInputProps) => {
  const [image, setImage] = useState<string>(defaultLogo);
  const imageRef = useRef<HTMLInputElement>(null);

  const onAddImage = async (file?: File) => {
    if (!file) {
      return;
    }

    const srcImage = (await toBase64(file)) as string;

    setImage(srcImage);
  };

  const handleSelectImage = () => {
    if (!imageRef.current) {
      return;
    }

    imageRef.current.click();
  };

  return (
    <div className="flex items-center gap-3">
      <Input
        ref={imageRef}
        className="hidden"
        type="file"
        multiple
        placeholder={placeholder}
        accept="image/*"
        onChange={(e) => onAddImage(e.target.files?.[0])}
      />

      <Image
        src={image}
        width={44}
        height={44}
        alt={placeholder}
        className="h-11 w-11"
      />

      <Button size="md" variant="outline" onClick={handleSelectImage}>
        {title}
      </Button>
    </div>
  );
};
