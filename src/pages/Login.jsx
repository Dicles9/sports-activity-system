import { useState } from 'react'
import { Form, Input, Button, Card, Typography, message, Space } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import AuthService from '../services/authService'

const { Title, Text } = Typography

const Login = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onFinish = async (values) => {
    setLoading(true)
    try {
      const result = AuthService.login(values.username, values.password)
      
      if (result.success) {
        message.success(result.message)
        navigate('/activities')
      } else {
        message.error(result.message)
      }
    } catch (error) {
      message.error('登录失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '24px'
    }}>
      <Card style={{ 
        width: '100%', 
        maxWidth: '800px', 
        minWidth: '400px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
        borderRadius: '16px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32, padding: '0 24px' }}>
          <Title level={1} style={{ color: '#1890ff', marginBottom: 12, fontSize: '32px' }}>
            体育活动室管理系统
          </Title>
          <Text type="secondary" style={{ fontSize: '16px' }}>请登录您的账户</Text>
        </div>

        <div style={{ padding: '0 48px 24px' }}>
          <Form
            name="login"
            onFinish={onFinish}
            autoComplete="off"
            size="large"
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: '请输入用户名或邮箱!' }
              ]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="用户名或邮箱" 
                style={{ height: '48px' }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: '请输入密码!' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="密码"
                style={{ height: '48px' }}
              />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                block
                style={{ height: 48, fontSize: '16px', marginTop: '16px' }}
              >
                登录
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Space>
              <Text type="secondary" style={{ fontSize: '14px' }}>还没有账户？</Text>
              <Link to="/register" style={{ fontSize: '14px' }}>立即注册</Link>
            </Space>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Login