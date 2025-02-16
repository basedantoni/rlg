import TrpcProvider from "@/lib/trpc/Provider";
import Header from "@/components/ui/custom/header";
import { ClerkProvider } from "@clerk/nextjs";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/custom/app-sidebar";
import { Toaster } from "sonner";
import { cookies } from "next/headers";
import { checkAuth } from "@/lib/auth/utils";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await checkAuth();
  const cookieString = (await cookies()).toString();

  return (
    <>
      <ClerkProvider>
        <TrpcProvider cookies={cookieString}>
          <SidebarProvider>
            <AppSidebar />
            <main className="flex h-full w-full">
              <Header />
              {children}
              <Toaster richColors />
            </main>
          </SidebarProvider>
        </TrpcProvider>
      </ClerkProvider>
    </>
  );
}
