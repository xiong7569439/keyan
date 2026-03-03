"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeOutlined,
  UserOutlined,
  CreditCardOutlined,
  ImportOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";

const menuItems = [
  { key: "/", icon: <HomeOutlined />, label: <Link href="/">首页统计</Link> },
  {
    key: "/customers",
    icon: <UserOutlined />,
    label: <Link href="/customers">客户档案</Link>,
  },
  {
    key: "/recharges",
    icon: <CreditCardOutlined />,
    label: <Link href="/recharges">充值记录</Link>,
  },
  {
    key: "/import",
    icon: <ImportOutlined />,
    label: <Link href="/import">数据导入导出</Link>,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const selectedKey = pathname || "/";

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-pink-500">科妍客户管理</h1>
      </div>
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        items={menuItems}
        className="border-r-0"
        style={{ height: "calc(100vh - 65px)" }}
      />
    </div>
  );
}
