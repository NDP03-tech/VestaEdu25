import React, { useEffect, useState } from "react";
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
  Typography,
  Row,
  Col,
  Badge,
  Select,
} from "antd";

import {
  UploadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  EyeOutlined,
  PhoneOutlined,
  MailOutlined,
  FacebookFilled,
  TwitterSquareFilled,
  LinkedinFilled,
} from "@ant-design/icons";

import config from "../../config";
import RichTextEditor from "../../components/Editor/RichTextEditor";

const { Title, Text } = Typography;
const { Option } = Select;

const AdminInstructor = () => {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [previewModal, setPreviewModal] = useState(false);
  const [previewItem, setPreviewItem] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bioContent, setBioContent] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const f = data.filter(
      (i) =>
        i.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        i.designation?.toLowerCase().includes(searchText.toLowerCase())
    );
    setFiltered(f);
  }, [searchText, data]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${config.API_URL}/api/instructors`);
      const json = await res.json();
      const arr = json.data || json;
      setData(arr);
      setFiltered(arr);
    } catch {
      message.error("Load instructor failed");
    } finally {
      setLoading(false);
    }
  };

  // upload image
  const uploadToServer = async (file) => {
    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch(`${config.API_URL}/api/upload-media`, {
      method: "POST",
      body: fd,
    });

    const data = await res.json();
    return data.fileUrl;
  };

  const handleUpload = async ({ file, onSuccess, onError }) => {
    const url = await uploadToServer(file);
    if (url) {
      form.setFieldValue("image", url);
      onSuccess("ok");
    } else onError();
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    setSubmitting(true);

    values.bio = bioContent || "";

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `${config.API_URL}/api/instructors/${editingId}`
        : `${config.API_URL}/api/instructors`;

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      message.success("Saved!");
      fetchData();
      setShowModal(false);
      form.resetFields();
      setBioContent("");
      setEditingId(null);
    } catch {
      message.error("Save failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (id) => {
    const res = await fetch(`${config.API_URL}/api/instructors/${id}`);
    const json = await res.json();
    const item = json.data || json;

    form.setFieldsValue(item);
    setBioContent(item.bio || "");
    setEditingId(id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    await fetch(`${config.API_URL}/api/instructors/${id}`, {
      method: "DELETE",
    });
    fetchData();
  };

  const columns = [
    {
      title: "No",
      render: (_, __, i) => (
        <Badge count={i + 1} style={{ background: "#1890ff" }} />
      ),
      width: 60,
    },
    {
      title: "Instructor",
      render: (_, r) => (
        <Space>
          <Image src={r.image} width={50} height={50} />
          <div>
            <Text strong>{r.name}</Text>
            <br />
            <Text type="secondary">{r.designation}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Contact",
      render: (_, r) => (
        <Space direction="vertical">
          {r.email && (
            <Text>
              <MailOutlined /> {r.email}
            </Text>
          )}
          {r.phone && (
            <Text>
              <PhoneOutlined /> {r.phone}
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (s) =>
        s === "active" ? <Tag color="green">Active</Tag> : <Tag>Inactive</Tag>,
    },
    {
      title: "Actions",
      render: (_, r) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => {
              setPreviewItem(r);
              setPreviewModal(true);
            }}
          />
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(r.id)}
          />
          <Popconfirm title="Delete?" onConfirm={() => handleDelete(r.id)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <Row justify="space-between">
          <Title level={3}>Instructor Management</Title>

          <Space>
            <Input
              placeholder="Search..."
              prefix={<SearchOutlined />}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setShowModal(true);
                setEditingId(null);
                setBioContent("");
                form.resetFields();
              }}
            >
              Add Instructor
            </Button>
          </Space>
        </Row>
      </Card>

      <Card style={{ marginTop: 20 }}>
        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          loading={loading}
        />
      </Card>

      {/* MODAL CREATE/EDIT */}
      <Modal
        open={showModal}
        onCancel={() => setShowModal(false)}
        onOk={handleSubmit}
        confirmLoading={submitting}
        width={900}
      >
        <Form layout="vertical" form={form}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item
            name="designation"
            label="Designation"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Bio">
            <RichTextEditor value={bioContent} onChange={setBioContent} />
          </Form.Item>

          <Form.Item name="image" label="Image">
            <Upload customRequest={handleUpload} showUploadList={false}>
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
            {form.getFieldValue("image") && (
              <Image src={form.getFieldValue("image")} width={120} />
            )}
          </Form.Item>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="email" label="Email">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="phone" label="Phone">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="facebook" label="Facebook">
            <Input />
          </Form.Item>

          <Form.Item name="twitter" label="Twitter">
            <Input />
          </Form.Item>

          <Form.Item name="linkedin" label="Linkedin">
            <Input />
          </Form.Item>

          <Form.Item name="status" label="Status" initialValue="active">
            <Select>
              <Option value="active">active</Option>
              <Option value="inactive">inactive</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* PREVIEW */}
      <Modal
        open={previewModal}
        onCancel={() => setPreviewModal(false)}
        footer={null}
      >
        {previewItem && (
          <div style={{ textAlign: "center" }}>
            <Image src={previewItem.image} width={200} />

            <Title level={3}>{previewItem.name}</Title>
            <Text>{previewItem.designation}</Text>

            <div style={{ marginTop: 10 }}>
              {previewItem.email && (
                <div>
                  <MailOutlined /> {previewItem.email}
                </div>
              )}

              {previewItem.phone && (
                <div>
                  <PhoneOutlined /> {previewItem.phone}
                </div>
              )}
            </div>

            <Space size={16} style={{ marginTop: 15 }}>
              {previewItem.facebook && (
                <a href={previewItem.facebook} target="_blank">
                  <FacebookFilled style={{ fontSize: 24 }} />
                </a>
              )}
              {previewItem.twitter && (
                <a href={previewItem.twitter} target="_blank">
                  <TwitterSquareFilled style={{ fontSize: 24 }} />
                </a>
              )}
              {previewItem.linkedin && (
                <a href={previewItem.linkedin} target="_blank">
                  <LinkedinFilled style={{ fontSize: 24 }} />
                </a>
              )}
            </Space>

            {previewItem.bio && (
              <div
                style={{ marginTop: 20, textAlign: "left" }}
                dangerouslySetInnerHTML={{ __html: previewItem.bio }}
              />
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminInstructor;
