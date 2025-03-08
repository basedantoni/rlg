import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export type AuthSession = {
  session: {
    user: {
      id: string;
      name?: string;
      email?: string;
    };
  } | null;
};

export const getUserAuth = async () => {
  // find out more about setting up 'sessionClaims' (custom sessions) here: https://clerk.com/docs/backend-requests/making/custom-session-token
  const { userId, sessionClaims } = await auth();
  const user = await currentUser();
  if (userId) {
    return {
      session: {
        user: {
          id: userId,
          name: `${user?.firstName} ${user?.lastName}`,
          email: sessionClaims?.email,
        },
      },
    } as AuthSession;
  } else {
    return { session: null };
  }
};

export const checkAuth = async () => {
  try {
    const { userId, redirectToSignIn } = await auth();
    if (!userId) redirectToSignIn();
    return true;
  } catch (error) {
    console.error('Auth check error:', error);
    redirect('/sign-in?error=true');
  }
};
