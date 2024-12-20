import { providers } from './providers';
import { handleSession, handleSignIn } from './callbacks';

export const authConfig = {
  providers,
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    session: handleSession,
    signIn: handleSignIn,
  },
  secret: process.env.NEXTAUTH_SECRET,
};