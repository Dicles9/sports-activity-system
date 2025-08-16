import { useState, useEffect } from 'react'
import { Layout, Menu, Button, Avatar, Dropdown, Space, Typography } from 'antd'
import { 
  HomeOutlined, 
  PlusOutlined, 
  UserOutlined, 
  LogoutOutlined,
  SettingOutlined,
  CalendarOutlined,
  FileTextOutlined
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import AuthService from '../services/authService'

const { Header: AntHeader } = Layout
const { Text } = Typography

const Header = () => {
  const [currentUser, setCurrentUser] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const authResult = AuthService.getCurrentUser()
    if (authResult.success) {
      setCurrentUser(authResult.user)
    }
  }, [location])

  const handleLogout = () => {
    AuthService.logout()
    setCurrentUser(null)
    navigate('/login')
  }

  const userMenu = {
    items: [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: '个人中心',
        onClick: () => navigate('/user-center')
      },
      {
        key: 'my-activities',
        icon: <CalendarOutlined />,
        label: '我的活动',
        onClick: () => navigate('/my-activities')
      },
      {
        key: 'orders',
        icon: <FileTextOutlined />,
        label: '我的订单',
        onClick: () => navigate('/orders')
      },
      {
        type: 'divider'
      },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: '退出登录',
        onClick: handleLogout
      }
    ]
  }

  const menuItems = [
    {
      key: '/activities',
      icon: <HomeOutlined />,
      label: '活动列表'
    },
    {
      key: '/create-activity',
      icon: <PlusOutlined />,
      label: '发布活动'
    }
  ]

  const handleMenuClick = (e) => {
    navigate(e.key)
  }

  return (
    <AntHeader style={{ 
      background: '#fff', 
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ 
          fontSize: '20px', 
          fontWeight: 'bold', 
          color: '#1890ff',
          marginRight: '32px',
          cursor: 'pointer'
        }} onClick={() => navigate('/activities')}>
          体育活动室管理系统
        </div>
        
        {currentUser && (
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={handleMenuClick}
            style={{ border: 'none', flex: 1 }}
          />
        )}
      </div>

      <div>
        {currentUser ? (
          <Dropdown menu={userMenu} placement="bottomRight">
            <Space style={{ cursor: 'pointer' }}>
              <Avatar icon={<UserOutlined />} />
              <Text>{currentUser.username}</Text>
            </Space>
          </Dropdown>
        ) : (
          <Space>
            <Button type="text" onClick={() => navigate('/login')}>
              登录
            </Button>
            <Button type="primary" onClick={() => navigate('/register')}>
              注册
            </Button>
          </Space>
        )}
      </div>
    </AntHeader>
  )
}

export default Header