import { NewMembershipTypeForm } from "@/components/forms/memberships/new";

export default function Page() {
  return (
    <div className={"container mx-auto"}>
      <h2 className={"text-2xl font-bold"}>New Membership</h2>
      <NewMembershipTypeForm />
    </div>
  );
}
