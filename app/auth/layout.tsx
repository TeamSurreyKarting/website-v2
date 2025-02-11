import "@/app/globals.css";

import { ReactNode } from "react";
import TSKC from "@/public/logos/tskc.svg";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className={"bg-ts-blue-950 min-h-screen flex p-4"}>
      <div
        className={
          "bg-ts-blue-700 border border-ts-blue-300 rounded-lg text-white flex flex-col gap-4 py-8 pb-12 px-10 w-lg mx-auto my-4 h-fit"
        }
      >
        <TSKC className={"h-auto max-h-32 pt-4"} />
        {children}
      </div>
    </div>
  );
}
