import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "antd/dist/reset.css";
import Sidebar from "@/components/Sidebar";
import { DataProvider } from "@/context/DataContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "科妍客户管理系统",
  description: "科妍客户管理系统 - 档案管理与充值记录",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <DataProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 p-6 ml-64">{children}</main>
          </div>
        </DataProvider>
      </body>
    </html>
  );
}
