import Link from "next/link";

interface OptionItemProps {
  icon: JSX.Element;
  title: string;
  subtitle: string;
  path: string;
}

export const OptionItem = ({
  icon,
  title,
  subtitle,
  path,
}: OptionItemProps) => {
  return (
    <div className="flex h-[60px] gap-2">
      {icon}
      <div>
        <Link className="text-lg font-semibold text-black" href={path}>
          {title}
        </Link>
        <p className="text-[12px] text-neutral-500">{subtitle}</p>
      </div>
    </div>
  );
};
