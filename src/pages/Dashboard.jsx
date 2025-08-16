import { useState, useEffect } from 'react'
import { Card, Typography, Row, Col, Button, Space } from 'antd'
import { PlusOutlined, EyeOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import ActivityStats from '../components/ActivityStats'
import AuthService from '../services/authService'
import ActivityService from '../services/activityService'

const { Title, Text } = Typography

const Dashboard = () => {
  const [currentUser, setCurrentUser] = useState(null)
  const [recentActivities, setRecentActivities] = useState([])
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
      }

      const activities = ActivityService.getAllActivities()
      const recent = activities
        .filter(activity => activity.status === 'upcoming')
        .sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time))
        .slice(0, 5)
      
      setRecentActivities(recent)
    } catch (error) {
      console.error('加载数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>
          欢迎回来，{currentUser?.username || '用户'}！
        </Title>
        <Text type="secondary">
          这里是您的活动管理中心
        </Text>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <ActivityStats />
        </Col>
        
        <Col xs={24} lg={8}>
          <Card 
            title="即将开始的活动" 
            extra={
              <Button 
                type="link" 
                onClick={() => navigate('/activities')}
              >
                查看全部
              </Button>
            }
          >
            {loading ? (
              <div>加载中...</div>
            ) : recentActivities.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <Text type="secondary">暂无即将开始的活动</Text>
              </div>
            ) : (
              <div>
                {recentActivities.map((activity, index) => (
                  <div 
                    key={activity.id} 
                    style={{ 
                      padding: '12px 0', 
                      borderBottom: index < recentActivities.length - 1 ? '1px solid #f0f0f0' : 'none'
                    }}
                  >
                    <div style={{ marginBottom: '4px' }}>
                      <Text strong>{activity.title}</Text>
                    </div>
                    <div style={{ marginBottom: '4px' }}>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {activity.date} {activity.time} · {activity.location}
                      </Text>
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {activity.participants.length}/{activity.maxParticipants} 人
                      </Text>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card style={{ marginTop: '16px' }}>
            <div style={{ textAlign: 'center' }}>
              <Title level={4}>快速操作</Title>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  block
                  size="large"
                  onClick={() => navigate('/create-activity')}
                >
                  创建新活动
                </Button>
                <Button 
                  icon={<EyeOutlined />}
                  block
                  size="large"
                  onClick={() => navigate('/my-activities')}
                >
                  管理我的活动
                </Button>
              </Space>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard