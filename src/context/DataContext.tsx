"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Customer {
  id: number;
  username: string;
  remark: string;
}

export interface Recharge {
  id: number;
  username: string;
  remark: string;
}

interface DataContextType {
  customers: Customer[];
  recharges: Recharge[];
  refreshData: () => void;
  setCustomers: (customers: Customer[]) => void;
  setRecharges: (recharges: Recharge[]) => void;
  addCustomer: (customer: { username: string; remark: string }) => void;
  updateCustomer: (id: number, updates: Partial<Customer>) => void;
  deleteCustomer: (id: number) => void;
  addRecharge: (recharge: { username: string; remark: string }) => void;
  deleteRecharge: (id: number) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// 完整的Excel数据
const initialCustomers: Customer[] = [
  { id: 1, username: "李文文", remark: "" },
  { id: 2, username: "王慧", remark: "" },
  { id: 3, username: "张春莲", remark: "" },
  { id: 4, username: "崔海娟", remark: "" },
  { id: 5, username: "利利", remark: "" },
  { id: 6, username: "李小艳", remark: "" },
  { id: 7, username: "孙思路", remark: "" },
  { id: 8, username: "吴桂梅", remark: "" },
  { id: 9, username: "宋海燕", remark: "" },
  { id: 10, username: "范文娟", remark: "" },
  { id: 11, username: "张秀莲", remark: "" },
  { id: 12, username: "江丽", remark: "" },
  { id: 13, username: "黄伟兰", remark: "" },
  { id: 14, username: "田慧", remark: "" },
  { id: 15, username: "彭芳", remark: "" },
  { id: 16, username: "小兰", remark: "" },
  { id: 17, username: "李婷婷", remark: "" },
  { id: 18, username: "王敏", remark: "" },
  { id: 19, username: "陈洁", remark: "" },
  { id: 20, username: "代老师", remark: "" },
];

const initialRecharges: Recharge[] = [
  { id: 1, username: "娟子", remark: "" },
  { id: 4, username: "刘恋", remark: "" },
  { id: 5, username: "郑晶", remark: "" },
  { id: 7, username: "赵师红", remark: "" },
  { id: 9, username: "潘娜", remark: "" },
  { id: 19, username: "娟子", remark: "睫毛" },
  { id: 20, username: "司姐", remark: "" },
  { id: 24, username: "沈玲", remark: "" },
  { id: 25, username: "鲍佑顺", remark: "" },
  { id: 26, username: "彭芳", remark: "睫毛" },
  { id: 28, username: "铁明珠", remark: "睫毛" },
  { id: 29, username: "万狄", remark: "" },
  { id: 30, username: "刘妤婕", remark: "" },
  { id: 31, username: "沈玲", remark: "睫毛" },
  { id: 32, username: "潘姐", remark: "" },
  { id: 33, username: "高祥宇", remark: "" },
  { id: 34, username: "朱颖", remark: "" },
  { id: 35, username: "汪莉", remark: "睫毛" },
  { id: 36, username: "邓小红", remark: "睫毛" },
  { id: 37, username: "张艳红", remark: "睫毛" },
  { id: 39, username: "马平", remark: "" },
  { id: 41, username: "龚敬", remark: "睫毛" },
  { id: 42, username: "操小青", remark: "睫毛" },
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [recharges, setRecharges] = useState<Recharge[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const refreshData = () => {
    const savedCustomers = localStorage.getItem("keyan_customers");
    const savedRecharges = localStorage.getItem("keyan_recharges");
    
    if (savedCustomers && savedRecharges) {
      setCustomers(JSON.parse(savedCustomers));
      setRecharges(JSON.parse(savedRecharges));
    } else {
      setCustomers(initialCustomers);
      setRecharges(initialRecharges);
    }
    setIsLoaded(true);
  };

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("keyan_customers", JSON.stringify(customers));
      localStorage.setItem("keyan_recharges", JSON.stringify(recharges));
    }
  }, [customers, recharges, isLoaded]);

  const addCustomer = (customer: { username: string; remark: string }) => {
    const newId = Math.max(...customers.map((c: Customer) => c.id), 0) + 1;
    setCustomers([...customers, { ...customer, id: newId }]);
  };

  const updateCustomer = (id: number, updates: Partial<Customer>) => {
    setCustomers(customers.map((c: Customer) => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteCustomer = (id: number) => {
    setCustomers(customers.filter((c: Customer) => c.id !== id));
  };

  const addRecharge = (recharge: { username: string; remark: string }) => {
    const newId = Math.max(...recharges.map((r: Recharge) => r.id), 0) + 1;
    setRecharges([...recharges, { ...recharge, id: newId }]);
  };

  const deleteRecharge = (id: number) => {
    setRecharges(recharges.filter((r: Recharge) => r.id !== id));
  };

  return (
    <DataContext.Provider
      value={{
        customers,
        recharges,
        refreshData,
        setCustomers,
        setRecharges,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addRecharge,
        deleteRecharge,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}

// 统计函数
export function getStatistics(customers: Customer[], recharges: Recharge[]) {
  const rechargeTypeCount: Record<string, number> = {};
  recharges.forEach((r: Recharge) => {
    const type = r.remark?.trim() || "普通充值";
    rechargeTypeCount[type] = (rechargeTypeCount[type] || 0) + 1;
  });
  
  const rechargeCustomers = new Set(recharges.map((r: Recharge) => r.username));
  
  return {
    totalCustomers: customers.length,
    totalRecharges: recharges.length,
    rechargeCustomersCount: rechargeCustomers.size,
    rechargeTypeCount,
    recentRecharges: recharges.slice(-10).reverse(),
  };
}
