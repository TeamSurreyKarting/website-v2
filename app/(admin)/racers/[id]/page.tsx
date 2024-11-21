export default async function Page({ params }: { params: { id: string } }) {
	const userId = params.id;

	return (
		<p>Racer {userId}</p>
	);
}
