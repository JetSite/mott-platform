interface OptionItemProps {
  icon: JSX.Element;
  title: string;
  subtitle: string;
}

export const OptionItem = ({ icon, title, subtitle }: OptionItemProps) => {
  return (
    <div className="flex h-[60px] gap-2">
      {icon}
      <div>
        <span className="text-lg font-semibold text-black">{title}</span>
        <p className="text-[12px] text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
};
