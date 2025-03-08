import { ClerkProvider } from '@clerk/nextjs';

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='bg-muted h-screen pt-8'>
      <ClerkProvider>{children}</ClerkProvider>
    </div>
  );
}
