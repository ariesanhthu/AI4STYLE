import { UserDetailPage } from "@/features/admin/admin-users";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function UserDetailRoute({ params }: PageProps) {
  const { id } = await params;
  return <UserDetailPage id={id} />;
}
