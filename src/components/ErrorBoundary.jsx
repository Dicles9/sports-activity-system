import React from 'react'
import { Result, Button } from 'antd'
import { FrownOutlined } from '@ant-design/icons'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
    
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoBack = () => {
    window.history.back()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '50px', textAlign: 'center' }}>
          <Result
            icon={<FrownOutlined />}
            title="页面出现了错误"
            subTitle="抱歉，页面遇到了意外错误。请尝试刷新页面或联系管理员。"
            extra={[
              <Button type="primary" key="reload" onClick={this.handleReload}>
                刷新页面
              </Button>,
              <Button key="back" onClick={this.handleGoBack}>
                返回上页
              </Button>
            ]}
          />
          
          {process.env.NODE_ENV === 'development' && (
            <details style={{ 
              marginTop: '24px', 
              textAlign: 'left',
              padding: '16px',
              background: '#f5f5f5',
              borderRadius: '4px'
            }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                错误详情（开发模式）
              </summary>
              <pre style={{ 
                marginTop: '8px', 
                fontSize: '12px',
                overflow: 'auto',
                maxHeight: '300px'
              }}>
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary