import TrpcProvider from '#lib/trpc/Provider';
import Header from '#components/ui/custom/header';
import { AppSidebar } from '#components/ui/custom/app-sidebar';
import { ClerkProvider } from '@clerk/nextjs';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SidebarProvider } from '#components/ui/sidebar';
import { Toaster } from 'sonner';
import { cookies } from 'next/headers';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieString = (await cookies()).toString();
  const nodeEnv = process.env.NODE_ENV;

  return (
    <>
      <ClerkProvider>
        <TrpcProvider cookies={cookieString}>
          <SidebarProvider>
            <AppSidebar />
            <main className='flex flex-col md:flex-row h-dvh md:h-svh w-full'>
              <Header />
              {children}
              <Toaster richColors />
              {nodeEnv === 'development' && (
                <ReactQueryDevtools initialIsOpen={false} />
              )}
            </main>
          </SidebarProvider>
        </TrpcProvider>
      </ClerkProvider>
    </>
  );
}
