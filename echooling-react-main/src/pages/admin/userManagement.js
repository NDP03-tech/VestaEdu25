import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Table,
  Row,
  Col,
  Typography,
  Popconfirm,
  message,
  Space,
  Card,
  Divider,
  Drawer,
  Avatar,
  Tag,
  Tooltip,
  Badge,
  Statistic,
  Empty,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  TeamOutlined,
  SafetyOutlined,
  LockOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { mapWithKey, getId } from "../../utils/idHelper";

const { Title, Text } = Typography;
const { Option } = Select;

const highlightText = (text, keyword) => {
  if (!keyword || !text) return text || "-";
  const regex = new RegExp(`(${keyword})`, "gi");
  const parts = String(text).split(regex);
  return parts.map((part, index) =>
    part.toLowerCase() === keyword.toLowerCase() ? (
      <Text mark key={index}>
        {part}
      </Text>
    ) : (
      <span key={index}>{part}</span>
    )
  );
};

const RenderFormField = ({ name, label, required, type, options, icon }) => (
  <Form.Item
    name={name}
    label={label}
    rules={
      required
        ? [
            { required: true, message: `Please enter ${label.toLowerCase()}` },
            ...(name === "email" || name.includes("Email")
              ? [{ type: "email", message: "Invalid email format" }]
              : []),
          ]
        : []
    }
  >
    {type === "password" ? (
      <Input.Password
        prefix={icon}
        size="large"
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    ) : type === "select" ? (
      <Select size="large" placeholder={`Select ${label.toLowerCase()}`}>
        {options.map((o) => (
          <Option key={o} value={o}>
            {o}
          </Option>
        ))}
      </Select>
    ) : type === "textarea" ? (
      <Input.TextArea rows={3} placeholder={`Enter ${label.toLowerCase()}`} />
    ) : (
      <Input
        prefix={icon}
        size="large"
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    )}
  </Form.Item>
);

