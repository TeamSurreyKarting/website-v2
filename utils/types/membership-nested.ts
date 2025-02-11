export type MembershipNested = {
  id: string;
  addedAt: string;
  addedBy: string | null;
  MembershipTypes: {
    id: string;
    name: string;
  } | null;
  Racers: {
    id: string;
    fullName: string | null;
  } | null;
};
