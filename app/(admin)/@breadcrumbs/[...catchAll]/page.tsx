import {AdminBreadcrumbs} from "@/components/admin-breadcrumbs";
type Props = {
	params: {
		catchAll: string[]
	}
}
export default function BreadcrumbSlot({params: { catchAll } }: Props) {
	return <AdminBreadcrumbs routes={catchAll} />
}
