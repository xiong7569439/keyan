"use client";

import { Card, Row, Col, Statistic, Table, Tag, Typography } from "antd";
import { UserOutlined, CreditCardOutlined, RiseOutlined } from "@ant-design/icons";
import { useData, getStatistics } from "@/context/DataContext";
import { useEffect, useState } from "react";

const { Title } = Typography;

export default function HomePage() {
  const { customers, recharges } = useData();
  const [stats, setStats] = useState<ReturnType<typeof getStatistics> | null>(null);

  useEffect(() => {
    setStats(getStatistics(customers, recharges));
  }, [customers, recharges]);

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 60 },
    { title: "用户名", dataIndex: "username", key: "username" },
    { title: "备注", dataIndex: "remark", key: "remark", 
      render: (remark: string) => {
        if (!remark) return "-";
        const color = remark === "睫毛" ? "pink" : remark === "充值" ? "green" : remark === "美甲" ? "purple" : "blue";
        return <Tag color={color}>{remark}</Tag>;
      }
    },
  ];

  const typeColumns = [
    { title: "类型", dataIndex: "type", key: "type" },
    { title: "次数", dataIndex: "count", key: "count" },
  ];

  const typeData = stats ? Object.entries(stats.rechargeTypeCount).map(([type, count]) => ({
    type: type || "普通充值",
    count,
    key: type || "normal"
  })) : [];

  return (
    <div>
      <Title level={2}>数据统计概览</Title>
      
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="总客户数"
              value={stats?.totalCustomers || 0}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="总充值次数"
              value={stats?.totalRecharges || 0}
              prefix={<CreditCardOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="充值客户数"
              value={stats?.rechargeCustomersCount || 0}
              prefix={<RiseOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={12}>
          <Card title="充值类型分布">
            <Table 
              dataSource={typeData} 
              columns={typeColumns} 
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="最近充值记录">
            <Table 
              dataSource={stats?.recentRecharges || []} 
              columns={columns} 
              pagination={false}
              size="small"
              rowKey="id"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
