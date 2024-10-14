import { Button } from "@mott/ui/button";

export const ConnectionBanner = () => {
  return (
    <div className="relative mb-[54px] w-[349px] rounded-lg shadow-[0px_4px_9px_7px_rgba(0,0,0,0.04)]">
      <div className="h-[152px] w-full rounded-lg bg-[#FFF7ED]"></div>
      <div className="absolute top-2 h-[152px] w-full rounded-lg border border-white bg-[#FFF7ED]"></div>
      <div className="absolute top-4 h-[152px] w-full rounded-lg border border-white bg-[#FFF7ED] p-[14px]">
        <h3 className="text-lg font-semibold"> Data Connections Needed</h3>
        <span className="text-sm text-black">
          To analyze your the data, we need to have an access. Your data is safe
          and fully protected.
        </span>
        <Button
          variant="primary"
          size="lg"
          aria-label="Connect"
          className="mt-2 w-full"
        >
          Connect
        </Button>
      </div>

      <div className="absolute right-0 top-0 flex h-[31px] w-[31px] items-center justify-center rounded-full bg-[#FF0000] text-white">
        3
      </div>
    </div>
  );
};
