import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "@/redux/provider";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
import { AuthProvider } from '@/contexts/auth-context';
import { CompareProvider } from '@/contexts/compare-context';
import { CompareFloatingButton } from '@/components/CompareButton';

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "ZKart - Your Ultimate Shopping Destination",
  description: "ZKart is an e-commerce platform offering a wide range of products from various vendors.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} font-poppins antialiased bg-[#f2f4f8]`}>
        <Providers>
          <AuthProvider>
            <CompareProvider>
              <Navbar />
              {children}
              <Toaster 
                position="top-center" 
                expand={true} 
                richColors 
                closeButton
                toastOptions={{
                  style: { background: 'hsl(var(--background))', color: 'hsl(var(--foreground))' },
                }}
                visibleToasts={1}
              />
              <CompareFloatingButton />
            </CompareProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
