import dayjs from 'dayjs'

export const validationRules = {
  username: [
    { required: true, message: '请输入用户名!' },
    { min: 3, message: '用户名至少3个字符!' },
    { max: 20, message: '用户名最多20个字符!' },
    { 
      pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/, 
      message: '用户名只能包含字母、数字、下划线和中文!' 
    }
  ],

  email: [
    { required: true, message: '请输入邮箱!' },
    { type: 'email', message: '请输入有效的邮箱地址!' }
  ],

  password: [
    { required: true, message: '请输入密码!' },
    { min: 6, message: '密码至少6个字符!' },
    { max: 50, message: '密码最多50个字符!' }
  ],

  confirmPassword: (getFieldValue) => [
    { required: true, message: '请确认密码!' },
    {
      validator(_, value) {
        if (!value || getFieldValue('password') === value) {
          return Promise.resolve()
        }
        return Promise.reject(new Error('两次输入的密码不一致!'))
      }
    }
  ],

  phone: [
    { 
      pattern: /^1[3-9]\d{9}$/, 
      message: '请输入有效的手机号!' 
    }
  ],

  activityTitle: [
    { required: true, message: '请输入活动标题!' },
    { min: 2, message: '标题至少2个字符!' },
    { max: 50, message: '标题最多50个字符!' }
  ],

  activityType: [
    { required: true, message: '请选择活动类型!' }
  ],

  activityDescription: [
    { max: 500, message: '描述最多500个字符!' }
  ],

  activityDate: [
    { required: true, message: '请选择活动日期!' },
    {
      validator(_, value) {
        if (!value) return Promise.resolve()
        if (value.isBefore(dayjs().startOf('day'))) {
          return Promise.reject(new Error('活动日期不能早于今天!'))
        }
        return Promise.resolve()
      }
    }
  ],

  activityTime: [
    { required: true, message: '请选择活动时间!' },
    {
      validator(_, value, { getFieldValue }) {
        if (!value) return Promise.resolve()
        const date = getFieldValue('date')
        if (!date) return Promise.resolve()
        
        const activityDateTime = dayjs(`${date.format('YYYY-MM-DD')} ${value.format('HH:mm')}`)
        if (activityDateTime.isBefore(dayjs())) {
          return Promise.reject(new Error('活动时间不能早于当前时间!'))
        }
        return Promise.resolve()
      }
    }
  ],

  activityLocation: [
    { required: true, message: '请输入活动地点!' },
    { min: 2, message: '地点至少2个字符!' },
    { max: 100, message: '地点最多100个字符!' }
  ],

  maxParticipants: [
    { required: true, message: '请输入参与人数上限!' },
    { type: 'number', min: 1, message: '人数上限至少为1人!' },
    { type: 'number', max: 100, message: '人数上限最多为100人!' }
  ],

  activityRules: [
    { max: 300, message: '规则最多300个字符!' }
  ]
}

export const validateForm = (form, rules) => {
  return new Promise((resolve, reject) => {
    form.validateFields()
      .then(values => {
        resolve(values)
      })
      .catch(errorInfo => {
        const firstError = errorInfo.errorFields?.[0]?.errors?.[0]
        if (firstError) {
          // 可以使用通知工具显示错误
          console.error('表单验证失败:', firstError)
        }
        reject(errorInfo)
      })
  })
}

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input
  
  return input
    .trim()
    .replace(/[<>]/g, '') // 移除可能的HTML标签
    .substring(0, 1000) // 限制长度
}

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validatePhone = (phone) => {
  const re = /^1[3-9]\d{9}$/
  return re.test(phone)
}

export const validatePassword = (password) => {
  return password && password.length >= 6 && password.length <= 50
}