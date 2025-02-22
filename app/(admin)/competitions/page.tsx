import Search from "@/components/search";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function CompetitionsListPage() {
  return (
    <div className={"container mx-auto"}>
      <h2 className={"text-2xl font-bold"}>Competitions</h2>
      <div className="mx-auto my-2 flex justify-between gap-x-2">
        <Search />
        <Link href={"/competitions/new"} className={"flex gap-2 items-center"}>
          <Button>
            <Plus />
            Create
          </Button>
        </Link>
      </div>
    </div>
  )
}