export type CommentWithAuthorDetails = {
  id: string
  task: string
  authored_by: {
    id: string
    fullName: string | null
  } | null
  created_at: string
  content: string
}