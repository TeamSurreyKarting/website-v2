import { AdminBreadcrumbs } from "@/components/admin-breadcrumbs";

export default async function BreadcrumbSlot(props: {
  params: Promise<{
    catchAll: string[];
  }>;
}) {
  const params = await props.params;

  const { catchAll } = params;

  return <AdminBreadcrumbs routes={catchAll} />;
}
