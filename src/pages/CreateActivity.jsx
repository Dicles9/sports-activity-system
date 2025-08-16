import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Card, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  TimePicker, 
  InputNumber, 
  Button, 
  Typography, 
  message,
  Space,
  Row,
  Col
} from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import ActivityService, { ACTIVITY_TYPES } from '../services/activityService'

const { Title } = Typography
const { TextArea } = Input
const { Option } = Select

const CreateActivity = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onFinish = async (values) => {
    setLoading(true)
    try {
      const activityData = {
        ...values,
        date: values.date.format('YYYY-MM-DD'),
        time: values.time.format('HH:mm')
      }

      const result = ActivityService.createActivity(activityData)
      
      if (result.success) {
        message.success(result.message)
        navigate('/activities')
      } else {
        message.error(result.message)
      }
    } catch (error) {
      message.error('创建活动失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const disabledDate = (current) => {
    return current && current < dayjs().startOf('day')
  }

  const disabledTime = (current) => {
    if (!current) return {}
    
    const now = dayjs()
    const isToday = current.isSame(now, 'day')
    
    if (!isToday) return {}
    
    return {
      disabledHours: () => {
        const hours = []
        for (let i = 0; i < now.hour(); i++) {
          hours.push(i)
        }
        return hours
      },
      disabledMinutes: (selectedHour) => {
        if (selectedHour === now.hour()) {
          const minutes = []
          for (let i = 0; i <= now.minute(); i++) {
            minutes.push(i)
          }
          return minutes
        }
        return []
      }
    }
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
        <Title level={2}>发布新活动</Title>
      </div>

      <Card style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row gutter={24}>
            <Col xs={24} lg={12}>
              <Form.Item
                name="title"
                label="活动标题"
                rules={[
                  { required: true, message: '请输入活动标题!' },
                  { max: 50, message: '标题最多50个字符!' }
                ]}
              >
                <Input placeholder="请输入活动标题" size="large" />
              </Form.Item>
            </Col>
            
            <Col xs={24} lg={12}>
              <Form.Item
                name="type"
                label="活动类型"
                rules={[{ required: true, message: '请选择活动类型!' }]}
              >
                <Select placeholder="请选择活动类型" size="large">
                  {Object.entries(ACTIVITY_TYPES).map(([key, label]) => (
                    <Option key={key} value={key}>{label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="活动描述"
            rules={[{ max: 500, message: '描述最多500个字符!' }]}
          >
            <TextArea 
              rows={4} 
              placeholder="请详细描述活动内容、要求等信息"
            />
          </Form.Item>

          <Row gutter={24}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="date"
                label="活动日期"
                rules={[{ required: true, message: '请选择活动日期!' }]}
              >
                <DatePicker 
                  style={{ width: '100%' }}
                  size="large"
                  disabledDate={disabledDate}
                  placeholder="选择日期"
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="time"
                label="活动时间"
                rules={[{ required: true, message: '请选择活动时间!' }]}
              >
                <TimePicker 
                  style={{ width: '100%' }}
                  size="large"
                  format="HH:mm"
                  placeholder="选择时间"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col xs={24} lg={16}>
              <Form.Item
                name="location"
                label="活动地点"
                rules={[
                  { required: true, message: '请输入活动地点!' },
                  { max: 100, message: '地点最多100个字符!' }
                ]}
              >
                <Input placeholder="请输入详细的活动地点" size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} lg={8}>
              <Form.Item
                name="maxParticipants"
                label="参与人数上限"
                rules={[
                  { required: true, message: '请输入参与人数上限!' },
                  { type: 'number', min: 1, message: '人数上限至少为1人!' },
                  { type: 'number', max: 100, message: '人数上限最多为100人!' }
                ]}
              >
                <InputNumber 
                  style={{ width: '100%' }}
                  size="large"
                  min={1}
                  max={100}
                  placeholder="请输入参与人数上限"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="rules"
            label="活动规则"
            rules={[{ max: 300, message: '规则最多300个字符!' }]}
          >
            <TextArea 
              rows={3} 
              placeholder="请输入活动规则、注意事项等（可选）"
            />
          </Form.Item>

          <Form.Item>
            <Space size="large">
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                size="large"
                style={{ minWidth: '120px' }}
              >
                发布活动
              </Button>
              <Button 
                size="large"
                style={{ minWidth: '120px' }}
                onClick={() => navigate('/activities')}
              >
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default CreateActivity