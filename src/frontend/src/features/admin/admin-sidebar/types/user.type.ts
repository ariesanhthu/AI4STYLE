export type User = {
  id: string
  email: string
  name: string
  avatar: string
  role: "user" | "admin"
}