import { NewFinancialAccountForm } from "@/components/forms/finances/new-account";

export default function Page() {
  return (
    <div className={"container mx-auto"}>
      <h2 className={"text-2xl font-bold"}>Create New Financial Account</h2>
      <NewFinancialAccountForm />
    </div>
  );
}
