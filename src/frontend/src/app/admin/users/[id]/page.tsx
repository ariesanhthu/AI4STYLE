import { UserDetailPage } from "@/features/admin/admin-users";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function StaffDetailsRoute({ params }: PageProps) {
  const { id } = await params;
  return <UserDetailPage id={id} />;
}
