import { Header } from "~/components/header";

export default function AppLayout(props: { children: React.ReactNode }) {
  return (
    <div className="m-auto flex h-full max-w-[512px] flex-col pb-12 pl-5 pr-3">
      <Header />
      {props.children}
    </div>
  );
}
