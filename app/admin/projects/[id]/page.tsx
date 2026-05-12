import { redirect } from "next/navigation"

export default function ProjectIndexRedirect({ params }: { params: { id: string } }) {
  redirect(`/admin/projects/${params.id}/edit`)
}
