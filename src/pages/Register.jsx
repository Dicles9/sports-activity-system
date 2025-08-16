import { useState } from 'react'
import { Form, Input, Button, Card, Typography, message, Space, Row, Col } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import AuthService from '../services/authService'

const { Title, Text } = Typography

const Register = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onFinish = async (values) => {
    setLoading(true)
    try {
      const result = AuthService.register(values)
      
      if (result.success) {
        message.success(result.message)
        navigate('/login')
      } else {
        message.error(result.message)
      }
    } catch (error) {
      message.error('注册失败，请重试')
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
            创建新账户
          </Title>
          <Text type="secondary" style={{ fontSize: '16px' }}>加入体育活动室管理系统</Text>
        </div>

        <div style={{ padding: '0 48px 24px' }}>
          <Form
            name="register"
            onFinish={onFinish}
            autoComplete="off"
            size="large"
          >
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="username"
                  rules={[
                    { required: true, message: '请输入用户名!' },
                    { min: 3, message: '用户名至少3个字符!' },
                    { max: 20, message: '用户名最多20个字符!' }
                  ]}
                >
                  <Input 
                    prefix={<UserOutlined />} 
                    placeholder="用户名" 
                    style={{ height: '48px' }}
                  />
                </Form.Item>
              </Col>
              
              <Col xs={24} md={12}>
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: '请输入邮箱!' },
                    { type: 'email', message: '请输入有效的邮箱地址!' }
                  ]}
                >
                  <Input 
                    prefix={<MailOutlined />} 
                    placeholder="邮箱地址" 
                    style={{ height: '48px' }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="phone"
              rules={[
                { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号!' }
              ]}
            >
              <Input 
                prefix={<PhoneOutlined />} 
                placeholder="手机号（可选）" 
                style={{ height: '48px' }}
              />
            </Form.Item>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: '请输入密码!' },
                    { min: 6, message: '密码至少6个字符!' }
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="密码"
                    style={{ height: '48px' }}
                  />
                </Form.Item>
              </Col>
              
              <Col xs={24} md={12}>
                <Form.Item
                  name="confirmPassword"
                  dependencies={['password']}
                  rules={[
                    { required: true, message: '请确认密码!' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve()
                        }
                        return Promise.reject(new Error('两次输入的密码不一致!'))
                      }
                    })
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="确认密码"
                    style={{ height: '48px' }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                block
                style={{ height: 48, fontSize: '16px', marginTop: '16px' }}
              >
                注册
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Space>
              <Text type="secondary" style={{ fontSize: '14px' }}>已有账户？</Text>
              <Link to="/login" style={{ fontSize: '14px' }}>立即登录</Link>
            </Space>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Register