import { Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

const { confirm } = Modal

const useConfirm = () => {
  const showConfirm = ({
    title = '确认操作',
    content = '您确定要执行此操作吗？',
    onOk,
    onCancel,
    okText = '确定',
    cancelText = '取消',
    type = 'warning',
    ...otherProps
  }) => {
    const config = {
      title,
      content,
      icon: <ExclamationCircleOutlined />,
      okText,
      cancelText,
      onOk: () => {
        return new Promise((resolve, reject) => {
          if (onOk) {
            const result = onOk()
            if (result && result.then) {
              result.then(resolve).catch(reject)
            } else {
              resolve()
            }
          } else {
            resolve()
          }
        })
      },
      onCancel,
      ...otherProps
    }

    if (type === 'danger') {
      config.okType = 'danger'
    }

    confirm(config)
  }

  const showDeleteConfirm = ({
    title = '确认删除',
    content = '删除后无法恢复，确定要删除吗？',
    onOk,
    ...otherProps
  }) => {
    showConfirm({
      title,
      content,
      type: 'danger',
      okText: '删除',
      okType: 'danger',
      onOk,
      ...otherProps
    })
  }

  const showLeaveConfirm = ({
    title = '确认取消',
    content = '确定要取消此操作吗？',
    onOk,
    ...otherProps
  }) => {
    showConfirm({
      title,
      content,
      okText: '取消操作',
      onOk,
      ...otherProps
    })
  }

  return {
    showConfirm,
    showDeleteConfirm,
    showLeaveConfirm
  }
}

export default useConfirm