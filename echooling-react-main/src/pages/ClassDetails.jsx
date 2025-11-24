import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  TableOutlined,
  UserAddOutlined,
  DeleteOutlined,
  SwapOutlined,
  BookOutlined,
  EditOutlined,
  EyeOutlined,
  ArrowLeftOutlined,
  TeamOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Checkbox,
  Select,
  notification,
  Space,
  Typography,
  Card,
  Row,
  Col,
  Statistic,
  Tag,
  Avatar,
  Empty,
  Badge,
  Tooltip,
  Divider,
  Popconfirm,
} from "antd";

const { Title, Text } = Typography;

const ClassDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [classInfo, setClassInfo] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedToAdd, setSelectedToAdd] = useState([]);

  const [moveModalVisible, setMoveModalVisible] = useState(false);
  const [allClasses, setAllClasses] = useState([]);
  const [targetClassId, setTargetClassId] = useState("");

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    fetchClassDetails();
  }, [id]);

  const fetchClassDetails = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      console.log("🔄 Fetching class details...");

      const classRes = await axios.get(`/api/classes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClassInfo(classRes.data);

      const studentsRes = await axios.get(`/api/classes/${id}/students`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { _t: Date.now() },
      });

      console.log("✅ Students fetched:", studentsRes.data.length);
      setStudents(studentsRes.data);
    } catch (err) {
      console.error("❌ Fetch error:", err);
      notification.error({ message: "Failed to fetch class details" });
    } finally {
      setLoading(false);
    }
  };

  const handleViewGrades = (userId) => {
    navigate(`/admin/grades/${userId}`);
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    form.setFieldsValue(student);
  };

  const handleSaveEdit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      const token = localStorage.getItem("token");

      await axios.put(`/api/users/${editingStudent.id}`, values, {
        headers: { Authorization: `Bearer ${token}` },
      });

      notification.success({ message: "Student updated successfully!" });
      setEditingStudent(null);
      form.resetFields();
      await fetchClassDetails();
    } catch (err) {
      console.error("❌ Update error:", err);
      notification.error({ message: "Failed to update student" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (studentId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`/api/classes/${id}/students/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      notification.success({ message: "Student removed from class" });
      await fetchClassDetails();
    } catch (err) {
      console.error("❌ Delete error:", err);
      notification.error({ message: "Failed to remove student" });
    }
  };

  const handleBulkRemove = async () => {
    if (!selectedIds.length) {
      return notification.warning({ message: "No students selected" });
    }

    try {
      const token = localStorage.getItem("token");

      await Promise.all(
        selectedIds.map((studentId) =>
          axios.delete(`/api/classes/${id}/students/${studentId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );

      notification.success({ message: "Selected students removed" });
      setSelectedIds([]);
      await fetchClassDetails();
    } catch (err) {
      console.error("❌ Bulk remove error:", err);
      notification.error({ message: "Failed to remove students" });
    }
  };

  const openAddModal = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const currentStudentIds = students.map((s) => s.id);
      const availableUsers = res.data.filter(
        (user) => !currentStudentIds.includes(user.id)
      );

      setAllUsers(availableUsers);
      setSelectedToAdd([]);
      setAddModalVisible(true);
    } catch (err) {
      console.error("❌ Fetch users error:", err);
      notification.error({ message: "Failed to load users" });
    }
  };

  const handleAddStudents = async () => {
    if (!selectedToAdd.length) {
      return notification.warning({ message: "No students selected" });
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");

      console.log("📝 Adding students:", selectedToAdd);

      await axios.post(
        `/api/classes/${id}/students`,
        { studentIds: selectedToAdd },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      notification.success({
        message: `Successfully added ${selectedToAdd.length} student(s)`,
      });

      setAddModalVisible(false);
      setSelectedToAdd([]);

      await new Promise((resolve) => setTimeout(resolve, 300));
      await fetchClassDetails();
    } catch (err) {
      console.error("❌ Add students error:", err);
      notification.error({
        message: "Failed to add students",
        description: err.response?.data?.message || "Please try again",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const openMoveModal = async () => {
    if (!selectedIds.length) {
      return notification.warning({ message: "No students selected" });
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`/api/classes`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAllClasses(res.data.filter((cls) => cls.id !== parseInt(id)));
      setTargetClassId("");
      setMoveModalVisible(true);
    } catch (err) {
      console.error("❌ Fetch classes error:", err);
      notification.error({ message: "Failed to load classes" });
    }
  };

  const handleMoveStudents = async () => {
    if (!targetClassId) {
      return notification.warning({ message: "Please select a target class" });
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");

      await axios.post(
        `/api/classes/move-students`,
        {
          studentIds: selectedIds,
          fromClassId: parseInt(id),
          toClassId: parseInt(targetClassId),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      notification.success({
        message: `Moved ${selectedIds.length} student(s) successfully`,
      });

      setMoveModalVisible(false);
      setSelectedIds([]);
      setTargetClassId("");

      await new Promise((resolve) => setTimeout(resolve, 300));
      await fetchClassDetails();
    } catch (err) {
      console.error("❌ Move students error:", err);
      notification.error({ message: "Failed to move students" });
    } finally {
      setSubmitting(false);
    }
  };

  const getInitials = (firstName, lastName) => {
    const first = firstName?.charAt(0)?.toUpperCase() || "";
    const last = lastName?.charAt(0)?.toUpperCase() || "";
    return first + last || "?";
  };

  const columns = [
    {
      title: "Select",
      width: 60,
      align: "center",
      render: (_, record) => (
        <Checkbox
          checked={selectedIds.includes(record.id)}
          onChange={(e) => {
            const checked = e.target.checked;
            if (checked) {
              setSelectedIds([...selectedIds, record.id]);
            } else {
              setSelectedIds(selectedIds.filter((id) => id !== record.id));
            }
          }}
        />
      ),
    },
    {
      title: "Student",
      width: 250,
      render: (_, record) => (
        <Space>
          <Avatar
            size={40}
            style={{
              backgroundColor: "#1890ff",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            {getInitials(record.firstName, record.lastName)}
          </Avatar>
          <div>
            <div>
              <Text strong style={{ fontSize: 14 }}>
                {`${record.firstName || ""} ${record.lastName || ""}`.trim() ||
                  "N/A"}
              </Text>
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                <MailOutlined style={{ marginRight: 4 }} />
                {record.email}
              </Text>
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: "Contact",
      width: 180,
      render: (_, record) => (
        <Space direction="vertical" size={2}>
          {record.studentPhone && (
            <Text style={{ fontSize: 13 }}>
              <PhoneOutlined style={{ color: "#52c41a", marginRight: 4 }} />
              {record.studentPhone}
            </Text>
          )}
          {record.address && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              <HomeOutlined style={{ marginRight: 4 }} />
              {record.address}
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: "Actions",
      width: 150,
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <Space size={8}>
          <Tooltip title="View Grades">
            <Button
              type="default"
              icon={<EyeOutlined />}
              onClick={() => handleViewGrades(record.id)}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Edit Student">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Remove from Class">
            <Popconfirm
              title="Remove Student"
              description="Remove this student from the class?"
              onConfirm={() => handleDelete(record.id)}
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
            <Space direction="vertical" size={4}>
              <Button
                icon={<ArrowLeftOutlined />}
                type="link"
                onClick={() => navigate("/admin/classes")}
                style={{ padding: 0, height: "auto" }}
              >
                Back to Classes
              </Button>
              <Title level={2} style={{ margin: 0 }}>
                👨‍🏫 {classInfo?.name || "Loading..."}
              </Title>
              <Text type="secondary">Manage students and assignments</Text>
            </Space>
          </Col>
          <Col>
            <Space size={12} wrap>
              <Button
                type="primary"
                icon={<BookOutlined />}
                onClick={() => navigate(`/admin/quiz-manage?classId=${id}`)}
                size="large"
              >
                Manage Quizzes
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Total Students"
              value={students.length}
              prefix={<TeamOutlined />}
              valueStyle={{ color: "#1890ff", fontSize: 28 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Selected"
              value={selectedIds.length}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#52c41a", fontSize: 28 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Available to Add"
              value={allUsers.length}
              prefix={<UserAddOutlined />}
              valueStyle={{ color: "#faad14", fontSize: 28 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Action Buttons */}
      <Card style={{ marginBottom: 24 }}>
        <Space wrap size={12}>
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={openAddModal}
            size="large"
          >
            Add Students
          </Button>
          <Popconfirm
            title="Remove Students"
            description={`Remove ${selectedIds.length} selected student(s)?`}
            onConfirm={handleBulkRemove}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
            disabled={!selectedIds.length}
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              disabled={!selectedIds.length}
              size="large"
            >
              Remove Selected{" "}
              {selectedIds.length > 0 && `(${selectedIds.length})`}
            </Button>
          </Popconfirm>
          <Button
            icon={<SwapOutlined />}
            onClick={openMoveModal}
            disabled={!selectedIds.length}
            size="large"
          >
            Move Selected {selectedIds.length > 0 && `(${selectedIds.length})`}
          </Button>
        </Space>
      </Card>

      {/* Students Table */}
      <Card
        title={
          <Space>
            <TeamOutlined style={{ fontSize: 18, color: "#1890ff" }} />
            <Text strong style={{ fontSize: 16 }}>
              Students in Class
            </Text>
            <Tag color="blue">{students.length} students</Tag>
          </Space>
        }
      >
        <Table
          dataSource={students}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} students`,
          }}
          scroll={{ x: 800 }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <Space direction="vertical" size={8}>
                    <Text style={{ fontSize: 16 }}>
                      No students in this class
                    </Text>
                    <Text type="secondary">
                      Click "Add Students" to add students to this class
                    </Text>
                  </Space>
                }
              />
            ),
          }}
        />
      </Card>

      {/* Edit Student Modal */}
      <Modal
        open={!!editingStudent}
        title={
          <Space>
            <EditOutlined />
            <Text strong style={{ fontSize: 18 }}>
              Edit Student Information
            </Text>
          </Space>
        }
        onCancel={() => {
          setEditingStudent(null);
          form.resetFields();
        }}
        onOk={handleSaveEdit}
        confirmLoading={submitting}
        okText="Save Changes"
        width={600}
      >
        <Divider />
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[{ required: true, message: "Please enter first name" }]}
              >
                <Input prefix={<UserOutlined />} size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Last Name"
                name="lastName"
                rules={[{ required: true, message: "Please enter last name" }]}
              >
                <Input prefix={<UserOutlined />} size="large" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Invalid email format" },
            ]}
          >
            <Input prefix={<MailOutlined />} size="large" />
          </Form.Item>
          <Form.Item label="Phone" name="studentPhone">
            <Input prefix={<PhoneOutlined />} size="large" />
          </Form.Item>
          <Form.Item label="Address" name="address">
            <Input.TextArea rows={3} placeholder="Enter student address" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Add Students Modal */}
      <Modal
        open={addModalVisible}
        title={
          <Space>
            <UserAddOutlined />
            <Text strong style={{ fontSize: 18 }}>
              Add Students to Class
            </Text>
          </Space>
        }
        onCancel={() => {
          setAddModalVisible(false);
          setSelectedToAdd([]);
        }}
        onOk={handleAddStudents}
        confirmLoading={submitting}
        okText={`Add ${selectedToAdd.length} Student(s)`}
        okButtonProps={{ disabled: !selectedToAdd.length }}
        width={600}
      >
        <Divider />
        {allUsers.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No available users to add"
          />
        ) : (
          <>
            <div
              style={{
                marginBottom: 16,
                padding: "12px",
                background: "#f0f2f5",
                borderRadius: 8,
              }}
            >
              <Checkbox
                checked={
                  selectedToAdd.length === allUsers.length &&
                  allUsers.length > 0
                }
                indeterminate={
                  selectedToAdd.length > 0 &&
                  selectedToAdd.length < allUsers.length
                }
                onChange={(e) =>
                  setSelectedToAdd(
                    e.target.checked ? allUsers.map((u) => u.id) : []
                  )
                }
              >
                <Text strong>Select All ({allUsers.length} users)</Text>
              </Checkbox>
            </div>
            <div style={{ maxHeight: 400, overflowY: "auto" }}>
              <Space direction="vertical" style={{ width: "100%" }}>
                {allUsers.map((user) => (
                  <Card
                    key={user.id}
                    size="small"
                    hoverable
                    style={{
                      cursor: "pointer",
                      background: selectedToAdd.includes(user.id)
                        ? "#e6f7ff"
                        : "#fff",
                      border: selectedToAdd.includes(user.id)
                        ? "2px solid #1890ff"
                        : "1px solid #f0f0f0",
                    }}
                    onClick={() => {
                      setSelectedToAdd((prev) =>
                        prev.includes(user.id)
                          ? prev.filter((id) => id !== user.id)
                          : [...prev, user.id]
                      );
                    }}
                  >
                    <Space>
                      <Checkbox
                        checked={selectedToAdd.includes(user.id)}
                        onClick={(e) => e.stopPropagation()}
                        onChange={() => {
                          setSelectedToAdd((prev) =>
                            prev.includes(user.id)
                              ? prev.filter((id) => id !== user.id)
                              : [...prev, user.id]
                          );
                        }}
                      />
                      <Avatar style={{ backgroundColor: "#1890ff" }}>
                        {getInitials(user.firstName, user.lastName)}
                      </Avatar>
                      <div>
                        <div>
                          <Text strong>
                            {`${user.firstName || ""} ${
                              user.lastName || ""
                            }`.trim() || "N/A"}
                          </Text>
                        </div>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {user.email}
                        </Text>
                      </div>
                    </Space>
                  </Card>
                ))}
              </Space>
            </div>
          </>
        )}
      </Modal>

      {/* Move Students Modal */}
      <Modal
        open={moveModalVisible}
        title={
          <Space>
            <SwapOutlined />
            <Text strong style={{ fontSize: 18 }}>
              Move {selectedIds.length} Student(s) to Another Class
            </Text>
          </Space>
        }
        onCancel={() => {
          setMoveModalVisible(false);
          setTargetClassId("");
        }}
        onOk={handleMoveStudents}
        confirmLoading={submitting}
        okText="Move Students"
        okButtonProps={{ disabled: !targetClassId }}
        width={500}
      >
        <Divider />
        <Space direction="vertical" style={{ width: "100%" }} size={16}>
          <Text>Select the target class to move the selected students:</Text>
          <Select
            style={{ width: "100%" }}
            placeholder="Select target class"
            value={targetClassId}
            onChange={setTargetClassId}
            size="large"
          >
            {allClasses.map((cls) => (
              <Select.Option key={cls.id} value={cls.id}>
                <Space>
                  <TeamOutlined />
                  {cls.name}
                </Space>
              </Select.Option>
            ))}
          </Select>
        </Space>
      </Modal>
    </div>
  );
};

export default ClassDetail;
