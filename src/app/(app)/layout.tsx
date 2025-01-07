import { ClerkProvider } from "@clerk/nextjs";
import TrpcProvider from "@/lib/trpc/Provider";
import { cookies } from "next/headers";
import { ThemeProvider } from "@/context/theme";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieString = (await cookies()).toString();
  return (
    <main>
      <ClerkProvider>
        <TrpcProvider cookies={cookieString}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </TrpcProvider>
      </ClerkProvider>
    </main>
  );
}
