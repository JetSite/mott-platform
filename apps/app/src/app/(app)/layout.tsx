import { Header } from "~/components/header";
import { Sidebar } from "./home/_components/sidebar";

export default function AppLayout(props: { children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col bg-[#F8F8F8] px-[100px] pb-12 max-md:px-0">
      <div className="m-auto max-w-[1280px]">
        <Header />
        <div className="m-auto flex gap-[20px]">
          <div className="w-full max-w-[286px] flex-col max-md:hidden">
            <Sidebar />
          </div>
          <div className="max-w-[774px] rounded-lg bg-white px-[62px] py-[48px] max-md:px-5 max-md:py-5">
            {props.children}
          </div>
        </div>
      </div>
    </div>
  );
}
