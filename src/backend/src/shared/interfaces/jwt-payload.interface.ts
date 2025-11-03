interface JwtPayload {
  sub: string;
  email: string;
  role?: string;
}

export type { JwtPayload };