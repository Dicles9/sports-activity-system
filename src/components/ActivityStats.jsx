import { useState, useEffect } from 'react'
import { Card, Statistic, Row, Col, Typography, Progress } from 'antd'
import { 
  CalendarOutlined, 
  TeamOutlined, 
  TrophyOutlined,
  FireOutlined 
} from '@ant-design/icons'
import ActivityService, { ACTIVITY_TYPES } from '../services/activityService'

const { Title } = Typography

const ActivityStats = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    setLoading(true)
    try {
      const activityStats = ActivityService.getActivityStats()
      setStats(activityStats)
    } catch (error) {
      console.error('加载统计数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !stats) {
    return <Card loading />
  }

  const getMostPopularType = () => {
    if (!stats.byType || Object.keys(stats.byType).length === 0) {
      return { type: '暂无数据', count: 0 }
    }
    
    const sorted = Object.entries(stats.byType).sort(([,a], [,b]) => b - a)
    const [type, count] = sorted[0]
    return { 
      type: ACTIVITY_TYPES[type] || type, 
      count 
    }
  }

  const getTypePercentage = (count) => {
    return stats.total > 0 ? Math.round((count / stats.total) * 100) : 0
  }

  const mostPopular = getMostPopularType()

  return (
    <div>
      <Title level={4} style={{ marginBottom: '16px' }}>
        活动统计
      </Title>
      
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="总活动数"
              value={stats.total}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="未开始"
              value={stats.byStatus.upcoming}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="进行中"
              value={stats.byStatus.ongoing}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="已结束"
              value={stats.byStatus.finished}
              prefix={<FireOutlined />}
              valueStyle={{ color: '#8c8c8c' }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="热门活动类型">
        <div style={{ marginBottom: '16px' }}>
          <Statistic
            title="最受欢迎"
            value={mostPopular.type}
            suffix={`(${mostPopular.count} 个活动)`}
            valueStyle={{ fontSize: '16px' }}
          />
        </div>
        
        <div>
          {Object.entries(stats.byType).map(([type, count]) => {
            const percentage = getTypePercentage(count)
            return (
              <div key={type} style={{ marginBottom: '12px' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginBottom: '4px' 
                }}>
                  <span>{ACTIVITY_TYPES[type] || type}</span>
                  <span>{count} 个</span>
                </div>
                <Progress 
                  percent={percentage} 
                  showInfo={false}
                  strokeColor={{
                    '0%': '#1890ff',
                    '100%': '#52c41a',
                  }}
                />
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

export default ActivityStats