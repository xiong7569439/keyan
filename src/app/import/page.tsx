"use client";

import { useState, useRef } from "react";
import { Card, Button, Upload, message, Typography, Space, Divider, Table } from "antd";
import { UploadOutlined, DownloadOutlined, ReloadOutlined } from "@ant-design/icons";
import { useData, Customer, Recharge } from "@/context/DataContext";
import * as XLSX from "xlsx";

const { Title, Text } = Typography;

export default function ImportPage() {
  const { customers, recharges, setCustomers, setRecharges, refreshData } = useData();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 导出数据
  const handleExport = () => {
    try {
      const workbook = XLSX.utils.book_new();
      
      // 档案表
      const archiveSheet = XLSX.utils.json_to_sheet(customers.map(c => ({
        编号: c.id,
        用户名: c.username,
        备注: c.remark
      })));
      XLSX.utils.book_append_sheet(workbook, archiveSheet, "档案");
      
      // 充值表
      const rechargeSheet = XLSX.utils.json_to_sheet(recharges.map(r => ({
        编号: r.id,
        用户名: r.username,
        备注: r.remark
      })));
      XLSX.utils.book_append_sheet(workbook, rechargeSheet, "充值");
      
      XLSX.writeFile(workbook, "科妍客户数据.xlsx");
      message.success("导出成功");
    } catch (error) {
      message.error("导出失败");
      console.error(error);
    }
  };

  // 导入数据
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        
        // 读取档案表
        const archiveSheet = workbook.Sheets["档案"];
        const archiveData = XLSX.utils.sheet_to_json<{编号: number; 用户名: string; 备注: string}>(archiveSheet) || [];
        
        // 读取充值表
        const rechargeSheet = workbook.Sheets["充值"];
        const rechargeData = XLSX.utils.sheet_to_json<{编号: number; 用户名: string; 备注: string}>(rechargeSheet) || [];
        
        // 转换格式
        const newCustomers: Customer[] = archiveData.map((item, index) => ({
          id: item.编号 || index + 1,
          username: item.用户名 || "",
          remark: item.备注 || ""
        })).filter(c => c.username);
        
        const newRecharges: Recharge[] = rechargeData.map((item, index) => ({
          id: item.编号 || index + 1,
          username: item.用户名 || "",
          remark: item.备注 || ""
        })).filter(r => r.username);
        
        setCustomers(newCustomers);
        setRecharges(newRecharges);
        message.success(`导入成功：${newCustomers.length} 个客户，${newRecharges.length} 条充值记录`);
      } catch (error) {
        message.error("导入失败，请检查文件格式");
        console.error(error);
      } finally {
        setLoading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };
    
    reader.readAsArrayBuffer(file);
  };

  // 重置数据
  const handleReset = () => {
    refreshData();
    message.success("数据已重置为初始状态");
  };

  const customerColumns = [
    { title: "编号", dataIndex: "id", key: "id", width: 60 },
    { title: "用户名", dataIndex: "username", key: "username" },
    { title: "备注", dataIndex: "remark", key: "remark" },
  ];

  const rechargeColumns = [
    { title: "编号", dataIndex: "id", key: "id", width: 60 },
    { title: "用户名", dataIndex: "username", key: "username" },
    { title: "备注", dataIndex: "remark", key: "remark" },
  ];

  return (
    <div>
      <Title level={2}>数据导入导出</Title>
      
      <Card style={{ marginBottom: 24 }}>
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          <div>
            <Title level={4}>导出数据</Title>
            <Text>将当前数据导出为Excel文件</Text>
            <div style={{ marginTop: 12 }}>
              <Button 
                type="primary" 
                icon={<DownloadOutlined />} 
                onClick={handleExport}
              >
                导出Excel
              </Button>
            </div>
          </div>
          
          <Divider />
          
          <div>
            <Title level={4}>导入数据</Title>
            <Text>从Excel文件导入客户档案和充值记录</Text>
            <Text type="secondary" style={{ display: "block", marginTop: 4 }}>
              Excel文件需要包含"档案"和"充值"两个Sheet
            </Text>
            <div style={{ marginTop: 12 }}>
              <input
                type="file"
                ref={fileInputRef}
                accept=".xlsx,.xls"
                onChange={handleImport}
                style={{ display: "none" }}
                id="file-upload"
              />
              <Button 
                type="primary" 
                icon={<UploadOutlined />} 
                onClick={() => document.getElementById("file-upload")?.click()}
                loading={loading}
              >
                选择文件导入
              </Button>
            </div>
          </div>
          
          <Divider />
          
          <div>
            <Title level={4}>重置数据</Title>
            <Text>将数据重置为初始状态（从Excel文件读取）</Text>
            <div style={{ marginTop: 12 }}>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={handleReset}
              >
                重置数据
              </Button>
            </div>
          </div>
        </Space>
      </Card>

      <Card title="当前数据预览" style={{ marginBottom: 24 }}>
        <Table 
          title={() => `客户档案 (${customers.length}条)`}
          dataSource={customers.slice(0, 10)} 
          columns={customerColumns} 
          pagination={false}
          size="small"
          rowKey="id"
        />
        {customers.length > 10 && (
          <Text type="secondary">...还有 {customers.length - 10} 条数据</Text>
        )}
      </Card>

      <Card title="充值记录预览">
        <Table 
          title={() => `充值记录 (${recharges.length}条)`}
          dataSource={recharges.slice(0, 10)} 
          columns={rechargeColumns} 
          pagination={false}
          size="small"
          rowKey="id"
        />
        {recharges.length > 10 && (
          <Text type="secondary">...还有 {recharges.length - 10} 条数据</Text>
        )}
      </Card>
    </div>
  );
}
