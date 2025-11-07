export interface UserInterface {
  id: string,
  roleId: string,
  role: {
    id: string,
    name: string,
    permissions: string[],
  },
  name: string,
  email: string,
  phone: string,
  avatar: string,
  birthdate: string,
  address: string,
  createdAt: Date,
  updatedAt: Date,
}