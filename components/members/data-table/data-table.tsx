import { createClient } from "@/utils/supabase/server";
import { BaseDataTable } from "@/components/base-data-table";
import { columns } from "@/components/members/data-table/columns";
import { MembershipNested } from "@/utils/types/membership-nested";

async function getData(
  membershipTypeIds?: string[],
  racerIds?: string[],
): Promise<MembershipNested[]> {
  const supabase = await createClient();

  // Build query
  const query = supabase
    .from("Members")
    .select(
      "id, addedAt, addedBy, MembershipTypes!inner( id, name, validFrom, validUntil ), Racers!inner( id, fullName )",
    );

  // Filter by membership types
  if (membershipTypeIds && membershipTypeIds.length > 0) {
    query.in("membership", membershipTypeIds);
  }

  // Filter by racers
  if (racerIds && racerIds.length > 0) {
    query.in("racer", racerIds);
  }

  const { data: members, error } = await query;

  if (error) {
    throw error;
  }

  if (members === null) {
    throw Error("Error finding memberships");
  }

  return members.map((m) => {
    return {
      id: m.id,
      addedAt: m.addedAt,
      addedBy: m.addedBy,
      MembershipTypes: {
        id: m.MembershipTypes.id,
        name: m.MembershipTypes.name,
      },
      Racers: {
        id: m.Racers.id,
        fullName: m.Racers.fullName,
      },
    };
  });
}

export default async function MembersDataTable({
  membershipTypeIds,
  racerIds,
}: {
  membershipTypeIds?: string[];
  racerIds?: string[];
}) {
  const data = await getData(membershipTypeIds, racerIds);

  return <BaseDataTable columns={columns} data={data} />;
}
