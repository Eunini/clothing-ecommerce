import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import User from '@models/user';
import { connectToDB } from '@utils/database';

export const authConfig: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async session({ session }) {
      if (session.user?.email) {
        const sessionUser = await User.findOne({ email: session.user.email });
        if (sessionUser) {
          session.user.id = sessionUser._id.toString();
        }
      }
      return session;
    },
    async signIn({ profile }) {
      try {
        await connectToDB();

        if (!profile?.email) {
          throw new Error('No email provided by Google');
        }

        // check if user already exists
        const userExists = await User.findOne({ email: profile.email });

        // if not, create a new document and save user in MongoDB
        if (!userExists && profile.name && profile.picture) {
          await User.create({
            email: profile.email,
            username: profile.name.replace(/\s+/g, '').toLowerCase(),
            image: profile.picture,
          });
        }

        return true;
      } catch (error) {
        console.error('Authentication error:', error);
        return false;
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}