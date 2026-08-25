import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  message,
  Typography,
  Modal,
  Card,
  Row,
  Col,
  Space,
  Tag,
  Empty,
  Statistic,
  Badge,
} from "antd";
import {
  PlusOutlined,
  BookOutlined,
  DeleteOutlined,
  FolderOutlined,
  FileTextOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from "../config";
const { Title, Text } = Typography;
const { Search } = Input;

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchText, setSearchText] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${config.API_URL}/api/categories`);
      setCategories(res.data);
    } catch (err) {
      message.error("Failed to fetch categories");
    }
  };

  const addCategory = async () => {
    if (!newCategory.trim()) {
      return message.warning("Category name cannot be empty.");
    }

    try {
      const res = await axios.post(`${config.API_URL}/api/categories`, { name: newCategory });
      setCategories((prev) => [...prev, res.data]);
      setNewCategory("");
      message.success("Category added successfully!");
    } catch (err) {
      message.error("❌ Category already exists or an error occurred.");
    }
  };

  const fetchQuizzesByCategory = async (catName) => {
    setSelectedCategory(catName);
    try {
      const res = await axios.get(`${config.API_URL}/api/categories/${catName}/quizzes`);
      setQuizzes(res.data);
    } catch (err) {
      message.error("Failed to fetch quizzes.");
    }
  };

  const handleQuizClick = (quizId) => {
    navigate(`/user/do-quiz/${quizId}`);
  };

  const handleDeleteCategory = (cat) => {
    Modal.confirm({
      title: `Delete category "${cat.name}"?`,
      content: "This will also delete all quizzes in this category.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          const id = cat._id || cat.id || cat.name;
          await axios.delete(`${config.API_URL}/api/categories/${id}`);
          setCategories((prev) =>
            prev.filter((c) => (c._id || c.id || c.name) !== id)
          );

          if (selectedCategory === cat.name) {
            setSelectedCategory("");
            setQuizzes([]);
          }

          message.success("Category and its quizzes deleted.");
        } catch (err) {
          message.error("Failed to delete category.");
        }
      },
    });
  };

  // Filter categories by search
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Statistics
  const stats = {
    totalCategories: categories.length,
    filteredCategories: filteredCategories.length,
    totalQuizzes: quizzes.length,
  };

  return (
    <div style={{ padding: 0 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ marginBottom: 8 }}>
          📚 Category Management
        </Title>
        <Text type="secondary" style={{ fontSize: 16 }}>
          Organize quizzes by categories
        </Text>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Categories"
              value={stats.totalCategories}
              prefix={<FolderOutlined />}
              valueStyle={{ color: "#1890ff", fontSize: 28 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Showing Results"
              value={stats.filteredCategories}
              prefix={<SearchOutlined />}
              valueStyle={{ color: "#52c41a", fontSize: 28 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Quizzes in Selected"
              value={stats.totalQuizzes}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: "#faad14", fontSize: 28 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Add New Category */}
      <Card style={{ marginBottom: 24 }}>
        <Space direction="vertical" size={12} style={{ width: "100%" }}>
          <Text strong style={{ fontSize: 15 }}>
            ➕ Add New Category
          </Text>
          <Space.Compact style={{ width: "100%" }} size="large">
            <Input
              placeholder="Enter new category name..."
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onPressEnter={addCategory}
              style={{ flex: 1 }}
              size="large"
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={addCategory}
              size="large"
              style={{ minWidth: 120 }}
            >
              Add Category
            </Button>
          </Space.Compact>
        </Space>
      </Card>

      {/* Search Bar */}
      <Card style={{ marginBottom: 16 }}>
        <Search
          placeholder="Search categories..."
          allowClear
          size="large"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: "100%" }}
        />
      </Card>

      {/* Categories Grid */}
      <Card
        title={
          <Space>
            <FolderOutlined style={{ fontSize: 18, color: "#1890ff" }} />
            <Text strong style={{ fontSize: 16 }}>
              All Categories
            </Text>
          </Space>
        }
        style={{ marginBottom: 24 }}
      >
        {filteredCategories.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <Space direction="vertical" size={4}>
                <Text style={{ fontSize: 16, fontWeight: 500 }}>
                  {searchText ? "No categories found" : "No categories yet"}
                </Text>
                <Text type="secondary">
                  {searchText
                    ? "Try adjusting your search"
                    : "Create your first category to get started"}
                </Text>
              </Space>
            }
          />
        ) : (
          <Row gutter={[12, 12]}>
            {filteredCategories.map((cat) => {
              const isSelected = cat.name === selectedCategory;
              return (
                <Col
                  key={cat._id || cat.id || cat.name}
                  xs={24}
                  sm={12}
                  md={8}
                  lg={6}
                >
                  <Card
                    hoverable
                    style={{
                      background: isSelected ? "#e6f7ff" : "#fff",
                      border: isSelected
                        ? "2px solid #1890ff"
                        : "1px solid #f0f0f0",
                      borderRadius: 8,
                    }}
                    bodyStyle={{ padding: 12 }}
                  >
                    <Space
                      direction="vertical"
                      size={8}
                      style={{ width: "100%" }}
                    >
                      <Space
                        style={{
                          width: "100%",
                          justifyContent: "space-between",
                        }}
                      >
                        <BookOutlined
                          style={{ fontSize: 24, color: "#1890ff" }}
                        />
                        {isSelected && <Tag color="blue">Selected</Tag>}
                      </Space>
                      <Text
                        strong
                        style={{
                          fontSize: 15,
                          display: "block",
                          marginBottom: 8,
                        }}
                      >
                        {cat.name}
                      </Text>
                      <Space size={4} style={{ width: "100%" }}>
                        <Button
                          type={isSelected ? "primary" : "default"}
                          size="small"
                          block
                          onClick={() => fetchQuizzesByCategory(cat.name)}
                        >
                          View Quizzes
                        </Button>
                        <Button
                          danger
                          size="small"
                          icon={<DeleteOutlined />}
                          onClick={() => handleDeleteCategory(cat)}
                        />
                      </Space>
                    </Space>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </Card>

      {/* Quizzes List */}
      {selectedCategory && (
        <Card
          title={
            <Space>
              <FileTextOutlined style={{ fontSize: 18, color: "#52c41a" }} />
              <Text strong style={{ fontSize: 16 }}>
                Quizzes in: <Tag color="blue">{selectedCategory}</Tag>
              </Text>
            </Space>
          }
        >
          {quizzes.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <Space direction="vertical" size={4}>
                  <Text style={{ fontSize: 16, fontWeight: 500 }}>
                    No quizzes in this category
                  </Text>
                  <Text type="secondary">
                    Add quizzes to this category from Quiz Management
                  </Text>
                </Space>
              }
            />
          ) : (
            <Space direction="vertical" size={12} style={{ width: "100%" }}>
              {quizzes.map((quiz, index) => (
                <Card
                  key={quiz._id || quiz.id}
                  hoverable
                  onClick={() => handleQuizClick(quiz._id || quiz.id)}
                  style={{
                    borderRadius: 8,
                    cursor: "pointer",
                  }}
                  bodyStyle={{ padding: "16px 20px" }}
                >
                  <Space align="center" style={{ width: "100%" }}>
                    <Badge
                      count={index + 1}
                      style={{
                        backgroundColor: "#1890ff",
                        fontSize: 14,
                        fontWeight: "bold",
                        minWidth: 32,
                        height: 32,
                        lineHeight: "32px",
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <Text strong style={{ fontSize: 15 }}>
                        {quiz.title || "Untitled Quiz"}
                      </Text>
                    </div>
                    <Button type="primary" icon={<FileTextOutlined />}>
                      Take Quiz
                    </Button>
                  </Space>
                </Card>
              ))}
            </Space>
          )}
        </Card>
      )}

      {/* Footer Info */}
      {filteredCategories.length > 0 && (
        <div style={{ marginTop: 16, textAlign: "center" }}>
          <Text type="secondary">
            Showing {filteredCategories.length} of {categories.length}{" "}
            categories
          </Text>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
