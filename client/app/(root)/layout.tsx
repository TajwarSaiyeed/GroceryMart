import { FC, ReactNode } from "react";
import Navbar from "@/components/navbar";
import { SessionProvider } from "next-auth/react";

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: FC<RootLayoutProps> = ({ children }) => {
  return (
    <SessionProvider>
      <Navbar />
      {children}
    </SessionProvider>
  );
};

export default RootLayout;
