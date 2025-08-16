import { useState, useEffect } from 'react'
import { 
  Card, 
  Typography, 
  Descriptions, 
  Button, 
  Modal, 
  Form, 
  Input, 
  message,
  Tabs,
  List,
  Tag,
  Space,
  Avatar,
  Statistic,
  Row,
  Col
} from 'antd'
import { 
  UserOutlined, 
  EditOutlined, 
  CalendarOutlined,
  TeamOutlined,
  TrophyOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import AuthService from '../services/authService'
import ActivityService, { ACTIVITY_TYPES, ACTIVITY_STATUS } from '../services/activityService'

const { Title, Text } = Typography
const { TabPane } = Tabs

const UserCenter = () => {
  const [currentUser, setCurrentUser] = useState(null)
  const [activities, setActivities] = useState({ created: [], joined: [] })
  const [changePasswordVisible, setChangePasswordVisible] = useState(false)
  const [loading, setLoading] = useState(true)
  const [form] = Form.useForm()
  const navigate = useNavigate()

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
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
      message.error('加载用户数据失败')
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (values) => {
    try {
      const result = AuthService.updatePassword(values.oldPassword, values.newPassword)
      
      if (result.success) {
        message.success(result.message)
        setChangePasswordVisible(false)
        form.resetFields()
      } else {
        message.error(result.message)
      }
    } catch (error) {
      message.error('修改密码失败，请重试')
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

  const getActivityStats = () => {
    const totalCreated = activities.created.length
    const totalJoined = activities.joined.length
    const upcomingActivities = [...activities.created, ...activities.joined]
      .filter(activity => activity.status === 'upcoming').length
    
    return { totalCreated, totalJoined, upcomingActivities }
  }

  if (loading) {
    return <Card loading style={{ margin: '24px' }} />
  }

  if (!currentUser) {
    return null
  }

  const stats = getActivityStats()

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      <Title level={2}>个人中心</Title>
      
      <Row gutter={[24, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={8}>
          <Card style={{ textAlign: 'center', padding: '16px' }}>
            <Statistic
              title="创建的活动"
              value={stats.totalCreated}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#1890ff', fontSize: '28px' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card style={{ textAlign: 'center', padding: '16px' }}>
            <Statistic
              title="参与的活动"
              value={stats.totalJoined}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#52c41a', fontSize: '28px' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card style={{ textAlign: 'center', padding: '16px' }}>
            <Statistic
              title="即将开始"
              value={stats.upcomingActivities}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#faad14', fontSize: '28px' }}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
          <Avatar size={64} icon={<UserOutlined />} />
          <div style={{ marginLeft: '16px', flex: 1 }}>
            <Title level={3} style={{ margin: 0 }}>
              {currentUser.username}
            </Title>
            <Text type="secondary">
              注册时间：{currentUser.registerTime}
            </Text>
          </div>
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            onClick={() => setChangePasswordVisible(true)}
          >
            修改密码
          </Button>
        </div>

        <Descriptions bordered column={2}>
          <Descriptions.Item label="用户名">
            {currentUser.username}
          </Descriptions.Item>
          <Descriptions.Item label="邮箱">
            {currentUser.email}
          </Descriptions.Item>
          <Descriptions.Item label="手机号">
            {currentUser.phone || '未设置'}
          </Descriptions.Item>
          <Descriptions.Item label="注册时间">
            {currentUser.registerTime}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card>
        <Tabs defaultActiveKey="created">
          <TabPane tab={`我创建的活动 (${activities.created.length})`} key="created">
            {activities.created.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <Text type="secondary">您还没有创建任何活动</Text>
                <br />
                <Button 
                  type="primary" 
                  style={{ marginTop: '16px' }}
                  onClick={() => navigate('/create-activity')}
                >
                  创建活动
                </Button>
              </div>
            ) : (
              <List
                itemLayout="horizontal"
                dataSource={activities.created}
                renderItem={(activity) => (
                  <List.Item
                    actions={[
                      <Button 
                        type="link" 
                        onClick={() => navigate(`/activities/${activity.id}`)}
                      >
                        查看详情
                      </Button>
                    ]}
                  >
                    <List.Item.Meta
                      title={
                        <Space>
                          <span>{activity.title}</span>
                          <Tag color={getStatusColor(activity.status)}>
                            {ACTIVITY_STATUS[activity.status]}
                          </Tag>
                          <Tag>{ACTIVITY_TYPES[activity.type]}</Tag>
                        </Space>
                      }
                      description={
                        <Space direction="vertical" size={4}>
                          <Text type="secondary">
                            时间：{activity.date} {activity.time}
                          </Text>
                          <Text type="secondary">
                            地点：{activity.location}
                          </Text>
                          <Text type="secondary">
                            报名人数：{activity.participants.length}/{activity.maxParticipants}
                          </Text>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </TabPane>

          <TabPane tab={`我参与的活动 (${activities.joined.length})`} key="joined">
            {activities.joined.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <Text type="secondary">您还没有参与任何活动</Text>
                <br />
                <Button 
                  type="primary" 
                  style={{ marginTop: '16px' }}
                  onClick={() => navigate('/activities')}
                >
                  浏览活动
                </Button>
              </div>
            ) : (
              <List
                itemLayout="horizontal"
                dataSource={activities.joined}
                renderItem={(activity) => (
                  <List.Item
                    actions={[
                      <Button 
                        type="link" 
                        onClick={() => navigate(`/activities/${activity.id}`)}
                      >
                        查看详情
                      </Button>
                    ]}
                  >
                    <List.Item.Meta
                      title={
                        <Space>
                          <span>{activity.title}</span>
                          <Tag color={getStatusColor(activity.status)}>
                            {ACTIVITY_STATUS[activity.status]}
                          </Tag>
                          <Tag>{ACTIVITY_TYPES[activity.type]}</Tag>
                        </Space>
                      }
                      description={
                        <Space direction="vertical" size={4}>
                          <Text type="secondary">
                            时间：{activity.date} {activity.time}
                          </Text>
                          <Text type="secondary">
                            地点：{activity.location}
                          </Text>
                          <Text type="secondary">
                            发起人：{activity.creator?.username || '未知'}
                          </Text>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </TabPane>
        </Tabs>
      </Card>

      <Modal
        title="修改密码"
        open={changePasswordVisible}
        onCancel={() => {
          setChangePasswordVisible(false)
          form.resetFields()
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleChangePassword}
        >
          <Form.Item
            name="oldPassword"
            label="原密码"
            rules={[{ required: true, message: '请输入原密码!' }]}
          >
            <Input.Password placeholder="请输入原密码" />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="新密码"
            rules={[
              { required: true, message: '请输入新密码!' },
              { min: 6, message: '密码至少6个字符!' }
            ]}
          >
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="确认新密码"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: '请确认新密码!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('两次输入的密码不一致!'))
                }
              })
            ]}
          >
            <Input.Password placeholder="请再次输入新密码" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                确认修改
              </Button>
              <Button onClick={() => {
                setChangePasswordVisible(false)
                form.resetFields()
              }}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default UserCenter