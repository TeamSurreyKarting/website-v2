import { NewCompetitionForm } from "@/components/forms/competitions/new";

export default function NewCompetitionPage() {
  return (
    <div className={"container mx-auto"}>
      <h2 className={"text-2xl font-bold"}>New Competition</h2>
      <NewCompetitionForm />
    </div>
  );
}