// import {columns} from "@/components/racers/data-table/columns";

import { Skeleton } from "@/components/ui/skeleton";
import { SVGSkeleton } from "@/components/ui/svg-skeleton";

export default function RacersTableSkeleton() {
  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom">
            <thead className="[&amp;_tr]:border-b bg-ts-blue-500">
              <tr className="border-b transition-colors">
                <th className="h-10 px-2 text-left align-middle [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px]">
                  <Skeleton />
                </th>
                <th className="h-10 px-2 text-left align-middle [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px]">
                  <Skeleton />
                </th>
                <th className="h-10 px-2 text-left align-middle [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px]">
                  <Skeleton />
                </th>
              </tr>
            </thead>
            <tbody className="[&amp;_tr:last-child]:border-0">
              <tr className="border-b transition-colors">
                <td className="p-2 align-middle [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px]">
                  <Skeleton className="w-[288px] h-4 max-w-full" />
                </td>
                <td className="p-2 align-middle [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px]">
                  <Skeleton className="w-[168px] h-4 max-w-full" />
                </td>
                <td className="p-2 align-middle [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px]">
                  <div className="flex gap-2">
                    <a>
                      <div className="items-center justify-center gap-2 transition-colors [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 h-9 px-4 py-2 hidden lg:block">
                        <SVGSkeleton className="w-[1empx] h-[1empx]" />
                      </div>
                    </a>
                    <div className="inline-flex items-center justify-center gap-2 transition-colors [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 h-9 w-9 p-0">
                      <SVGSkeleton className="w-[24px] h-[24px]" />
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
