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
  DatePicker,
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
} from "antd";
import {
  UploadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  PhoneOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { getId } from "../../utils/idHelper";
import dayjs from "dayjs";
import "./AdminEvent.css";

const { Title, Text } = Typography;

const AdminEvent = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [previewModal, setPreviewModal] = useState(false);
  const [previewEvent, setPreviewEvent] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const editorRef = useRef(null);
  const [editingId, setEditingId] = useState(null);
  const [editorContent, setEditorContent] = useState("");
  const [eventToEdit, setEventToEdit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const filtered = events.filter(
      (event) =>
        event.title?.toLowerCase().includes(searchText.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchText.toLowerCase()) ||
        event.category?.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredEvents(filtered);
  }, [searchText, events]);

  useEffect(() => {
    if (eventToEdit && showModal) {
      const formValues = {
        ...eventToEdit,
        date: eventToEdit.date ? dayjs(eventToEdit.date) : null,
        time: eventToEdit.time || eventToEdit.startTime,
        organizer: eventToEdit.organizer || eventToEdit.host,
      };
      form.setFieldsValue(formValues);
      setEditorContent(eventToEdit.content ? String(eventToEdit.content) : "");
    }
  }, [eventToEdit, showModal, form]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/events", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch events");

      const data = await response.json();

      setEvents(data);
      setFilteredEvents(data);
    } catch (error) {
      console.error("❌ Error fetching events:", error);
      message.error("Failed to load events");
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
      if (field === "image") {
        form.setFieldValue("bannerImg", url);
      }
      message.success({ content: "Upload successful!", key: "upload" });
      onSuccess("OK");
    } else {
      message.error({ content: "Upload failed", key: "upload" });
      onError(new Error("Upload failed"));
    }
  };

  const handleEdit = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/events/${id}`);

      if (!response.ok) throw new Error("Failed to fetch event");

      const eventData = await response.json();

      setEventToEdit(eventData);
      setShowModal(true);
      setEditingId(id);
      setEditorContent(eventData.content ? String(eventData.content) : "");
    } catch (error) {
      console.error("❌ Error fetching event:", error);
      message.error("Cannot load event data");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/events/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Delete failed");

      setEvents((prev) => prev.filter((event) => getId(event) !== id));
      message.success("Event deleted successfully!");
    } catch (err) {
      console.error("❌ Delete error:", err);
      message.error("Failed to delete event");
    }
  };

  const handlePreview = (record) => {
    setPreviewEvent(record);
    setPreviewModal(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      const isEdit = !!editingId;

      // ✅ Map frontend fields to backend model
      const updatedEvent = {
        // Images
        image: values.image || "",
        bannerImg: values.bannerImg || values.image || "",

        // Date & Time
        date: values.date
          ? values.date.toISOString()
          : new Date().toISOString(),
        time: values.time || "TBD", // Frontend field
        startTime: values.time || "TBD", // Backend field

        // Event Details
        title: values.title,
        category: values.category || "General",
        location: values.location,

        // Organizer
        organizer: values.organizer, // Frontend field
        host: values.organizer || "N/A", // Backend field

        // Financial & Contact
        cost: values.cost || "Free",
        phone: values.phone || "N/A",

        // Content
        content: editorContent || "",
        description: values.description || "",

        // Metadata
        createdAt: isEdit ? eventToEdit.createdAt : new Date().toISOString(),
      };

      const url = isEdit ? `/api/events/${editingId}` : "/api/events/create";
      const method = isEdit ? "PUT" : "POST";
      const token = localStorage.getItem("token");

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedEvent),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save event");
      }

      await fetchEvents();

      setShowModal(false);
      form.resetFields();
      setEditorContent("");
      setEditingId(null);
      setEventToEdit(null);

      message.success(
        isEdit ? "Event updated successfully!" : "Event created successfully!"
      );
    } catch (error) {
      console.error("❌ Submit error:", error);
      message.error(error.message || "Failed to save event");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    form.resetFields();
    setEditorContent("");
    setEditingId(null);
    setEventToEdit(null);
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
      title: "Event",
      dataIndex: "title",
      key: "title",
      width: 250,
      render: (text, record) => (
        <Space direction="vertical" size={4}>
          <Text strong style={{ fontSize: 15 }}>
            {text}
          </Text>
          <Space size={8}>
            <Tag color="blue" icon={<CalendarOutlined />}>
              {record.date ? dayjs(record.date).format("MMM DD, YYYY") : "N/A"}
            </Tag>
            <Tag color="green">{record.category || "General"}</Tag>
          </Space>
        </Space>
      ),
    },
    {
      title: "Details",
      key: "details",
      width: 350,
      render: (_, record) => (
        <Space direction="vertical" size={4} style={{ width: "100%" }}>
          <Space>
            <ClockCircleOutlined style={{ color: "#1890ff" }} />
            <Text type="secondary">
              {record.time || record.startTime || "TBD"}
            </Text>
          </Space>
          <Space>
            <EnvironmentOutlined style={{ color: "#52c41a" }} />
            <Text type="secondary">{record.location || "TBD"}</Text>
          </Space>
          <Space>
            <TeamOutlined style={{ color: "#fa8c16" }} />
            <Text type="secondary">
              {record.organizer || record.host || "N/A"}
            </Text>
          </Space>
          <Space>
            <DollarOutlined style={{ color: "#722ed1" }} />
            <Text type="secondary">{record.cost || "Free"}</Text>
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
              title="Delete Event"
              description="Are you sure you want to delete this event?"
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
              📅 Event Management
            </Title>
            <Text type="secondary">Manage and organize your events</Text>
          </Col>
          <Col>
            <Space size={12}>
              <Input
                placeholder="Search events..."
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
                  setEventToEdit(null);
                  form.resetFields();
                }}
              >
                Add New Event
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <div style={{ textAlign: "center" }}>
              <Title level={3} style={{ color: "#1890ff", margin: 0 }}>
                {events.length}
              </Title>
              <Text type="secondary">Total Events</Text>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <div style={{ textAlign: "center" }}>
              <Title level={3} style={{ color: "#52c41a", margin: 0 }}>
                {filteredEvents.length}
              </Title>
              <Text type="secondary">Search Results</Text>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <div style={{ textAlign: "center" }}>
              <Title level={3} style={{ color: "#faad14", margin: 0 }}>
                {events.filter((e) => dayjs(e.date).isAfter(dayjs())).length}
              </Title>
              <Text type="secondary">Upcoming Events</Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredEvents}
          rowKey={(record) => getId(record)}
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} events`,
          }}
          scroll={{ x: 1400 }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <Space direction="vertical" size={8}>
                    <Text style={{ fontSize: 16 }}>No events found</Text>
                    <Text type="secondary">
                      {searchText
                        ? "Try adjusting your search"
                        : 'Click "Add New Event" to create your first event'}
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
              {editingId ? "Edit Event" : "Create New Event"}
            </Text>
          </Space>
        }
        open={showModal}
        onCancel={handleCloseModal}
        onOk={handleSubmit}
        width="90vw"
        style={{ top: 20 }}
        confirmLoading={submitting}
        okText={editingId ? "Update Event" : "Create Event"}
        cancelText="Cancel"
      >
        <Divider />
        <Form layout="vertical" form={form}>
          <Row gutter={16}>
            {/* Left Column */}
            <Col span={12}>
              <Card
                title="📝 Basic Information"
                size="small"
                style={{ marginBottom: 16 }}
              >
                <Form.Item
                  name="title"
                  label="Event Title"
                  rules={[
                    { required: true, message: "Please enter event title" },
                  ]}
                >
                  <Input
                    placeholder="e.g. Annual Tech Conference 2025"
                    size="large"
                  />
                </Form.Item>

                <Row gutter={12}>
                  <Col span={12}>
                    <Form.Item
                      name="date"
                      label="Event Date"
                      rules={[
                        { required: true, message: "Please select date" },
                      ]}
                    >
                      <DatePicker
                        style={{ width: "100%" }}
                        format="YYYY-MM-DD"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="time"
                      label="Time"
                      rules={[{ required: true, message: "Please enter time" }]}
                    >
                      <Input
                        prefix={<ClockCircleOutlined />}
                        placeholder="10:00 AM - 12:00 PM"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="location"
                  label="Location"
                  rules={[{ required: true, message: "Please enter location" }]}
                >
                  <Input
                    prefix={<EnvironmentOutlined />}
                    placeholder="e.g. Hanoi Convention Center"
                    size="large"
                  />
                </Form.Item>

                <Row gutter={12}>
                  <Col span={12}>
                    <Form.Item
                      name="organizer"
                      label="Organizer / Host"
                      rules={[
                        { required: true, message: "Please enter organizer" },
                      ]}
                    >
                      <Input
                        prefix={<TeamOutlined />}
                        placeholder="Organizer name"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="category"
                      label="Category"
                      rules={[
                        { required: true, message: "Please enter category" },
                      ]}
                    >
                      <Input
                        placeholder="Conference, Workshop, etc."
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={12}>
                  <Col span={12}>
                    <Form.Item name="cost" label="Cost / Price">
                      <Input
                        prefix={<DollarOutlined />}
                        placeholder="Free or amount"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="phone" label="Contact Phone">
                      <Input
                        prefix={<PhoneOutlined />}
                        placeholder="Contact number"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item name="description" label="Short Description">
                  <Input.TextArea
                    rows={3}
                    placeholder="Brief description of the event..."
                    showCount
                    maxLength={200}
                  />
                </Form.Item>
              </Card>

              {/* Image Upload */}
              <Card title="🖼️ Event Images" size="small">
                <Form.Item name="image" label="Main Image">
                  <div>
                    <Upload
                      customRequest={(options) =>
                        handleFileUpload(options, "image")
                      }
                      showUploadList={false}
                      accept="image/*"
                    >
                      <Button icon={<UploadOutlined />} size="large" block>
                        Upload Main Image
                      </Button>
                    </Upload>
                    {form.getFieldValue("image") && (
                      <div style={{ marginTop: 16, textAlign: "center" }}>
                        <Image
                          src={form.getFieldValue("image")}
                          style={{ maxWidth: "100%", borderRadius: 8 }}
                        />
                      </div>
                    )}
                  </div>
                </Form.Item>

                <Form.Item name="bannerImg" label="Banner Image (Optional)">
                  <div>
                    <Upload
                      customRequest={(options) =>
                        handleFileUpload(options, "bannerImg")
                      }
                      showUploadList={false}
                      accept="image/*"
                    >
                      <Button icon={<UploadOutlined />} size="large" block>
                        Upload Banner Image
                      </Button>
                    </Upload>
                    {form.getFieldValue("bannerImg") && (
                      <div style={{ marginTop: 16, textAlign: "center" }}>
                        <Image
                          src={form.getFieldValue("bannerImg")}
                          style={{ maxWidth: "100%", borderRadius: 8 }}
                        />
                      </div>
                    )}
                  </div>
                </Form.Item>
              </Card>
            </Col>

            {/* Right Column - Content Editor */}
            <Col span={12}>
              <Card title="📄 Event Content" size="small">
                <Form.Item
                  name="content"
                  rules={[
                    { required: true, message: "Please enter event content" },
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
                      height: 730,
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
            <Text strong>Event Preview</Text>
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
              handleEdit(getId(previewEvent));
            }}
          >
            Edit Event
          </Button>,
        ]}
        width={800}
      >
        {previewEvent && (
          <div>
            {previewEvent.image && (
              <Image
                src={previewEvent.image}
                style={{ width: "100%", borderRadius: 8, marginBottom: 16 }}
              />
            )}
            <Title level={3}>{previewEvent.title}</Title>
            <Space
              direction="vertical"
              size={12}
              style={{ width: "100%", marginBottom: 16 }}
            >
              <Space>
                <CalendarOutlined style={{ color: "#1890ff" }} />
                <Text strong>Date:</Text>
                <Text>{dayjs(previewEvent.date).format("MMMM DD, YYYY")}</Text>
              </Space>
              <Space>
                <ClockCircleOutlined style={{ color: "#52c41a" }} />
                <Text strong>Time:</Text>
                <Text>{previewEvent.time || previewEvent.startTime}</Text>
              </Space>
              <Space>
                <EnvironmentOutlined style={{ color: "#fa8c16" }} />
                <Text strong>Location:</Text>
                <Text>{previewEvent.location}</Text>
              </Space>
              <Space>
                <TeamOutlined style={{ color: "#722ed1" }} />
                <Text strong>Organizer:</Text>
                <Text>{previewEvent.organizer || previewEvent.host}</Text>
              </Space>
              <Space>
                <DollarOutlined style={{ color: "#13c2c2" }} />
                <Text strong>Cost:</Text>
                <Text>{previewEvent.cost || "Free"}</Text>
              </Space>
              {previewEvent.phone && previewEvent.phone !== "N/A" && (
                <Space>
                  <PhoneOutlined style={{ color: "#eb2f96" }} />
                  <Text strong>Phone:</Text>
                  <Text>{previewEvent.phone}</Text>
                </Space>
              )}
              <Tag color="blue">{previewEvent.category}</Tag>
            </Space>
            {previewEvent.description && (
              <>
                <Divider />
                <div>
                  <Text strong style={{ fontSize: 16 }}>
                    Description:
                  </Text>
                  <p style={{ marginTop: 8 }}>{previewEvent.description}</p>
                </div>
              </>
            )}
            <Divider />
            <div>
              <Text strong style={{ fontSize: 16 }}>
                Full Content:
              </Text>
              <div
                style={{ marginTop: 12 }}
                dangerouslySetInnerHTML={{ __html: previewEvent.content }}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminEvent;
