import { Spin, Typography } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

const { Text } = Typography

const Loading = ({ size = 'large', tip = '加载中...', style = {} }) => {
  const antIcon = <LoadingOutlined style={{ fontSize: size === 'large' ? 24 : 16 }} spin />

  return (
    <div 
      style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '200px',
        ...style 
      }}
    >
      <Spin indicator={antIcon} size={size} />
      {tip && (
        <Text type="secondary" style={{ marginTop: '12px' }}>
          {tip}
        </Text>
      )}
    </div>
  )
}

export default Loading