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
  UserOutlined,
  EyeOutlined,
  FileTextOutlined,
  ReadOutlined,
} from "@ant-design/icons";
import { getId } from "../../utils/idHelper";
import dayjs from "dayjs";
import "./AdminBlog.css";
import config from '../../config';
const { Title, Text, Paragraph } = Typography;

const AdminBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [previewModal, setPreviewModal] = useState(false);
  const [previewBlog, setPreviewBlog] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const editorRef = useRef(null);
  const [editingId, setEditingId] = useState(null);
  const [editorContent, setEditorContent] = useState("");
  const [blogToEdit, setBlogToEdit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    const filtered = blogs.filter(
      (blog) =>
        blog.title?.toLowerCase().includes(searchText.toLowerCase()) ||
        blog.author?.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredBlogs(filtered);
  }, [searchText, blogs]);

  useEffect(() => {
    if (blogToEdit && showModal) {
      form.setFieldsValue(blogToEdit);
      setEditorContent(blogToEdit.content ? String(blogToEdit.content) : "");
    }
  }, [blogToEdit, showModal, form]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${config.API_URL}/api/blog`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch blogs");

      const data = await response.json();
    
      setBlogs(data);
      setFilteredBlogs(data);
    } catch (error) {
      console.error("❌ Error fetching blogs:", error);
      message.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  const uploadToLocalServer = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${config.API_URL}/api/upload-media`, {
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
      const response = await fetch(`${config.API_URL}/api/blog/${id}`);

      if (!response.ok) throw new Error("Failed to fetch blog");

      const blogData = await response.json();
     
      setBlogToEdit(blogData);
      setShowModal(true);
      setEditingId(id);
      setEditorContent(blogData.content ? String(blogData.content) : "");
    } catch (error) {
      console.error("❌ Error fetching blog:", error);
      message.error("Cannot load blog data");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${config.API_URL}/api/blog/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Delete failed");

      setBlogs((prev) => prev.filter((blog) => getId(blog) !== id));
      message.success("Blog deleted successfully!");
    } catch (err) {
      console.error("❌ Delete error:", err);
      message.error("Failed to delete blog");
    }
  };

  const handlePreview = (record) => {
    setPreviewBlog(record);
    setPreviewModal(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      const isEdit = !!editingId;
      const updatedBlog = {
        ...values,
        content: editorContent,
        createdAt: isEdit ? blogToEdit.createdAt : new Date().toISOString(),
      };

      console.log("📤 Submitting blog:", updatedBlog);

      const url = isEdit ? `${config.API_URL}/api/blog/${editingId}` : `${config.API_URL}/api/blog/create`;

      const method = isEdit ? "PUT" : "POST";
      const token = localStorage.getItem("token");

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedBlog),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save blog");
      }

      await fetchBlogs();

      setShowModal(false);
      form.resetFields();
      setEditorContent("");
      setEditingId(null);
      setBlogToEdit(null);

      message.success(
        isEdit ? "Blog updated successfully!" : "Blog created successfully!"
      );
    } catch (error) {
      console.error("❌ Submit error:", error);
      message.error(error.message || "Failed to save blog");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    form.resetFields();
    setEditorContent("");
    setEditingId(null);
    setBlogToEdit(null);
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
      title: "Blog",
      dataIndex: "title",
      key: "title",
      width: 350,
      render: (text, record) => (
        <Space direction="vertical" size={4}>
          <Text strong style={{ fontSize: 15 }}>
            {text}
          </Text>
          <Space>
            <UserOutlined style={{ color: "#1890ff", fontSize: 12 }} />
            <Text type="secondary" style={{ fontSize: 13 }}>
              {record.author || "Unknown"}
            </Text>
          </Space>
        </Space>
      ),
    },
    {
      title: "Images",
      key: "images",
      width: 250,
      render: (_, record) => (
        <Space size={8}>
          {record.image && (
            <Tooltip title="Main Image">
              <Image
                src={record.image}
                width={50}
                height={50}
                style={{ objectFit: "cover", borderRadius: 6 }}
                preview={{
                  mask: <EyeOutlined />,
                }}
              />
            </Tooltip>
          )}
          {record.authorImg && (
            <Tooltip title="Author Image">
              <Image
                src={record.authorImg}
                width={50}
                height={50}
                style={{ objectFit: "cover", borderRadius: "50%" }}
                preview={{
                  mask: <EyeOutlined />,
                }}
              />
            </Tooltip>
          )}
          {record.bannerImg && (
            <Tooltip title="Banner Image">
              <Image
                src={record.bannerImg}
                width={50}
                height={50}
                style={{ objectFit: "cover", borderRadius: 6 }}
                preview={{
                  mask: <EyeOutlined />,
                }}
              />
            </Tooltip>
          )}
        </Space>
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
              title="Delete Blog"
              description="Are you sure you want to delete this blog post?"
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
              📝 Blog Management
            </Title>
            <Text type="secondary">Create and manage blog posts</Text>
          </Col>
          <Col>
            <Space size={12}>
              <Input
                placeholder="Search blogs..."
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
                  setBlogToEdit(null);
                  setShowModal(true);
                  form.resetFields();
                }}
              >
                Add New Blog
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card>
            <Statistic
              title="Total Blogs"
              value={blogs.length}
              prefix={<ReadOutlined />}
              valueStyle={{ color: "#1890ff", fontSize: 28 }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Statistic
              title="Search Results"
              value={filteredBlogs.length}
              prefix={<SearchOutlined />}
              valueStyle={{ color: "#52c41a", fontSize: 28 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredBlogs}
          rowKey={(record) => getId(record)}
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} blogs`,
          }}
          scroll={{ x: 1200 }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <Space direction="vertical" size={8}>
                    <Text style={{ fontSize: 16 }}>No blogs found</Text>
                    <Text type="secondary">
                      {searchText
                        ? "Try adjusting your search"
                        : 'Click "Add New Blog" to create your first blog post'}
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
              {editingId ? "Edit Blog Post" : "Create New Blog Post"}
            </Text>
          </Space>
        }
        open={showModal}
        onCancel={handleCloseModal}
        onOk={handleSubmit}
        width="90vw"
        style={{ top: 20 }}
        confirmLoading={submitting}
        okText={editingId ? "Update Blog" : "Create Blog"}
        cancelText="Cancel"
      >
        <Divider />
        <Form layout="vertical" form={form}>
          <Row gutter={16}>
            {/* Left Column */}
            <Col span={12}>
              {/* Basic Info */}
              <Card
                title="📝 Blog Information"
                size="small"
                style={{ marginBottom: 16 }}
              >
                <Form.Item
                  name="title"
                  label="Blog Title"
                  rules={[
                    { required: true, message: "Please enter blog title" },
                  ]}
                >
                  <Input
                    placeholder="e.g. Getting Started with React"
                    size="large"
                    prefix={<FileTextOutlined />}
                  />
                </Form.Item>

                <Form.Item
                  name="author"
                  label="Author Name"
                  rules={[
                    { required: true, message: "Please enter author name" },
                  ]}
                >
                  <Input
                    placeholder="Author's name"
                    size="large"
                    prefix={<UserOutlined />}
                  />
                </Form.Item>
              </Card>

              {/* Images Section */}
              <Card title="🖼️ Blog Images" size="small">
                <Form.Item label="Main Image" name="image">
                  <div>
                    <Upload
                      customRequest={(options) =>
                        handleFileUpload(options, "image")
                      }
                      showUploadList={false}
                      accept="image/*"
                    >
                      <Button icon={<UploadOutlined />} block size="large">
                        Upload Main Image
                      </Button>
                    </Upload>
                    {form.getFieldValue("image") && (
                      <div style={{ marginTop: 12, textAlign: "center" }}>
                        <Image
                          src={form.getFieldValue("image")}
                          width={200}
                          style={{ borderRadius: 8 }}
                        />
                      </div>
                    )}
                  </div>
                </Form.Item>

                <Form.Item label="Banner Image" name="bannerImg">
                  <div>
                    <Upload
                      customRequest={(options) =>
                        handleFileUpload(options, "bannerImg")
                      }
                      showUploadList={false}
                      accept="image/*"
                    >
                      <Button icon={<UploadOutlined />} block size="large">
                        Upload Banner Image
                      </Button>
                    </Upload>
                    {form.getFieldValue("bannerImg") && (
                      <div style={{ marginTop: 12, textAlign: "center" }}>
                        <Image
                          src={form.getFieldValue("bannerImg")}
                          width={200}
                          style={{ borderRadius: 8 }}
                        />
                      </div>
                    )}
                  </div>
                </Form.Item>

                <Form.Item label="Author Image" name="authorImg">
                  <div>
                    <Upload
                      customRequest={(options) =>
                        handleFileUpload(options, "authorImg")
                      }
                      showUploadList={false}
                      accept="image/*"
                    >
                      <Button icon={<UploadOutlined />} block size="large">
                        Upload Author Photo
                      </Button>
                    </Upload>
                    {form.getFieldValue("authorImg") && (
                      <div style={{ marginTop: 12, textAlign: "center" }}>
                        <Image
                          src={form.getFieldValue("authorImg")}
                          width={100}
                          style={{ borderRadius: "50%" }}
                        />
                      </div>
                    )}
                  </div>
                </Form.Item>
              </Card>
            </Col>

            {/* Right Column - Content Editor */}
            <Col span={12}>
              <Card title="📄 Blog Content" size="small">
                <Form.Item
                  label="Content"
                  name="content"
                  rules={[
                    { required: true, message: "Please enter blog content" },
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
                      height: 700,
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
            <Text strong>Blog Preview</Text>
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
              handleEdit(getId(previewBlog));
            }}
          >
            Edit Blog
          </Button>,
        ]}
        width={900}
      >
        {previewBlog && (
          <div>
            {previewBlog.bannerImg && (
              <Image
                src={previewBlog.bannerImg}
                style={{ width: "100%", borderRadius: 8, marginBottom: 16 }}
              />
            )}

            <Title level={2}>{previewBlog.title}</Title>

            <Space style={{ marginBottom: 16 }}>
              {previewBlog.authorImg && (
                <Image
                  src={previewBlog.authorImg}
                  width={40}
                  height={40}
                  style={{ borderRadius: "50%" }}
                  preview={false}
                />
              )}
              <div>
                <Text strong>{previewBlog.author}</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {dayjs(previewBlog.createdAt).format("MMMM DD, YYYY")}
                </Text>
              </div>
            </Space>

            {previewBlog.image && (
              <Image
                src={previewBlog.image}
                style={{ width: "100%", borderRadius: 8, marginBottom: 16 }}
              />
            )}

            <Divider />

            <div
              style={{ fontSize: 15, lineHeight: 1.8 }}
              dangerouslySetInnerHTML={{ __html: previewBlog.content }}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminBlog;
