import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Card, 
  Typography, 
  Button, 
  Space, 
  Tag, 
  Descriptions, 
  List, 
  Avatar, 
  message,
  Spin,
  Divider
} from 'antd'
import { 
  ArrowLeftOutlined,
  CalendarOutlined, 
  EnvironmentOutlined, 
  UserOutlined,
  TeamOutlined
} from '@ant-design/icons'
import ActivityService, { ACTIVITY_TYPES, ACTIVITY_STATUS } from '../services/activityService'
import AuthService from '../services/authService'
import ActivityComments from '../components/ActivityComments'

const { Title, Text, Paragraph } = Typography

const ActivityDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activity, setActivity] = useState(null)
  const [loading, setLoading] = useState(true)
  const [joinLoading, setJoinLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    loadActivity()
    loadCurrentUser()
  }, [id])

  const loadCurrentUser = () => {
    const authResult = AuthService.getCurrentUser()
    if (authResult.success) {
      setCurrentUser(authResult.user)
    }
  }

  const loadActivity = async () => {
    setLoading(true)
    try {
      const result = ActivityService.getActivityById(id)
      if (result.success) {
        setActivity(result.activity)
      } else {
        message.error(result.message)
        navigate('/activities')
      }
    } catch (error) {
      message.error('加载活动详情失败')
      navigate('/activities')
    } finally {
      setLoading(false)
    }
  }

  const handleJoinActivity = async () => {
    setJoinLoading(true)
    try {
      const result = ActivityService.joinActivity(id)
      if (result.success) {
        message.success(result.message)
        loadActivity()
      } else {
        message.error(result.message)
      }
    } catch (error) {
      message.error('报名失败，请重试')
    } finally {
      setJoinLoading(false)
    }
  }

  const handleLeaveActivity = async () => {
    setJoinLoading(true)
    try {
      const result = ActivityService.leaveActivity(id)
      if (result.success) {
        message.success(result.message)
        loadActivity()
      } else {
        message.error(result.message)
      }
    } catch (error) {
      message.error('取消报名失败，请重试')
    } finally {
      setJoinLoading(false)
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

  const isUserJoined = () => {
    return currentUser && activity.participants.includes(currentUser.id)
  }

  const canJoinActivity = () => {
    if (!currentUser || !activity) return false
    if (activity.creatorId === currentUser.id) return false
    if (isUserJoined()) return false
    if (activity.participants.length >= activity.maxParticipants) return false
    if (activity.status !== 'upcoming') return false
    return true
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Spin size="large" />
      </div>
    )
  }

  if (!activity) {
    return null
  }

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: '24px' }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/activities')}
          style={{ marginBottom: '16px' }}
        >
          返回活动列表
        </Button>
      </div>

      <Card>
        <div style={{ marginBottom: '24px' }}>
          <Space size="middle">
            <Tag color={getStatusColor(activity.status)} style={{ fontSize: '14px', padding: '4px 8px' }}>
              {ACTIVITY_STATUS[activity.status]}
            </Tag>
            <Tag style={{ fontSize: '14px', padding: '4px 8px' }}>
              {ACTIVITY_TYPES[activity.type]}
            </Tag>
          </Space>
        </div>

        <Title level={2} style={{ marginBottom: '16px' }}>
          {activity.title}
        </Title>

        <Descriptions bordered column={2} style={{ marginBottom: '24px' }}>
          <Descriptions.Item label="活动时间" span={2}>
            <Space>
              <CalendarOutlined />
              <Text strong>{activity.date} {activity.time}</Text>
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="活动地点" span={2}>
            <Space>
              <EnvironmentOutlined />
              <Text>{activity.location}</Text>
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="参与人数">
            <Space>
              <TeamOutlined />
              <Text>{activity.participants.length}/{activity.maxParticipants} 人</Text>
              {activity.participants.length >= activity.maxParticipants && (
                <Tag color="red">已满员</Tag>
              )}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="发起人">
            <Space>
              <UserOutlined />
              <Text>{activity.creator?.username || '未知'}</Text>
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="创建时间" span={2}>
            {activity.createTime}
          </Descriptions.Item>
        </Descriptions>

        {activity.description && (
          <div style={{ marginBottom: '24px' }}>
            <Title level={4}>活动描述</Title>
            <Paragraph>{activity.description}</Paragraph>
          </div>
        )}

        {activity.rules && (
          <div style={{ marginBottom: '24px' }}>
            <Title level={4}>活动规则</Title>
            <Paragraph>{activity.rules}</Paragraph>
          </div>
        )}

        <div style={{ marginBottom: '24px' }}>
          <Space size="middle">
            {isUserJoined() ? (
              <Button 
                type="default" 
                danger
                loading={joinLoading}
                onClick={handleLeaveActivity}
                disabled={activity.status === 'ongoing'}
              >
                取消报名
              </Button>
            ) : (
              <Button 
                type="primary"
                loading={joinLoading}
                onClick={handleJoinActivity}
                disabled={!canJoinActivity()}
              >
                {activity.creatorId === currentUser?.id ? '这是我创建的活动' : '立即报名'}
              </Button>
            )}
          </Space>
        </div>

        <Divider />

        <div>
          <Title level={4} style={{ marginBottom: '16px' }}>
            参与人员 ({activity.participantDetails.length}人)
          </Title>
          
          {activity.participantDetails.length === 0 ? (
            <Text type="secondary">暂无人员报名</Text>
          ) : (
            <List
              itemLayout="horizontal"
              dataSource={activity.participantDetails}
              renderItem={(participant) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={participant.username}
                    description={`注册时间：${participant.registerTime}`}
                  />
                </List.Item>
              )}
            />
          )}
        </div>
      </Card>

      {/* 活动评论区 */}
      <div style={{ marginTop: '24px' }}>
        <ActivityComments activityId={id} />
      </div>
    </div>
  )
}

export default ActivityDetail