import { useEffect, useState, useRef } from 'react';
import {
  Tabs, Table, message, Card, Typography,
  Input, Button, Space, Tag
} from 'antd';
import {
  BookOutlined, TeamOutlined,
  SearchOutlined, DownloadOutlined,
  FilePdfOutlined,
} from '@ant-design/icons';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import roboto from '../../fonts/Roboto-Regular-normal.js';
import 'jspdf-autotable';

const { Title } = Typography;

const isRecent = (dateStr) => {
  const createdAt = new Date(dateStr);
  const now = new Date();
  const diffInHours = (now - createdAt) / (1000 * 60 * 60);
  return diffInHours <= 24;
};

const RegistrationTableTabs = () => {
  const [eventRegistrations, setEventRegistrations] = useState([]);
  const [courseRegistrations, setCourseRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchInput = useRef(null);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');

  const fetchData = async (type) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/${type}-registrations`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const err = await res.json();
        message.error(err.message || `Failed to fetch ${type} registrations`);
        return;
      }

      const data = await res.json();
      type === 'event' ? setEventRegistrations(data) : setCourseRegistrations(data);
    } catch (err) {
      console.error(`❌ Failed to fetch ${type} registrations:`, err);
      message.error('Error fetching registrations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData('event');
    fetchData('course');
  }, []);

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const exportPDF = (data, type) => {
    const doc = new jsPDF();
    // Đăng ký font Roboto
    if (doc.addFileToVFS && doc.addFont) {
      doc.addFileToVFS('Roboto-Regular.ttf', roboto);
      doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
      doc.setFont('Roboto');
    }
    const tableColumn = ["Name", "Email", "Phone", "Date", `${type} Title`];
    const tableRows = [];

    data.forEach((item) => {
      tableRows.push([
        item.name,
        item.email,
        item.phone,
        new Date(item.createdAt).toLocaleString(),
        type === 'Event' ? item.eventTitle : item.courseTitle,
      ]);
    });

  doc.text(`${type} Registrations`, 14, 15);
    doc.autoTable({
      startY: 20,
      head: [tableColumn],
      body: tableRows,
      styles: { fontSize: 10, font: 'Roboto' },
    });

    doc.save(`${type.toLowerCase()}_registrations.pdf`);
  };

  const commonColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      ...getColumnSearchProps('email'),
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      ...getColumnSearchProps('phone'),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => (
        <span>
          {new Date(text).toLocaleString()} {isRecent(text) && <Tag color="green">New</Tag>}
        </span>
      ),
    },
  ];

  const eventColumns = [
    ...commonColumns,
    {
      title: 'Event Title',
      dataIndex: 'eventTitle',
      key: 'eventTitle',
      ...getColumnSearchProps('eventTitle'),
    },
  ];

  const courseColumns = [
    ...commonColumns,
    {
      title: 'Course Title',
      dataIndex: 'courseTitle',
      key: 'courseTitle',
      ...getColumnSearchProps('courseTitle'),
    },
  ];

  return (
    <Card
      style={{
        marginTop: 24,
        borderRadius: 10,
        boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
        padding: 16,
      }}
    >
      <Tabs
        defaultActiveKey="events"
        type="card"
        tabBarStyle={{ padding: '0 16px', marginBottom: 0 }}
        items={[
          {
            key: 'events',
            label: (
              <span>
                <TeamOutlined /> Event Registrations
              </span>
            ),
            children: (
              <div style={{ padding: 16 }}>
                <Space style={{ marginBottom: 8, float: 'right' }}>
                  <Button icon={<FilePdfOutlined />} type="default" onClick={() => exportPDF(eventRegistrations, 'Event')}>
                    Export PDF
                  </Button>
                </Space>
                <Table
                  dataSource={eventRegistrations}
                  columns={eventColumns}
                  rowKey="id"
                  loading={loading}
                  pagination={{ pageSize: 5 }}
                />
              </div>
            ),
          },
          {
            key: 'courses',
            label: (
              <span>
                <BookOutlined /> Course Registrations
              </span>
            ),
            children: (
              <div style={{ padding: 16 }}>
                <Space style={{ marginBottom: 8, float: 'right' }}>
                  <Button icon={<FilePdfOutlined />} type="default" onClick={() => exportPDF(courseRegistrations, 'Course')}>
                    Export PDF
                  </Button>
                </Space>
                <Table
                  dataSource={courseRegistrations}
                  columns={courseColumns}
                  rowKey="id"
                  loading={loading}
                  pagination={{ pageSize: 5 }}
                />
              </div>
            ),
          },
        ]}
      />
    </Card>
  );
};

export default RegistrationTableTabs;
