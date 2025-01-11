import { ClerkProvider } from "@clerk/nextjs";
import TrpcProvider from "@/lib/trpc/Provider";
import { cookies } from "next/headers";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieString = (await cookies()).toString();
  return (
    <main>
      <ClerkProvider>
        <TrpcProvider cookies={cookieString}>{children}</TrpcProvider>
      </ClerkProvider>
    </main>
  );
}
