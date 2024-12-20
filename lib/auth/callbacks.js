import User from '@models/user';
import { connectToDB } from '@utils/database';

export async function handleSession({ session }) {
  if (session.user?.email) {
    const sessionUser = await User.findOne({ email: session.user.email });
    if (sessionUser) {
      session.user.id = sessionUser._id.toString();
    }
  }
  return session;
}

export async function handleSignIn({ profile }) {
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
}