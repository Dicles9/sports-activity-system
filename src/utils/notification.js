import { message, notification } from 'antd'
import { 
  CheckCircleOutlined, 
  ExclamationCircleOutlined, 
  CloseCircleOutlined,
  InfoCircleOutlined 
} from '@ant-design/icons'

class NotificationUtil {
  static success(content, duration = 3) {
    message.success({
      content,
      duration,
      icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />
    })
  }

  static error(content, duration = 4) {
    message.error({
      content,
      duration,
      icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
    })
  }

  static warning(content, duration = 3) {
    message.warning({
      content,
      duration,
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />
    })
  }

  static info(content, duration = 3) {
    message.info({
      content,
      duration,
      icon: <InfoCircleOutlined style={{ color: '#1890ff' }} />
    })
  }

  static loading(content = '操作中...', duration = 0) {
    return message.loading(content, duration)
  }

  static notificationSuccess(title, description) {
    notification.success({
      message: title,
      description,
      placement: 'topRight',
      duration: 4,
      icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />
    })
  }

  static notificationError(title, description) {
    notification.error({
      message: title,
      description,
      placement: 'topRight',
      duration: 6,
      icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
    })
  }

  static notificationWarning(title, description) {
    notification.warning({
      message: title,
      description,
      placement: 'topRight',
      duration: 4,
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />
    })
  }

  static notificationInfo(title, description) {
    notification.info({
      message: title,
      description,
      placement: 'topRight',
      duration: 4,
      icon: <InfoCircleOutlined style={{ color: '#1890ff' }} />
    })
  }

  static destroy() {
    message.destroy()
    notification.destroy()
  }
}

export default NotificationUtil