import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebase";
import type { AuthUser } from "./authTypes";

export const loginApi = async (email: string, password: string): Promise<AuthUser> => {
  const res = await signInWithEmailAndPassword(auth, email, password);
  const user = res.user;
  const token = (user as any)?.stsTokenManager?.accessToken ?? null;

  return {
    uid: user.uid,
    email: user.email ?? null,
    displayName: user.displayName ?? null,
    emailVerified: !!user.emailVerified,
    accessToken: token,
  };
};

// NEW signup function
export const signupApi = async (
  name: string,
  email: string,
  password: string
): Promise<AuthUser> => {
  const res = await createUserWithEmailAndPassword(auth, email, password);
  const user = res.user;
  const token = (user as any)?.stsTokenManager?.accessToken ?? null;

  return {
    uid: user.uid,
    email: user.email ?? null,
    displayName: name,
    emailVerified: !!user.emailVerified,
    accessToken: token,
  };
};

export const logoutApi = async () => {
  await signOut(auth);
};
