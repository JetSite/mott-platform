import { Cross2Icon } from "@radix-ui/react-icons";

import { FileIcon } from "~/components/icons/file-icon";

interface FileItemProps {
  file: File;
  onDelete: (name: string) => void;
}

export const FileItem = ({ file, onDelete }: FileItemProps) => {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      onDelete(file.name);
    }
  };
  return (
    <div className="relative flex h-[40px] max-w-[264px] items-center gap-3 rounded-lg border p-1">
      <FileIcon />
      <p className="text-sm font-medium">{file.name}</p>
      <div
        onClick={() => onDelete(file.name)}
        onKeyDown={handleKeyDown}
        className="absolute right-[-4px] top-[-4px] flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-gray-400 bg-white"
      >
        <Cross2Icon width={16} height={16} />
      </div>
    </div>
  );
};
