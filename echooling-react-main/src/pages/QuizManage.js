import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Button,
  Select,
  Spin,
  Modal,
  Checkbox,
  Typography,
  Space,
  message,
  Card,
  Row,
  Col,
  Statistic,
  Tag,
  Input,
  Empty,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { getId } from "../utils/idHelper";

const { Option } = Select;
const { Title, Text } = Typography;
const { Search } = Input;

const QuizManage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false); // ✅ NEW: Loading state for create
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedQuizzes, setSelectedQuizzes] = useState([]);
  const [searchText, setSearchText] = useState("");
  const quizzesPerPage = 5;
  const navigate = useNavigate();

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/quizzes");
      setQuizzes(res.data);
    } catch (err) {
      console.error("❌ Error fetching quizzes", err);
      message.error("Lỗi khi tải danh sách quiz");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/categories");
      setCategories(res.data.map((c) => c.name));
    } catch (err) {
      console.error("❌ Error fetching categories", err);
      message.error("Lỗi khi tải danh mục");
    }
  };

  // ✅ NEW: Create quiz function matching Dashboard logic
  const handleCreateQuiz = async () => {
    setCreating(true);
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("/api/quizzes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: "Untitled Quiz",
          description: "",
          category: "general",
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("❌ Error creating quiz:", error);
        message.error("Failed to create quiz");
        return;
      }

      const data = await res.json();
      const createdQuizId = data.id;
      message.success("Quiz created successfully!");
      navigate(`/admin/quiz-builder/${createdQuizId}`);
    } catch (err) {
      console.error("❌ Network error:", err);
      message.error("Network error while creating quiz");
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = (quizId) => {
    navigate(`/admin/quiz-builder/${quizId}`);
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Xác nhận xoá quiz",
      content: "Bạn chắc chắn muốn xoá quiz này?",
      okText: "Xoá",
      cancelText: "Huỷ",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await axios.delete(`/api/quizzes/${id}`);
          message.success("Đã xoá quiz thành công");
          fetchQuizzes();
        } catch (err) {
          console.error("❌ Error deleting quiz", err);
          message.error("Xoá quiz thất bại");
        }
      },
    });
  };

  const handleBulkDelete = async () => {
    if (selectedQuizzes.length === 0) return;
    Modal.confirm({
      title: "Xác nhận xoá hàng loạt",
      content: `Bạn có chắc muốn xoá ${selectedQuizzes.length} quiz đã chọn?`,
      okText: "Xoá tất cả",
      cancelText: "Huỷ",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await Promise.all(
            selectedQuizzes.map((id) => axios.delete(`/api/quizzes/${id}`))
          );
          message.success("Đã xoá các quiz được chọn");
          fetchQuizzes();
          setSelectedQuizzes([]);
        } catch (err) {
          console.error("❌ Error deleting selected quizzes", err);
          message.error("Xoá nhiều quiz thất bại");
        }
      },
    });
  };

  // Filter by category and search text
  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchCategory =
      selectedCategory === "all" || quiz.category === selectedCategory;
    const matchSearch = quiz.title
      .toLowerCase()
      .includes(searchText.toLowerCase());
    return matchCategory && matchSearch;
  });

  const indexOfLastQuiz = currentPage * quizzesPerPage;
  const indexOfFirstQuiz = indexOfLastQuiz - quizzesPerPage;
  const currentQuizzes = filteredQuizzes.slice(
    indexOfFirstQuiz,
    indexOfLastQuiz
  );

  // Calculate statistics
  const stats = {
    total: quizzes.length,
    byCategory:
      selectedCategory === "all" ? quizzes.length : filteredQuizzes.length,
    selected: selectedQuizzes.length,
  };

  const columns = [
    {
      title: (
        <Checkbox
          checked={
            currentQuizzes.length > 0 &&
            currentQuizzes.every((q) => selectedQuizzes.includes(getId(q)))
          }
          indeterminate={
            currentQuizzes.some((q) => selectedQuizzes.includes(getId(q))) &&
            !currentQuizzes.every((q) => selectedQuizzes.includes(getId(q)))
          }
          onChange={(e) => {
            if (e.target.checked) {
              const newSelected = [
                ...selectedQuizzes,
                ...currentQuizzes
                  .map((q) => getId(q))
                  .filter((id) => !selectedQuizzes.includes(id)),
              ];
              setSelectedQuizzes(newSelected);
            } else {
              setSelectedQuizzes(
                selectedQuizzes.filter(
                  (id) => !currentQuizzes.map((q) => getId(q)).includes(id)
                )
              );
            }
          }}
        />
      ),
      dataIndex: "id",
      render: (id, record) => (
        <Checkbox
          checked={selectedQuizzes.includes(getId(record))}
          onChange={() => {
            setSelectedQuizzes((prev) =>
              prev.includes(getId(record))
                ? prev.filter((q) => q !== getId(record))
                : [...prev, getId(record)]
            );
          }}
        />
      ),
      width: 60,
      align: "center",
    },
    {
      title: "Quiz Title",
      dataIndex: "title",
      key: "title",
      render: (text) => (
        <Text strong style={{ fontSize: 14 }}>
          {text}
        </Text>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      align: "center",
      render: (category) => (
        <Tag color="blue" style={{ fontSize: 13, padding: "4px 12px" }}>
          {category}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "actions",
      align: "center",
      width: 200,
      render: (_, quiz) => (
        <Space size={8}>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(getId(quiz))}
            size="middle"
          >
            Edit
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(getId(quiz))}
            size="middle"
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchQuizzes();
    fetchCategories();
  }, []);

  return (
    <div style={{ padding: 0 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ marginBottom: 8 }}>
          📝 Quiz Management
        </Title>
        <Text type="secondary" style={{ fontSize: 16 }}>
          Manage and organize all your quizzes
        </Text>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Quizzes"
              value={stats.total}
              prefix={<AppstoreOutlined />}
              valueStyle={{ color: "#1890ff", fontSize: 28 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Filtered Results"
              value={stats.byCategory}
              prefix={<FilterOutlined />}
              valueStyle={{ color: "#52c41a", fontSize: 28 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Selected"
              value={stats.selected}
              prefix="✓"
              valueStyle={{ color: "#faad14", fontSize: 28 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters and Actions */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={24} md={10}>
            <Search
              placeholder="Search quiz by title..."
              allowClear
              size="large"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: "100%" }}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Space direction="vertical" size={0} style={{ width: "100%" }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Filter by Category
              </Text>
              <Select
                style={{ width: "100%" }}
                size="large"
                value={selectedCategory}
                onChange={(value) => {
                  setSelectedCategory(value);
                  setCurrentPage(1);
                }}
              >
                <Option value="all">All Categories</Option>
                {categories.map((cat, index) => (
                  <Option key={index} value={cat}>
                    {cat}
                  </Option>
                ))}
              </Select>
            </Space>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Space
              size={8}
              style={{ width: "100%", justifyContent: "flex-end" }}
            >
              {/* ✅ UPDATED: Create Quiz button with loading state */}
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="large"
                onClick={handleCreateQuiz}
                loading={creating}
                disabled={creating}
              >
                {creating ? "Creating..." : "Create Quiz"}
              </Button>
              <Button
                danger
                icon={<DeleteOutlined />}
                size="large"
                onClick={handleBulkDelete}
                disabled={selectedQuizzes.length === 0}
              >
                Delete ({selectedQuizzes.length})
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Quiz Table */}
      <Card>
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 300,
            }}
          >
            <Spin size="large" tip="Loading quizzes..." />
          </div>
        ) : filteredQuizzes.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <Space direction="vertical" size={4}>
                <Text style={{ fontSize: 16, fontWeight: 500 }}>
                  No quizzes found
                </Text>
                <Text type="secondary">
                  {searchText || selectedCategory !== "all"
                    ? "Try adjusting your filters"
                    : "Create your first quiz to get started"}
                </Text>
              </Space>
            }
          >
            {/* ✅ UPDATED: Create First Quiz button */}
            {!searchText && selectedCategory === "all" && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="large"
                onClick={handleCreateQuiz}
                loading={creating}
                disabled={creating}
              >
                {creating ? "Creating..." : "Create First Quiz"}
              </Button>
            )}
          </Empty>
        ) : (
          <>
            <Table
              rowKey={(record) => getId(record)}
              dataSource={currentQuizzes}
              columns={columns}
              pagination={{
                current: currentPage,
                pageSize: quizzesPerPage,
                total: filteredQuizzes.length,
                onChange: (page) => setCurrentPage(page),
                showTotal: (total) => `Total ${total} quizzes`,
                position: ["bottomCenter"],
              }}
              bordered
              size="middle"
            />
          </>
        )}
      </Card>
    </div>
  );
};

export default QuizManage;
