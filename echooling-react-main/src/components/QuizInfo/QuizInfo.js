import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  Input,
  Select,
  Button,
  Checkbox,
  Modal,
  Space,
  Typography,
  Row,
  Col,
  Collapse,
  InputNumber,
  message,
} from "antd";
import {
  SettingOutlined,
  FileTextOutlined,
  FilterOutlined,
  MessageOutlined,
  EyeOutlined,
  PlusOutlined,
  DownOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import ExplanationEditor from "../Explanation/ExplanationEditor";

const { Title, Text } = Typography;
const { Option } = Select;
const { Panel } = Collapse;

const defaultSettings = {
  oneQuestionPerPage: false,
  showQuestionNumbers: true,
  shuffle: "none",
  timeLimit: 0,
  maxAttempts: "Unlimited",
  showFeedback: true,
  displayScore: true,
  specialChars: "",
  headerText: "",
  instructionText: "",
  quizCompleteMessage: "",
  showHeaderInput: false,
  showCompletionInput: false,
  showInstructionInput: false,
};

const QuizInfo = ({ onQuizInfoChange, quizId }) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [uiSettings, setUiSettings] = useState(defaultSettings);

  const [categories, setCategories] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const [visibleTo, setVisibleTo] = useState("everyone");
  const [availableClasses, setAvailableClasses] = useState([]);
  const [assignedClasses, setAssignedClasses] = useState([]);

  // Active panels for collapse
  const [activePanels, setActivePanels] = useState([]);

  useEffect(() => {
    if (quizId) {
      axios
        .get(`/api/quizzes/${quizId}`)
        .then((response) => {
          const quiz = response.data;
          setTitle(quiz.title || "");
          setCategory(quiz.category || "");
          setUiSettings({ ...defaultSettings, ...quiz.uiSettings });
          const hasClasses = quiz.classes && quiz.classes.length > 0;
          setVisibleTo(quiz.visibleTo || (hasClasses ? "classes" : "everyone"));
          setAssignedClasses(quiz.classes || []);
        })
        .catch((error) => {
          console.error("Error fetching quiz:", error);
        });
    }
  }, [quizId]);

  useEffect(() => {
    onQuizInfoChange({
      title,
      category,
      uiSettings,
      visibleTo,
      classes: assignedClasses,
    });
  }, [title, category, uiSettings, visibleTo, assignedClasses]);

  useEffect(() => {
    axios
      .get("/api/categories")
      .then((res) => setCategories(res.data.map((c) => c.name)))
      .catch((err) => console.error("Lỗi khi lấy danh mục:", err));
  }, []);

  useEffect(() => {
    if (visibleTo === "classes") {
      axios
        .get("/api/classes")
        .then((res) => setAvailableClasses(res.data))
        .catch((err) => console.error("Lỗi khi lấy danh sách lớp:", err));
    }
  }, [visibleTo]);

  useEffect(() => {
    if (quizId && assignedClasses.length > 0) {
      assignedClasses.forEach((classId) => {
        axios
          .post(`/api/classes/${classId}/add-quiz`, { quizId })
          .catch((err) => console.error("Không thể gán quiz vào class:", err));
      });
    }
  }, [assignedClasses, quizId]);

  const handleSaveCategory = async () => {
    try {
      const res = await axios.post("/api/categories", {
        name: newCategory,
      });
      const newCat = res.data.name;
      setCategories((prev) => [...prev, newCat]);
      setCategory(newCat);
      setNewCategory("");
      setShowCategoryModal(false);
      message.success("Category added successfully!");
    } catch (err) {
      message.error("❌ Không thể thêm danh mục");
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`http://yourdomain.com/quiz/${quizId}`);
    message.success("Link copied to clipboard!");
  };

  return (
    <div style={{ padding: 0 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ marginBottom: 8 }}>
          ⚙️ Quiz Settings
        </Title>
        <Text type="secondary" style={{ fontSize: 16 }}>
          Configure your quiz settings and options
        </Text>
      </div>

      {/* Basic Info - Always Visible */}
      <Card style={{ marginBottom: 16 }}>
        <Space direction="vertical" size={16} style={{ width: "100%" }}>
          <div>
            <Text
              strong
              style={{ display: "block", marginBottom: 8, fontSize: 15 }}
            >
              📋 Quiz Title
            </Text>
            <Input
              size="large"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your quiz title..."
            />
          </div>

          <div>
            <Text
              strong
              style={{ display: "block", marginBottom: 8, fontSize: 15 }}
            >
              🏷️ Category
            </Text>
            <Space.Compact style={{ width: "100%" }} size="large">
              <Select
                style={{ flex: 1 }}
                size="large"
                value={category}
                onChange={setCategory}
                placeholder="Select a category"
              >
                <Option value="">Select a category</Option>
                {categories.map((cat, index) => (
                  <Option key={index} value={cat}>
                    {cat}
                  </Option>
                ))}
              </Select>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="large"
                onClick={() => setShowCategoryModal(true)}
                title="Add new category"
              >
                Add
              </Button>
            </Space.Compact>
          </div>
        </Space>
      </Card>

      {/* Collapsible Advanced Settings */}
      <Collapse
        activeKey={activePanels}
        onChange={setActivePanels}
        expandIcon={({ isActive }) => (
          <DownOutlined rotate={isActive ? 180 : 0} />
        )}
        style={{ marginBottom: 16 }}
      >
        {/* Display & Order Settings */}
        <Panel
          header={
            <Space>
              <FilterOutlined style={{ fontSize: 18, color: "#1890ff" }} />
              <Text strong style={{ fontSize: 15 }}>
                Display & Order Settings
              </Text>
            </Space>
          }
          key="1"
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card
                title="Display Options"
                size="small"
                style={{ height: "100%" }}
              >
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Checkbox
                    checked={uiSettings.oneQuestionPerPage}
                    onChange={(e) =>
                      setUiSettings((prev) => ({
                        ...prev,
                        oneQuestionPerPage: e.target.checked,
                      }))
                    }
                  >
                    📄 One question per page
                  </Checkbox>
                  <Checkbox
                    checked={uiSettings.showQuestionNumbers}
                    onChange={(e) =>
                      setUiSettings((prev) => ({
                        ...prev,
                        showQuestionNumbers: e.target.checked,
                      }))
                    }
                  >
                    🔢 Show question numbers
                  </Checkbox>
                </Space>
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card
                title="Question Order"
                size="small"
                style={{ height: "100%" }}
              >
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Text type="secondary">🔀 Shuffle Mode</Text>
                  <Select
                    style={{ width: "100%" }}
                    value={uiSettings.shuffle}
                    onChange={(value) =>
                      setUiSettings((prev) => ({ ...prev, shuffle: value }))
                    }
                  >
                    <Option value="none">None</Option>
                    <Option value="questions">Shuffle questions</Option>
                    <Option value="answers">Shuffle answers</Option>
                    <Option value="both">Shuffle questions & answers</Option>
                  </Select>
                </Space>
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card title="Quiz Limits" size="small" style={{ height: "100%" }}>
                <Space direction="vertical" style={{ width: "100%" }}>
                  <div>
                    <Text type="secondary">⏱️ Time Limit (minutes)</Text>
                    <InputNumber
                      style={{ width: "100%", marginTop: 4 }}
                      value={uiSettings.timeLimit || 0}
                      onChange={(value) =>
                        setUiSettings((prev) => ({
                          ...prev,
                          timeLimit: value || 0,
                        }))
                      }
                      placeholder="0 = No limit"
                      min={0}
                    />
                  </div>
                </Space>
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card title="Attempts" size="small" style={{ height: "100%" }}>
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Text type="secondary">🔄 Max Attempts</Text>
                  <Select
                    style={{ width: "100%" }}
                    value={uiSettings.maxAttempts}
                    onChange={(value) =>
                      setUiSettings((prev) => ({ ...prev, maxAttempts: value }))
                    }
                  >
                    <Option value="Unlimited">Unlimited</Option>
                    {[1, 2, 3, 4, 5].map((attempt) => (
                      <Option key={attempt} value={attempt}>
                        {attempt}
                      </Option>
                    ))}
                  </Select>
                </Space>
              </Card>
            </Col>
          </Row>
        </Panel>

        {/* Feedback & Messages */}
        <Panel
          header={
            <Space>
              <MessageOutlined style={{ fontSize: 18, color: "#52c41a" }} />
              <Text strong style={{ fontSize: 15 }}>
                Feedback & Messages
              </Text>
            </Space>
          }
          key="2"
        >
          <Space direction="vertical" size={16} style={{ width: "100%" }}>
            <Card title="📌 Header Text" size="small">
              <ExplanationEditor
                value={uiSettings.headerText}
                onChange={(val) =>
                  setUiSettings((prev) => ({ ...prev, headerText: val }))
                }
              />
            </Card>

            <Card title="📝 Instruction Text" size="small">
              <ExplanationEditor
                value={uiSettings.instructionText}
                onChange={(val) =>
                  setUiSettings((prev) => ({ ...prev, instructionText: val }))
                }
              />
            </Card>

            <Card title="🎉 Completion Message" size="small">
              <ExplanationEditor
                value={uiSettings.quizCompleteMessage}
                onChange={(val) =>
                  setUiSettings((prev) => ({
                    ...prev,
                    quizCompleteMessage: val,
                  }))
                }
              />
            </Card>

            <Card title="Display Options" size="small">
              <Space direction="vertical" style={{ width: "100%" }}>
                <Checkbox
                  checked={uiSettings.showHeaderInput}
                  onChange={(e) =>
                    setUiSettings((prev) => ({
                      ...prev,
                      showHeaderInput: e.target.checked,
                    }))
                  }
                >
                  📌 Show Header Input
                </Checkbox>
                <Checkbox
                  checked={uiSettings.showInstructionInput}
                  onChange={(e) =>
                    setUiSettings((prev) => ({
                      ...prev,
                      showInstructionInput: e.target.checked,
                    }))
                  }
                >
                  📝 Show Instruction Input
                </Checkbox>
                <Checkbox
                  checked={uiSettings.showCompletionInput}
                  onChange={(e) =>
                    setUiSettings((prev) => ({
                      ...prev,
                      showCompletionInput: e.target.checked,
                    }))
                  }
                >
                  🎉 Show Completion Input
                </Checkbox>
                <Checkbox
                  checked={uiSettings.showFeedback}
                  onChange={(e) =>
                    setUiSettings((prev) => ({
                      ...prev,
                      showFeedback: e.target.checked,
                    }))
                  }
                >
                  💭 Show Feedback
                </Checkbox>
                <Checkbox
                  checked={uiSettings.displayScore}
                  onChange={(e) =>
                    setUiSettings((prev) => ({
                      ...prev,
                      displayScore: e.target.checked,
                    }))
                  }
                >
                  ⭐ Display Score
                </Checkbox>
              </Space>
            </Card>

            <div>
              <Text strong style={{ display: "block", marginBottom: 8 }}>
                ⚡ Special Characters
              </Text>
              <Input
                value={uiSettings.specialChars}
                onChange={(e) =>
                  setUiSettings((prev) => ({
                    ...prev,
                    specialChars: e.target.value,
                  }))
                }
                placeholder="Enter special characters..."
              />
            </div>
          </Space>
        </Panel>

        {/* Visibility Settings */}
        <Panel
          header={
            <Space>
              <EyeOutlined style={{ fontSize: 18, color: "#faad14" }} />
              <Text strong style={{ fontSize: 15 }}>
                Visibility Settings
              </Text>
            </Space>
          }
          key="3"
        >
          <Space direction="vertical" size={16} style={{ width: "100%" }}>
            <div>
              <Text strong style={{ display: "block", marginBottom: 8 }}>
                🔗 Quiz Link
              </Text>
              <Space.Compact style={{ width: "100%" }}>
                <Input
                  value={`http://yourdomain.com/quiz/${quizId}`}
                  disabled
                  style={{ fontFamily: "monospace" }}
                />
                <Button
                  type="primary"
                  icon={<CopyOutlined />}
                  onClick={handleCopyLink}
                >
                  Copy
                </Button>
              </Space.Compact>
            </div>

            <div>
              <Text strong style={{ display: "block", marginBottom: 8 }}>
                👥 Visible To
              </Text>
              <Select
                style={{ width: "100%" }}
                value={visibleTo}
                onChange={setVisibleTo}
              >
                <Option value="everyone">🌍 Everyone</Option>
                <Option value="everyone_record">
                  📊 Everyone (record answers)
                </Option>
                <Option value="classes">🎓 Learnclick classes</Option>
                <Option value="just_me">🔒 Just me</Option>
              </Select>
            </div>

            {visibleTo === "classes" && (
              <Card title="🎓 Assign to Classes" size="small">
                <Space direction="vertical" style={{ width: "100%" }}>
                  {availableClasses.map((cls) => (
                    <Checkbox
                      key={cls.id}
                      checked={assignedClasses.includes(cls.id)}
                      onChange={(e) => {
                        setAssignedClasses((prev) =>
                          e.target.checked
                            ? [...prev, cls.id]
                            : prev.filter((id) => id !== cls.id)
                        );
                      }}
                    >
                      {cls.name}
                    </Checkbox>
                  ))}
                </Space>
              </Card>
            )}
          </Space>
        </Panel>
      </Collapse>

      {/* Category Modal */}
      <Modal
        title={
          <Space>
            <span style={{ fontSize: 20 }}>🏷️</span>
            <Text strong>Add New Category</Text>
          </Space>
        }
        open={showCategoryModal}
        onOk={handleSaveCategory}
        onCancel={() => setShowCategoryModal(false)}
        okText="💾 Save"
        cancelText="Cancel"
      >
        <Input
          placeholder="Enter category name..."
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          onPressEnter={handleSaveCategory}
          size="large"
          autoFocus
        />
      </Modal>
    </div>
  );
};
 
export default QuizInfo;
