import { paths } from "@/lib/open-api-client";

export type UserProfileResponse = paths["/shop/v1/admin/users/profile"]["get"]["responses"][200]["content"]["application/json"]["data"];