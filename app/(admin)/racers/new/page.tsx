import { NewRacerForm } from "@/components/forms/racers/new";

export default function Page() {
  return (
    <div className={"container mx-auto"}>
      <h2 className={"text-2xl font-bold"}>New Racer</h2>
      <NewRacerForm />
    </div>
  );
}
