export default function TaskDetailPage({ params }: { params: { id?: string }}) {
	const taskId = params?.id;

	return (
		<>
			<h1>Task {taskId}</h1>
		</>
	);
}
