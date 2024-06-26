
import NavbarV2 from "@/components/common/NavbarV2";
import dbConnect from "@/database/dbConnect";
import { Inter } from "next/font/google";
import "../globals.css";
import { auth } from "../../../auth";
import { siteConfig } from "@/config/site";
import Footer from "@/components/common/Footer";
import { AuthProvider } from "@/contexts/authProvider/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

export default async function RootLayout({ children }) {
  const session = await auth();
  await dbConnect();
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <NavbarV2 userSeesion={session} />
          <main>
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
