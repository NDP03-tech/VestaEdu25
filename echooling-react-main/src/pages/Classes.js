import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  Card,
  message,
  Typography,
  Space,
  Popconfirm,
  Row,
  Col,
  Statistic,
  Empty,
  Tag,
  Avatar,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  EyeOutlined,
  TeamOutlined,
  SearchOutlined,
  FolderOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { Search } = Input;

const Classes = () => {
  const [className, setClassName] = useState("");
  const [classList, setClassList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/classes");
      setClassList(res.data);
    } catch (err) {
      message.error("Failed to fetch classes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleAddClass = async () => {
    if (!className.trim()) {
      return message.warning("Class name cannot be empty");
    }

    try {
      await axios.post("/api/classes", { name: className });
      setClassName("");
      fetchClasses();
      message.success("Class added successfully");
    } catch (err) {
      message.error("Error adding class");
    }
  };

  const handleDeleteClass = async (id) => {
    try {
      await axios.delete(`/api/classes/${id}`);
      fetchClasses();
      message.success("Class deleted successfully");
    } catch (err) {
      message.error("Error deleting class");
    }
  };

  const handleEditClass = (id) => {
    navigate(`/admin/class/${id}`);
  };

  // Filter classes by search text
  const filteredClasses = classList.filter((cls) =>
    cls.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Calculate statistics
  const stats = {
    total: classList.length,
    filtered: filteredClasses.length,
  };

  return (
    <div style={{ padding: 0 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ marginBottom: 8 }}>
          🏫 Class Management
        </Title>
        <Text type="secondary" style={{ fontSize: 16 }}>
          Create and manage your classes
        </Text>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12}>
          <Card>
            <Statistic
              title="Total Classes"
              value={stats.total}
              prefix={<FolderOutlined />}
              valueStyle={{ color: "#1890ff", fontSize: 28 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card>
            <Statistic
              title="Showing Results"
              value={stats.filtered}
              prefix={<SearchOutlined />}
              valueStyle={{ color: "#52c41a", fontSize: 28 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Add New Class Form */}
      <Card style={{ marginBottom: 24 }}>
        <Space direction="vertical" size={12} style={{ width: "100%" }}>
          <Text strong style={{ fontSize: 15 }}>
            ➕ Add New Class
          </Text>
          <Space.Compact style={{ width: "100%" }} size="large">
            <Input
              placeholder="Enter new class name..."
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              onPressEnter={handleAddClass}
              style={{ flex: 1 }}
              size="large"
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddClass}
              size="large"
              style={{ minWidth: 120 }}
            >
              Add Class
            </Button>
          </Space.Compact>
        </Space>
      </Card>

      {/* Search Bar */}
      <Card style={{ marginBottom: 16 }}>
        <Search
          placeholder="Search classes by name..."
          allowClear
          size="large"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: "100%" }}
        />
      </Card>

      {/* Classes List */}
      <Card>
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <Text type="secondary">Loading classes...</Text>
          </div>
        ) : filteredClasses.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <Space direction="vertical" size={4}>
                <Text style={{ fontSize: 16, fontWeight: 500 }}>
                  {searchText ? "No classes found" : "No classes yet"}
                </Text>
                <Text type="secondary">
                  {searchText
                    ? "Try adjusting your search"
                    : "Create your first class to get started"}
                </Text>
              </Space>
            }
          />
        ) : (
          <Space direction="vertical" size={12} style={{ width: "100%" }}>
            {filteredClasses.map((cls, index) => (
              <Card
                key={cls.id}
                hoverable
                style={{
                  borderRadius: 8,
                  border: "1px solid #f0f0f0",
                }}
                bodyStyle={{ padding: "16px 20px" }}
              >
                <Row align="middle" justify="space-between" wrap>
                  <Col
                    xs={24}
                    sm={16}
                    style={{ marginBottom: { xs: 12, sm: 0 } }}
                  >
                    <Space size={16}>
                      <Avatar
                        size={48}
                        style={{
                          backgroundColor: "#1890ff",
                          fontSize: 20,
                        }}
                        icon={<TeamOutlined />}
                      />
                      <Space direction="vertical" size={2}>
                        <Text strong style={{ fontSize: 16 }}>
                          {cls.name}
                        </Text>
                        <Text type="secondary" style={{ fontSize: 13 }}>
                          Class ID: {cls.id}
                        </Text>
                      </Space>
                    </Space>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Space
                      size={8}
                      style={{
                        width: "100%",
                        justifyContent: { xs: "flex-start", sm: "flex-end" },
                      }}
                    >
                      <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        onClick={() => handleEditClass(cls.id)}
                        size="middle"
                      >
                        View Details
                      </Button>
                      <Popconfirm
                        title="Delete this class?"
                        description="This action cannot be undone."
                        onConfirm={() => handleDeleteClass(cls.id)}
                        okText="Yes, Delete"
                        cancelText="Cancel"
                        okButtonProps={{ danger: true }}
                      >
                        <Button danger icon={<DeleteOutlined />} size="middle">
                          Delete
                        </Button>
                      </Popconfirm>
                    </Space>
                  </Col>
                </Row>
              </Card>
            ))}
          </Space>
        )}
      </Card>

      {/* Footer Info */}
      {filteredClasses.length > 0 && (
        <div style={{ marginTop: 16, textAlign: "center" }}>
          <Text type="secondary">
            Showing {filteredClasses.length} of {classList.length} classes
          </Text>
        </div>
      )}
    </div>
  );
};

export default Classes;
