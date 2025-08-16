import { useState } from 'react'
import { Button, Card, Space, Typography, message, Popconfirm } from 'antd'
import { DatabaseOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons'
import { initDemoData, clearAllData } from '../utils/demoData'

const { Title, Text } = Typography

const DevTools = () => {
  const [loading, setLoading] = useState(false)

  const handleInitDemoData = async () => {
    setLoading(true)
    try {
      const result = initDemoData()
      if (result) {
        message.success('演示数据初始化成功！')
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      } else {
        message.info('系统已有数据，无需初始化')
      }
    } catch (error) {
      message.error('初始化失败：' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleClearData = async () => {
    setLoading(true)
    try {
      clearAllData()
      message.success('数据清除成功！')
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error) {
      message.error('清除失败：' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // 管理员工具 - 只在特定条件下显示
  const showDevTools = process.env.NODE_ENV === 'development' && 
                       localStorage.getItem('show_admin_tools') === 'true'
  
  if (!showDevTools) {
    return null
  }

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '20px', 
      right: '20px', 
      zIndex: 1000 
    }}>
      <Card 
        size="small" 
        title={<Text style={{ fontSize: '12px' }}>系统工具</Text>}
        style={{ 
          width: '200px',
          fontSize: '12px',
          opacity: 0.9,
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}
      >
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Button
            size="small"
            icon={<DatabaseOutlined />}
            onClick={handleInitDemoData}
            loading={loading}
            block
          >
            初始化演示数据
          </Button>
          
          <Popconfirm
            title="确定要清除所有数据吗？"
            description="此操作不可恢复"
            onConfirm={handleClearData}
            okText="确定"
            cancelText="取消"
          >
            <Button
              size="small"
              icon={<DeleteOutlined />}
              danger
              loading={loading}
              block
            >
              清除所有数据
            </Button>
          </Popconfirm>

          <Button
            size="small"
            icon={<ReloadOutlined />}
            onClick={() => window.location.reload()}
            block
          >
            刷新页面
          </Button>
        </Space>
      </Card>
    </div>
  )
}

export default DevTools