const UserManager = () => {
  const [form] = Form.useForm();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const defaultValues = {
    email: "",
    password: "",
    role: "user",
    firstName: "",
    lastName: "",
    studentPhone: "",
    guardianPhone: "",
    studentEmail: "",
    guardianEmail: "",
    address: "",
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("📦 Users loaded:", res.data.length);
      setUsers(res.data);
    } catch (err) {
      console.error("❌ Error fetching users:", err);
      if (err.response?.status === 401) {
        message.error("Authentication required");
      } else {
        message.error("Failed to load users");
      }
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      if (editingUser) {
        await axios.put(`/api/users/${getId(editingUser)}`, values, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success("User updated successfully!");
      } else {
        await axios.post("/api/users", values, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success("User created successfully!");
      }
      form.resetFields();
      setEditingUser(null);
      setIsDrawerOpen(false);
      await fetchUsers();
    } catch (err) {
      console.error("❌ Error saving user:", err);
      message.error(err.response?.data?.message || "Failed to save user");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    form.setFieldsValue({ ...user, password: "" });
    setIsDrawerOpen(true);
  };

  const handleAddUser = () => {
    setEditingUser(null);
    form.setFieldsValue(defaultValues);
    setIsDrawerOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("User deleted successfully!");
      await fetchUsers();
    } catch (err) {
      console.error("❌ Error deleting user:", err);
      message.error("Failed to delete user");
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setIsDrawerOpen(false);
    form.resetFields();
  };

  const matchesSearch = (user) => {
    const fieldsToSearch = [
      user.email,
      user.role,
      user.firstName,
      user.lastName,
      user.studentPhone,
      user.guardianPhone,
      user.studentEmail,
      user.guardianEmail,
      user.address,
    ];
    return fieldsToSearch.some((field) =>
      field?.toLowerCase().includes(search.toLowerCase())
    );
  };

  const filteredUsers = users.filter(matchesSearch);
  const adminCount = users.filter((u) => u.role === "admin").length;
  const userCount = users.filter((u) => u.role === "user").length;

  const getRoleColor = (role) => {
    return role === "admin" ? "red" : "blue";
  };

  const getRoleIcon = (role) => {
    return role === "admin" ? <SafetyOutlined /> : <UserOutlined />;
  };

  const getInitials = (firstName, lastName) => {
    const first = firstName?.charAt(0)?.toUpperCase() || "";
    const last = lastName?.charAt(0)?.toUpperCase() || "";
    return first + last || "?";
  };

  const columns = [
    {
      title: "No.",
      width: 60,
      align: "center",
      render: (_, __, index) => (
        <Badge count={index + 1} style={{ backgroundColor: "#1890ff" }} />
      ),
    },
    {
      title: "User",
      width: 280,
      render: (_, record) => (
        <Space>
          <Avatar
            size={40}
            style={{
              backgroundColor: record.role === "admin" ? "#ff4d4f" : "#1890ff",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            {getInitials(record.firstName, record.lastName)}
          </Avatar>
          <div>
            <div>
              <Text strong style={{ fontSize: 14 }}>
                {highlightText(
                  `${record.firstName || ""} ${record.lastName || ""}`.trim() ||
                    "N/A",
                  search
                )}
              </Text>
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                <MailOutlined style={{ marginRight: 4 }} />
                {highlightText(record.email, search)}
              </Text>
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      width: 100,
      align: "center",
      render: (role) => (
        <Tag color={getRoleColor(role)} icon={getRoleIcon(role)}>
          {role?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Contact",
      width: 200,
      render: (_, record) => (
        <Space direction="vertical" size={2}>
          {record.studentPhone && (
            <Text style={{ fontSize: 13 }}>
              <PhoneOutlined style={{ color: "#52c41a", marginRight: 4 }} />
              {highlightText(record.studentPhone, search)}
            </Text>
          )}
          {record.guardianPhone && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              Guardian: {highlightText(record.guardianPhone, search)}
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: "Email Contact",
      width: 200,
      render: (_, record) => (
        <Space direction="vertical" size={2}>
          {record.studentEmail && (
            <Text style={{ fontSize: 13 }}>
              {highlightText(record.studentEmail, search)}
            </Text>
          )}
          {record.guardianEmail && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              Guardian: {highlightText(record.guardianEmail, search)}
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: "Address",
      dataIndex: "address",
      width: 200,
      render: (text) => (
        <Tooltip title={text}>
          <Text ellipsis style={{ fontSize: 13 }}>
            {text ? (
              <>
                <HomeOutlined style={{ marginRight: 4, color: "#faad14" }} />
                {highlightText(text, search)}
              </>
            ) : (
              "-"
            )}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: "Actions",
      width: 150,
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit User">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Delete User">
            <Popconfirm
              title="Delete User"
              description="Are you sure you want to delete this user?"
              onConfirm={() => handleDelete(getId(record))}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ danger: true }}
            >
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                size="small"
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: "#f5f5f5", minHeight: "100vh" }}>
      {/* Header */}
      <Card style={{ marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} style={{ margin: 0 }}>
              👥 User Management
            </Title>
            <Text type="secondary">Manage user accounts and permissions</Text>
          </Col>
          <Col>
            <Space size={12}>
              <Input
                placeholder="Search users..."
                prefix={<SearchOutlined />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                allowClear
                style={{ width: 300 }}
                size="large"
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddUser}
                size="large"
              >
                Add New User
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Users"
              value={users.length}
              prefix={<TeamOutlined />}
              valueStyle={{ color: "#1890ff", fontSize: 28 }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Administrators"
              value={adminCount}
              prefix={<SafetyOutlined />}
              valueStyle={{ color: "#ff4d4f", fontSize: 28 }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Regular Users"
              value={userCount}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#52c41a", fontSize: 28 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={mapWithKey(filteredUsers)}
          loading={loading}
          bordered
          scroll={{ x: 1400 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} users`,
          }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <Space direction="vertical" size={8}>
                    <Text style={{ fontSize: 16 }}>No users found</Text>
                    <Text type="secondary">
                      {search
                        ? "Try adjusting your search"
                        : 'Click "Add New User" to create your first user'}
                    </Text>
                  </Space>
                }
              />
            ),
          }}
        />
      </Card>

      {/* Add/Edit Drawer */}
      <Drawer
        title={
          <Space>
            {editingUser ? <EditOutlined /> : <PlusOutlined />}
            <Text strong style={{ fontSize: 18 }}>
              {editingUser ? "Edit User" : "Create New User"}
            </Text>
          </Space>
        }
        width={700}
        onClose={handleCancelEdit}
        open={isDrawerOpen}
        destroyOnClose
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          {/* Account Information */}
          <Card
            title="🔐 Account Information"
            size="small"
            style={{ marginBottom: 16 }}
          >
            <Row gutter={16}>
              <Col xs={24}>
                <RenderFormField
                  name="email"
                  label="Email Address"
                  required
                  icon={<MailOutlined />}
                />
              </Col>
              <Col xs={24}>
                <RenderFormField
                  name="password"
                  label={
                    editingUser
                      ? "New Password (leave blank to keep current)"
                      : "Password"
                  }
                  required={!editingUser}
                  type="password"
                  icon={<LockOutlined />}
                />
              </Col>
              <Col xs={24}>
                <RenderFormField
                  name="role"
                  label="User Role"
                  type="select"
                  options={["user", "admin"]}
                />
              </Col>
            </Row>
          </Card>

          {/* Personal Information */}
          <Card
            title="👤 Personal Information"
            size="small"
            style={{ marginBottom: 16 }}
          >
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <RenderFormField
                  name="firstName"
                  label="First Name"
                  icon={<UserOutlined />}
                />
              </Col>
              <Col xs={24} md={12}>
                <RenderFormField
                  name="lastName"
                  label="Last Name"
                  icon={<UserOutlined />}
                />
              </Col>
              <Col xs={24}>
                <RenderFormField
                  name="address"
                  label="Address"
                  type="textarea"
                />
              </Col>
            </Row>
          </Card>

          {/* Student Contact */}
          <Card
            title="📞 Student Contact"
            size="small"
            style={{ marginBottom: 16 }}
          >
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <RenderFormField
                  name="studentPhone"
                  label="Student Phone"
                  icon={<PhoneOutlined />}
                />
              </Col>
              <Col xs={24} md={12}>
                <RenderFormField
                  name="studentEmail"
                  label="Student Email"
                  icon={<MailOutlined />}
                />
              </Col>
            </Row>
          </Card>

          {/* Guardian Contact */}
          <Card
            title="👨‍👩‍👧 Guardian Contact"
            size="small"
            style={{ marginBottom: 16 }}
          >
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <RenderFormField
                  name="guardianPhone"
                  label="Guardian Phone"
                  icon={<PhoneOutlined />}
                />
              </Col>
              <Col xs={24} md={12}>
                <RenderFormField
                  name="guardianEmail"
                  label="Guardian Email"
                  icon={<MailOutlined />}
                />
              </Col>
            </Row>
          </Card>

          {/* Action Buttons */}
          <Divider />
          <Form.Item style={{ marginBottom: 0 }}>
            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
              <Button onClick={handleCancelEdit} size="large">
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                size="large"
                icon={editingUser ? <EditOutlined /> : <PlusOutlined />}
              >
                {editingUser ? "Update User" : "Create User"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default UserManager;
