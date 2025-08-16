import { useState, useEffect } from 'react'
import { 
  Card, 
  Typography, 
  Button, 
  Table, 
  Tag, 
  Space, 
  Modal, 
  message,
  Popconfirm,
  Tabs
} from 'antd'
import { 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  PlusOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import AuthService from '../services/authService'
import ActivityService, { ACTIVITY_TYPES, ACTIVITY_STATUS } from '../services/activityService'

const { Title } = Typography
const { TabPane } = Tabs

const MyActivities = () => {
  const [currentUser, setCurrentUser] = useState(null)
  const [activities, setActivities] = useState({ created: [], joined: [] })
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const authResult = AuthService.getCurrentUser()
      if (authResult.success) {
        setCurrentUser(authResult.user)
        const userActivities = ActivityService.getUserActivities(authResult.user.id)
        setActivities(userActivities)
      } else {
        navigate('/login')
      }
    } catch (error) {
      message.error('加载数据失败')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteActivity = async (activityId) => {
    try {
      const result = ActivityService.deleteActivity(activityId)
      if (result.success) {
        message.success(result.message)
        loadData()
      } else {
        message.error(result.message)
      }
    } catch (error) {
      message.error('删除活动失败')
    }
  }

  const handleLeaveActivity = async (activityId) => {
    try {
      const result = ActivityService.leaveActivity(activityId)
      if (result.success) {
        message.success(result.message)
        loadData()
      } else {
        message.error(result.message)
      }
    } catch (error) {
      message.error('取消报名失败')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'blue'
      case 'ongoing': return 'green'
      case 'finished': return 'default'
      default: return 'default'
    }
  }

  const createdColumns = [
    {
      title: '活动标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type) => <Tag>{ACTIVITY_TYPES[type]}</Tag>
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {ACTIVITY_STATUS[status]}
        </Tag>
      )
    },
    {
      title: '时间',
      key: 'datetime',
      render: (_, record) => `${record.date} ${record.time}`
    },
    {
      title: '地点',
      dataIndex: 'location',
      key: 'location',
      ellipsis: true
    },
    {
      title: '报名情况',
      key: 'participants',
      render: (_, record) => (
        <span>
          {record.participants.length}/{record.maxParticipants}
          {record.participants.length >= record.maxParticipants && (
            <Tag color="red" style={{ marginLeft: 8 }}>已满员</Tag>
          )}
        </span>
      )
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="link" 
            icon={<EyeOutlined />}
            onClick={() => navigate(`/activities/${record.id}`)}
          >
            查看
          </Button>
          {record.status === 'upcoming' && (
            <Popconfirm
              title="确定要删除这个活动吗？"
              description="删除后无法恢复，已报名的用户也会被取消报名。"
              onConfirm={() => handleDeleteActivity(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button 
                type="link" 
                danger
                icon={<DeleteOutlined />}
              >
                删除
              </Button>
            </Popconfirm>
          )}
        </Space>
      )
    }
  ]

  const joinedColumns = [
    {
      title: '活动标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type) => <Tag>{ACTIVITY_TYPES[type]}</Tag>
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {ACTIVITY_STATUS[status]}
        </Tag>
      )
    },
    {
      title: '时间',
      key: 'datetime',
      render: (_, record) => `${record.date} ${record.time}`
    },
    {
      title: '地点',
      dataIndex: 'location',
      key: 'location',
      ellipsis: true
    },
    {
      title: '发起人',
      key: 'creator',
      render: (_, record) => record.creator?.username || '未知'
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="link" 
            icon={<EyeOutlined />}
            onClick={() => navigate(`/activities/${record.id}`)}
          >
            查看
          </Button>
          {record.status === 'upcoming' && (
            <Popconfirm
              title="确定要取消报名吗？"
              onConfirm={() => handleLeaveActivity(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="link" danger>
                取消报名
              </Button>
            </Popconfirm>
          )}
        </Space>
      )
    }
  ]

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Title level={2}>我的活动</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => navigate('/create-activity')}
        >
          创建新活动
        </Button>
      </div>

      <Card>
        <Tabs defaultActiveKey="created">
          <TabPane tab={`我创建的活动 (${activities.created.length})`} key="created">
            <Table
              columns={createdColumns}
              dataSource={activities.created}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条记录`
              }}
              scroll={{ x: 800 }}
            />
          </TabPane>

          <TabPane tab={`我参与的活动 (${activities.joined.length})`} key="joined">
            <Table
              columns={joinedColumns}
              dataSource={activities.joined}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条记录`
              }}
              scroll={{ x: 800 }}
            />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  )
}

export default MyActivities