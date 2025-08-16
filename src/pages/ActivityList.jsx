import { useState, useEffect } from 'react'
import { 
  Card, 
  Empty, 
  Typography, 
  Row, 
  Col, 
  Button, 
  Tag, 
  Space, 
  Select, 
  Input,
  message,
  Badge
} from 'antd'
import { 
  CalendarOutlined, 
  EnvironmentOutlined, 
  UserOutlined,
  SearchOutlined,
  EyeOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import ActivityService, { ACTIVITY_TYPES, ACTIVITY_STATUS } from '../services/activityService'
import AuthService from '../services/authService'

const { Title, Text, Paragraph } = Typography
const { Option } = Select
const { Search } = Input

const ActivityList = () => {
  const [activities, setActivities] = useState([])
  const [filteredActivities, setFilteredActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState('all')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [currentUser, setCurrentUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    loadActivities()
    loadCurrentUser()
  }, [])

  useEffect(() => {
    filterActivities()
  }, [activities, filterType, searchKeyword])

  const loadCurrentUser = () => {
    const authResult = AuthService.getCurrentUser()
    if (authResult.success) {
      setCurrentUser(authResult.user)
    }
  }

  const loadActivities = async () => {
    setLoading(true)
    try {
      const activityList = ActivityService.getAllActivities()
      setActivities(activityList)
    } catch (error) {
      message.error('加载活动列表失败')
    } finally {
      setLoading(false)
    }
  }

  const filterActivities = () => {
    let filtered = activities

    if (filterType !== 'all') {
      filtered = filtered.filter(activity => activity.type === filterType)
    }

    if (searchKeyword) {
      filtered = ActivityService.searchActivities(searchKeyword).filter(activity => 
        filterType === 'all' || activity.type === filterType
      )
    }

    setFilteredActivities(filtered)
  }

  const handleJoinActivity = async (activityId) => {
    const result = ActivityService.joinActivity(activityId)
    if (result.success) {
      message.success(result.message)
      loadActivities()
    } else {
      message.error(result.message)
    }
  }

  const handleLeaveActivity = async (activityId) => {
    const result = ActivityService.leaveActivity(activityId)
    if (result.success) {
      message.success(result.message)
      loadActivities()
    } else {
      message.error(result.message)
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

  const isUserJoined = (activity) => {
    return currentUser && activity.participants.includes(currentUser.id)
  }

  const canJoinActivity = (activity) => {
    if (!currentUser) return false
    if (activity.creatorId === currentUser.id) return false
    if (isUserJoined(activity)) return false
    if (activity.participants.length >= activity.maxParticipants) return false
    if (activity.status !== 'upcoming') return false
    return true
  }

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>活动列表</Title>
        
        <Card style={{ marginBottom: '16px' }}>
          <Row gutter={16} align="middle">
            <Col xs={24} sm={12} md={8}>
              <Search
                placeholder="搜索活动标题或地点"
                onSearch={setSearchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                style={{ width: '100%' }}
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Select
                style={{ width: '100%' }}
                value={filterType}
                onChange={setFilterType}
                placeholder="选择活动类型"
              >
                <Option value="all">全部类型</Option>
                {Object.entries(ACTIVITY_TYPES).map(([key, label]) => (
                  <Option key={key} value={key}>{label}</Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={24} md={8}>
              <Text type="secondary">
                共 {filteredActivities.length} 个活动
              </Text>
            </Col>
          </Row>
        </Card>
      </div>

      {loading ? (
        <Card loading />
      ) : filteredActivities.length === 0 ? (
        <Card>
          <Empty description="暂无活动数据" />
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {filteredActivities.map(activity => (
            <Col xs={24} sm={12} lg={8} key={activity.id}>
              <Card
                hoverable
                actions={[
                  <Button 
                    type="link" 
                    icon={<EyeOutlined />}
                    onClick={() => navigate(`/activities/${activity.id}`)}
                  >
                    查看详情
                  </Button>,
                  isUserJoined(activity) ? (
                    <Button 
                      type="link" 
                      danger
                      onClick={() => handleLeaveActivity(activity.id)}
                      disabled={activity.status === 'ongoing'}
                    >
                      取消报名
                    </Button>
                  ) : (
                    <Button 
                      type="link"
                      onClick={() => handleJoinActivity(activity.id)}
                      disabled={!canJoinActivity(activity)}
                    >
                      {activity.creatorId === currentUser?.id ? '我的活动' : '立即报名'}
                    </Button>
                  )
                ]}
              >
                <div style={{ marginBottom: '12px' }}>
                  <Space size="small">
                    <Tag color={getStatusColor(activity.status)}>
                      {ACTIVITY_STATUS[activity.status]}
                    </Tag>
                    <Tag>{ACTIVITY_TYPES[activity.type]}</Tag>
                  </Space>
                </div>

                <Title level={4} style={{ marginBottom: '8px' }}>
                  {activity.title}
                </Title>

                <Paragraph
                  ellipsis={{ rows: 2 }}
                  style={{ color: '#666', marginBottom: '12px' }}
                >
                  {activity.description || '暂无描述'}
                </Paragraph>

                <Space direction="vertical" style={{ width: '100%' }}>
                  <Space>
                    <CalendarOutlined />
                    <Text>{activity.date} {activity.time}</Text>
                  </Space>
                  <Space>
                    <EnvironmentOutlined />
                    <Text>{activity.location}</Text>
                  </Space>
                  <Space>
                    <UserOutlined />
                    <Text>
                      {activity.participants.length}/{activity.maxParticipants} 人
                    </Text>
                    {activity.participants.length >= activity.maxParticipants && (
                      <Badge status="error" text="已满员" />
                    )}
                  </Space>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    发起人：{activity.creator?.username || '未知'}
                  </Text>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  )
}

export default ActivityList