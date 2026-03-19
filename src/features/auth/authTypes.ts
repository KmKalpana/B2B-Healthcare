export type AuthUser = {
  uid: string;
  email: string | null;
  displayName?: string | null;
  emailVerified?: boolean;
  accessToken?: string | null;
};

export type AuthState= {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}