"use client";

import { useState } from "react";
import { Table, Button, Input, Modal, Form, message, Space, Popconfirm, Typography, Select, Tag } from "antd";
import { PlusOutlined, SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import { useData, Recharge } from "@/context/DataContext";

const { Title } = Typography;
const { Option } = Select;

export default function RechargesPage() {
  const { recharges, customers, addRecharge, deleteRecharge } = useData();
  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  // 获取所有备注类型
  const remarkTypes = Array.from(new Set(recharges.map((r: Recharge) => r.remark).filter(Boolean)));

  const filteredRecharges = recharges.filter((r: Recharge) => {
    const matchSearch = !searchText || r.username.toLowerCase().includes(searchText.toLowerCase());
    const matchType = !filterType || r.remark === filterType;
    return matchSearch && matchType;
  });

  const handleAdd = () => {
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteRecharge(id);
    message.success("删除成功");
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      addRecharge(values);
      message.success("添加成功");
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const getTagColor = (remark: string) => {
    if (!remark) return "default";
    if (remark === "睫毛") return "pink";
    if (remark === "充值") return "green";
    if (remark === "美甲") return "purple";
    if (remark === "XX") return "red";
    return "blue";
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "用户名",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "备注",
      dataIndex: "remark",
      key: "remark",
      render: (remark: string) => (
        remark ? <Tag color={getTagColor(remark)}>{remark}</Tag> : "-"
      ),
    },
    {
      title: "操作",
      key: "action",
      render: (_: unknown, record: Recharge) => (
        <Space>
          <Popconfirm
            title="确定删除此记录?"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Title level={2} style={{ margin: 0 }}>充值记录管理</Title>
        <Space>
          <Input
            placeholder="搜索用户名"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 150 }}
          />
          <Select
            placeholder="筛选备注类型"
            value={filterType}
            onChange={setFilterType}
            allowClear
            style={{ width: 150 }}
          >
            <Option value="">全部</Option>
            {remarkTypes.map((type) => (
              <Option key={type} value={type}>{type}</Option>
            ))}
          </Select>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增充值
          </Button>
        </Space>
      </div>

      <Table
        dataSource={filteredRecharges}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 20, showSizeChanger: true, showTotal: (total) => `共 ${total} 条` }}
      />

      <Modal
        title="新增充值记录"
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => setIsModalOpen(false)}
        okText="确定"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: "请选择或输入用户名" }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item name="remark" label="备注类型">
            <Select placeholder="选择备注类型" allowClear>
              <Option value="睫毛">睫毛</Option>
              <Option value="充值">充值</Option>
              <Option value="美甲">美甲</Option>
              <Option value="XX">XX</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
