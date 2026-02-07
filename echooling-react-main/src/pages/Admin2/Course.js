import React, { useEffect, useState, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Upload,
  message,
  Space,
  Image,
  Card,
  Tag,
  Popconfirm,
  Tooltip,
  Empty,
  Typography,
  Row,
  Col,
  Divider,
  Badge,
  Statistic,
} from "antd";
import {
  UploadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  BookOutlined,
  UserOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  EyeOutlined,
  CalendarOutlined,
  GlobalOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { getId } from "../../utils/idHelper";
import dayjs from "dayjs";
import "./AdminCourse.css";

const { Title, Text, Paragraph } = Typography;

const AdminCourse = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [previewModal, setPreviewModal] = useState(false);
  const [previewCourse, setPreviewCourse] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const editorRef = useRef(null);
  const [editingId, setEditingId] = useState(null);
  const [editorContent, setEditorContent] = useState("");
  const [courseToEdit, setCourseToEdit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    const filtered = courses.filter(
      (course) =>
        course.title?.toLowerCase().includes(searchText.toLowerCase()) ||
        course.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        course.author?.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredCourses(filtered);
  }, [searchText, courses]);

  useEffect(() => {
    if (courseToEdit && showModal) {
      const formValues = {
        ...courseToEdit,
        schedule: Array.isArray(courseToEdit.schedule)
          ? courseToEdit.schedule.join(", ")
          : courseToEdit.schedule,
      };
      form.setFieldsValue(formValues);
      setEditorContent(
        courseToEdit.content ? String(courseToEdit.content) : ""
      );
    }
  }, [courseToEdit, showModal, form]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/course", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch courses");

      const data = await response.json();

      setCourses(data);
      setFilteredCourses(data);
    } catch (error) {
      console.error("❌ Error fetching courses:", error);
      message.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const uploadToLocalServer = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload-media", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Upload failed");
      return data.fileUrl;
    } catch (err) {
      message.error("Upload failed");
      return null;
    }
  };

  const handleFileUpload = async (options, field) => {
    const { file, onSuccess, onError } = options;

    message.loading({ content: "Uploading...", key: "upload" });

    const url = await uploadToLocalServer(file);

    if (url) {
      form.setFieldValue(field, url);
      message.success({ content: `${field} uploaded!`, key: "upload" });
      onSuccess("OK");
    } else {
      message.error({ content: "Upload failed", key: "upload" });
      onError(new Error("Upload failed"));
    }
  };

  const handleEdit = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/course/${id}`);

      if (!response.ok) throw new Error("Failed to fetch course");

      const courseData = await response.json();

      setCourseToEdit(courseData);
      setShowModal(true);
      setEditingId(id);
      setEditorContent(courseData.content ? String(courseData.content) : "");
    } catch (error) {
      console.error("❌ Error fetching course:", error);
      message.error("Cannot load course data");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/course/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Delete failed");

      setCourses((prev) => prev.filter((course) => getId(course) !== id));
      message.success("Course deleted successfully!");
    } catch (err) {
      console.error("❌ Delete error:", err);
      message.error("Failed to delete course");
    }
  };

  const handlePreview = (record) => {
    setPreviewCourse(record);
    setPreviewModal(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      const isEdit = !!editingId;
      const updatedCourse = {
        ...values,
        content: editorContent,
        schedule:
          typeof values.schedule === "string"
            ? values.schedule.split(",").map((day) => day.trim())
            : values.schedule,
        createdAt: isEdit ? courseToEdit.createdAt : new Date().toISOString(),
      };

      const url = isEdit ? `/api/course/${editingId}` : "/api/course/create";

      const method = isEdit ? "PUT" : "POST";
      const token = localStorage.getItem("token");

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedCourse),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save course");
      }

      await fetchCourses();

      setShowModal(false);
      form.resetFields();
      setEditorContent("");
      setEditingId(null);
      setCourseToEdit(null);

      message.success(
        isEdit ? "Course updated successfully!" : "Course created successfully!"
      );
    } catch (error) {
      console.error("❌ Submit error:", error);
      message.error(error.message || "Failed to save course");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    form.resetFields();
    setEditorContent("");
    setEditingId(null);
    setCourseToEdit(null);
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
      title: "Course",
      dataIndex: "title",
      key: "title",
      width: 300,
      render: (text, record) => (
        <Space direction="vertical" size={4}>
          <Text strong style={{ fontSize: 15 }}>
            {text}
          </Text>
          <Text type="secondary" style={{ fontSize: 13 }}>
            {record.name}
          </Text>
          <Space size={8}>
            <Tag color="blue" icon={<BookOutlined />}>
              {record.lesson} lessons
            </Tag>
            <Tag color="green">{record.type || "General"}</Tag>
          </Space>
        </Space>
      ),
    },
    {
      title: "Details",
      key: "details",
      width: 300,
      render: (_, record) => (
        <Space direction="vertical" size={4} style={{ width: "100%" }}>
          <Space>
            <UserOutlined style={{ color: "#1890ff" }} />
            <Text type="secondary">{record.author || "N/A"}</Text>
          </Space>
          <Space>
            <ClockCircleOutlined style={{ color: "#52c41a" }} />
            <Text type="secondary">{record.duration || "N/A"}</Text>
          </Space>
          <Space>
            <DollarOutlined style={{ color: "#faad14" }} />
            <Text type="secondary">{record.price || "Free"}</Text>
          </Space>
          <Space>
            <GlobalOutlined style={{ color: "#722ed1" }} />
            <Text type="secondary">{record.language || "N/A"}</Text>
          </Space>
        </Space>
      ),
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      width: 100,
      align: "center",
      render: (image) =>
        image ? (
          <Image
            src={image}
            width={60}
            height={60}
            style={{ objectFit: "cover", borderRadius: 8 }}
            preview={{
              mask: <EyeOutlined />,
            }}
          />
        ) : (
          <div
            style={{
              width: 60,
              height: 60,
              background: "#f0f0f0",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text type="secondary">No Image</Text>
          </div>
        ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      align: "center",
      render: (text) => (
        <Text type="secondary">{dayjs(text).format("MMM DD, YYYY")}</Text>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 180,
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <Space size={8}>
          <Tooltip title="Preview">
            <Button
              type="default"
              icon={<EyeOutlined />}
              onClick={() => handlePreview(record)}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => handleEdit(getId(record))}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Delete Course"
              description="Are you sure you want to delete this course?"
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
              📚 Course Management
            </Title>
            <Text type="secondary">Manage and organize your courses</Text>
          </Col>
          <Col>
            <Space size={12}>
              <Input
                placeholder="Search courses..."
                prefix={<SearchOutlined />}
                allowClear
                style={{ width: 300 }}
                size="large"
                onChange={(e) => setSearchText(e.target.value)}
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="large"
                onClick={() => {
                  setEditingId(null);
                  setEditorContent("");
                  setShowModal(true);
                  setCourseToEdit(null);
                  form.resetFields();
                }}
              >
                Add New Course
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
              title="Total Courses"
              value={courses.length}
              prefix={<BookOutlined />}
              valueStyle={{ color: "#1890ff", fontSize: 28 }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Search Results"
              value={filteredCourses.length}
              prefix={<SearchOutlined />}
              valueStyle={{ color: "#52c41a", fontSize: 28 }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Lessons"
              value={courses.reduce(
                (sum, c) => sum + (parseInt(c.lesson) || 0),
                0
              )}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: "#faad14", fontSize: 28 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredCourses}
          rowKey={(record) => getId(record)}
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} courses`,
          }}
          scroll={{ x: 1400 }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <Space direction="vertical" size={8}>
                    <Text style={{ fontSize: 16 }}>No courses found</Text>
                    <Text type="secondary">
                      {searchText
                        ? "Try adjusting your search"
                        : 'Click "Add New Course" to create your first course'}
                    </Text>
                  </Space>
                }
              />
            ),
          }}
        />
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        title={
          <Space>
            {editingId ? <EditOutlined /> : <PlusOutlined />}
            <Text strong style={{ fontSize: 18 }}>
              {editingId ? "Edit Course" : "Create New Course"}
            </Text>
          </Space>
        }
        open={showModal}
        onCancel={handleCloseModal}
        onOk={handleSubmit}
        width="90vw"
        style={{ top: 20 }}
        confirmLoading={submitting}
        okText={editingId ? "Update Course" : "Create Course"}
        cancelText="Cancel"
      >
        <Divider />
        <Form layout="vertical" form={form}>
          <Row gutter={16}>
            {/* Left Column */}
            <Col span={12}>
              {/* Images Section */}
              <Card
                title="🖼️ Course Images"
                size="small"
                style={{ marginBottom: 16 }}
              >
                {["image", "bannerImg", "authorImg"].map((field) => (
                  <Form.Item
                    key={field}
                    label={
                      field === "image"
                        ? "Course Image"
                        : field === "bannerImg"
                        ? "Banner Image"
                        : "Author Image"
                    }
                    name={field}
                  >
                    <div>
                      <Upload
                        customRequest={(options) =>
                          handleFileUpload(options, field)
                        }
                        showUploadList={false}
                        accept="image/*"
                      >
                        <Button icon={<UploadOutlined />} block>
                          Upload{" "}
                          {field === "image"
                            ? "Course Image"
                            : field === "bannerImg"
                            ? "Banner"
                            : "Author Photo"}
                        </Button>
                      </Upload>
                      {form.getFieldValue(field) && (
                        <div style={{ marginTop: 12, textAlign: "center" }}>
                          <Image
                            src={form.getFieldValue(field)}
                            width={150}
                            style={{ borderRadius: 8 }}
                          />
                        </div>
                      )}
                    </div>
                  </Form.Item>
                ))}
              </Card>

              {/* Basic Info */}
              <Card title="📝 Basic Information" size="small">
                <Form.Item
                  name="title"
                  label="Course Title"
                  rules={[{ required: true, message: "Please enter title" }]}
                >
                  <Input
                    placeholder="e.g. Web Development Bootcamp"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="name"
                  label="Course Name"
                  rules={[
                    { required: true, message: "Please enter course name" },
                  ]}
                >
                  <Input placeholder="Short name for the course" size="large" />
                </Form.Item>

                <Row gutter={12}>
                  <Col span={12}>
                    <Form.Item
                      name="author"
                      label="Instructor / Author"
                      rules={[
                        { required: true, message: "Please enter author" },
                      ]}
                    >
                      <Input
                        prefix={<UserOutlined />}
                        placeholder="Instructor name"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="lesson"
                      label="Number of Lessons"
                      rules={[
                        {
                          required: true,
                          message: "Please enter lesson count",
                        },
                      ]}
                    >
                      <Input
                        prefix={<BookOutlined />}
                        placeholder="e.g. 20"
                        size="large"
                        type="number"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={12}>
                  <Col span={12}>
                    <Form.Item
                      name="price"
                      label="Price"
                      rules={[
                        { required: true, message: "Please enter price" },
                      ]}
                    >
                      <Input
                        prefix={<DollarOutlined />}
                        placeholder="e.g. $99 or Free"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="duration"
                      label="Duration"
                      rules={[
                        { required: true, message: "Please enter duration" },
                      ]}
                    >
                      <Input
                        prefix={<ClockCircleOutlined />}
                        placeholder="e.g. 8 weeks"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={12}>
                  <Col span={12}>
                    <Form.Item
                      name="type"
                      label="Course Type"
                      rules={[{ required: true, message: "Please enter type" }]}
                    >
                      <Input
                        placeholder="e.g. Programming, Design"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="language"
                      label="Language"
                      rules={[
                        { required: true, message: "Please enter language" },
                      ]}
                    >
                      <Input
                        prefix={<GlobalOutlined />}
                        placeholder="e.g. English, Vietnamese"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="schedule"
                  label="Schedule (comma separated)"
                  rules={[{ required: true, message: "Please enter schedule" }]}
                >
                  <Input
                    prefix={<CalendarOutlined />}
                    placeholder="e.g. Monday, Wednesday, Friday"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="dis"
                  label="Description"
                  rules={[
                    { required: true, message: "Please enter description" },
                  ]}
                >
                  <Input.TextArea
                    rows={4}
                    placeholder="Brief description of the course..."
                    showCount
                    maxLength={300}
                  />
                </Form.Item>
              </Card>
            </Col>

            {/* Right Column - Content Editor */}
            <Col span={12}>
              <Card title="📄 Course Content" size="small">
                <Form.Item
                  name="content"
                  rules={[
                    { required: true, message: "Please enter course content" },
                  ]}
                >
                  <Editor
                    apiKey="n37usgxk136y7jbgbd22rrry2ki2agrdp3zzkfg8gc0adi22"
                    onInit={(evt, editor) => (editorRef.current = editor)}
                    value={editorContent}
                    onEditorChange={(content) => {
                      setEditorContent(content);
                      form.setFieldValue("content", content);
                    }}
                    init={{
                      height: 800,
                      menubar: true,
                      plugins:
                        "lists link image media table code help wordcount fullscreen preview",
                      toolbar:
                        "undo redo | formatselect | bold italic underline | alignleft aligncenter alignright | bullist numlist | image media link | fullscreen preview | removeformat | help",
                      content_style:
                        'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 14px; line-height: 1.6; }',
                      file_picker_types: "image",
                      file_picker_callback: (callback, value, meta) => {
                        if (meta.filetype === "image") {
                          const input = document.createElement("input");
                          input.setAttribute("type", "file");
                          input.setAttribute("accept", "image/*");
                          input.onchange = async function () {
                            const file = this.files[0];
                            const url = await uploadToLocalServer(file);
                            if (url) {
                              callback(url, { alt: file.name });
                            } else {
                              message.error("Image upload failed");
                            }
                          };
                          input.click();
                        }
                      },
                      images_upload_handler: async (
                        blobInfo,
                        success,
                        failure
                      ) => {
                        const file = blobInfo.blob();
                        const url = await uploadToLocalServer(file);
                        if (url) {
                          success(url);
                        } else {
                          failure("Image upload failed");
                        }
                      },
                    }}
                  />
                </Form.Item>
              </Card>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Preview Modal */}
      <Modal
        title={
          <Space>
            <EyeOutlined />
            <Text strong>Course Preview</Text>
          </Space>
        }
        open={previewModal}
        onCancel={() => setPreviewModal(false)}
        footer={[
          <Button key="close" onClick={() => setPreviewModal(false)}>
            Close
          </Button>,
          <Button
            key="edit"
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setPreviewModal(false);
              handleEdit(getId(previewCourse));
            }}
          >
            Edit Course
          </Button>,
        ]}
        width={800}
      >
        {previewCourse && (
          <div>
            {previewCourse.image && (
              <Image
                src={previewCourse.image}
                style={{ width: "100%", borderRadius: 8, marginBottom: 16 }}
              />
            )}
            <Title level={3}>{previewCourse.title}</Title>
            <Paragraph type="secondary">{previewCourse.name}</Paragraph>

            <Space
              direction="vertical"
              size={12}
              style={{ width: "100%", marginBottom: 16 }}
            >
              <Space>
                <UserOutlined style={{ color: "#1890ff" }} />
                <Text strong>Instructor:</Text>
                <Text>{previewCourse.author}</Text>
              </Space>
              <Space>
                <BookOutlined style={{ color: "#52c41a" }} />
                <Text strong>Lessons:</Text>
                <Text>{previewCourse.lesson}</Text>
              </Space>
              <Space>
                <ClockCircleOutlined style={{ color: "#fa8c16" }} />
                <Text strong>Duration:</Text>
                <Text>{previewCourse.duration}</Text>
              </Space>
              <Space>
                <DollarOutlined style={{ color: "#722ed1" }} />
                <Text strong>Price:</Text>
                <Text>{previewCourse.price}</Text>
              </Space>
              <Space>
                <GlobalOutlined style={{ color: "#13c2c2" }} />
                <Text strong>Language:</Text>
                <Text>{previewCourse.language}</Text>
              </Space>
              <Space>
                <CalendarOutlined style={{ color: "#eb2f96" }} />
                <Text strong>Schedule:</Text>
                <Text>
                  {Array.isArray(previewCourse.schedule)
                    ? previewCourse.schedule.join(", ")
                    : previewCourse.schedule}
                </Text>
              </Space>
              <Tag color="blue">{previewCourse.type}</Tag>
            </Space>

            <Divider />
            <div>
              <Text strong style={{ fontSize: 16 }}>
                Description:
              </Text>
              <Paragraph style={{ marginTop: 8 }}>
                {previewCourse.dis}
              </Paragraph>
            </div>

            <Divider />
            <div>
              <Text strong style={{ fontSize: 16 }}>
                Full Content:
              </Text>
              <div
                style={{ marginTop: 12 }}
                dangerouslySetInnerHTML={{ __html: previewCourse.content }}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminCourse;
