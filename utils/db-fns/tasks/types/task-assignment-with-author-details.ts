export type TaskAssignmentWithAuthorDetails = {
  task: string
  assigned_at: string
  assigned_by: {
	id: string
	fullName: string | null
  } | null
  assigned_to: {
	id: string
	fullName: string | null
  } | null
}