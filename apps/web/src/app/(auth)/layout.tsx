import { redirect } from 'next/navigation';
import { ClerkProvider } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const { userId } = await auth();
    // if (userId) redirect('/dashboard');
  } catch (error) {
    console.error('Error in auth layout:', error);
    // Continue rendering the auth layout even if there's an error
  }

  return (
    <div className='bg-muted h-screen pt-8'>
      <ClerkProvider>{children}</ClerkProvider>
    </div>
  );
}
