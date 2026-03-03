import * as XLSX from "xlsx";

// 客户档案类型
export interface Customer {
  id: number;
  username: string;
  remark: string;
}

// 充值记录类型
export interface Recharge {
  id: number;
  username: string;
  remark: string;
}

// 从Excel文件读取数据
export function readExcelData(filePath: string) {
  try {
    const workbook = XLSX.readFile(filePath);
    
    // 读取档案表
    const archiveSheet = workbook.Sheets["档案"];
    const archiveData = XLSX.utils.sheet_to_json<Customer[]>(archiveSheet) || [];
    
    // 读取充值表
    const rechargeSheet = workbook.Sheets["充值"];
    const rechargeData = XLSX.utils.sheet_to_json<Recharge[]>(rechargeSheet) || [];
    
    return {
      customers: archiveData,
      recharges: rechargeData,
    };
  } catch (error) {
    console.error("读取Excel文件失败:", error);
    return { customers: [], recharges: [] };
  }
}

// 导出数据到Excel
export function exportToExcel(customers: Customer[], recharges: Recharge[], filePath: string) {
  try {
    const workbook = XLSX.utils.book_new();
    
    // 档案表
    const archiveSheet = XLSX.utils.json_to_sheet(customers);
    XLSX.utils.book_append_sheet(workbook, archiveSheet, "档案");
    
    // 充值表
    const rechargeSheet = XLSX.utils.json_to_sheet(recharges);
    XLSX.utils.book_append_sheet(workbook, rechargeSheet, "充值");
    
    XLSX.writeFile(workbook, filePath);
    return true;
  } catch (error) {
    console.error("导出Excel文件失败:", error);
    return false;
  }
}

// 获取统计信息
export function getStatistics(customers: Customer[], recharges: Recharge[]) {
  // 充值类型统计
  const rechargeTypeCount: Record<string, number> = {};
  recharges.forEach((r) => {
    const type = r.remark?.trim() || "普通充值";
    rechargeTypeCount[type] = (rechargeTypeCount[type] || 0) + 1;
  });
  
  // 充值客户统计
  const rechargeCustomers = new Set(recharges.map((r) => r.username));
  
  return {
    totalCustomers: customers.length,
    totalRecharges: recharges.length,
    rechargeCustomersCount: rechargeCustomers.size,
    rechargeTypeCount,
    recentRecharges: recharges.slice(-10).reverse(),
  };
}
