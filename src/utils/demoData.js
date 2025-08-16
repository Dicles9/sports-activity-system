import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'
import StorageService from '../services/storage'

const initDemoData = () => {
  // 检查是否已有数据
  const existingUsers = StorageService.getUsers()
  const existingActivities = StorageService.getActivities()
  
  if (existingUsers.length > 0 || existingActivities.length > 0) {
    return false // 已有数据，不初始化
  }

  // 创建演示用户
  const demoUsers = [
    {
      id: uuidv4(),
      username: 'admin',
      password: 'YWRtaW4xMjNzcG9ydHNfYWN0aXZpdHlfc2FsdA==', // admin123 (hashed)
      email: 'admin@example.com',
      phone: '13800138000',
      registerTime: dayjs().subtract(30, 'day').format('YYYY-MM-DD HH:mm:ss')
    },
    {
      id: uuidv4(),
      username: '张三',
      password: 'MTIzNDU2c3BvcnRzX2FjdGl2aXR5X3NhbHQ=', // 123456 (hashed)
      email: 'zhangsan@example.com',
      phone: '13800138001',
      registerTime: dayjs().subtract(25, 'day').format('YYYY-MM-DD HH:mm:ss')
    },
    {
      id: uuidv4(),
      username: '李四',
      password: 'MTIzNDU2c3BvcnRzX2FjdGl2aXR5X3NhbHQ=', // 123456 (hashed)
      email: 'lisi@example.com',
      phone: '13800138002',
      registerTime: dayjs().subtract(20, 'day').format('YYYY-MM-DD HH:mm:ss')
    },
    {
      id: uuidv4(),
      username: '王五',
      password: 'MTIzNDU2c3BvcnRzX2FjdGl2aXR5X3NhbHQ=', // 123456 (hashed)
      email: 'wangwu@example.com',
      phone: '13800138003',
      registerTime: dayjs().subtract(15, 'day').format('YYYY-MM-DD HH:mm:ss')
    }
  ]

  // 创建演示活动
  const demoActivities = [
    {
      id: uuidv4(),
      title: '周末篮球友谊赛',
      type: 'basketball',
      description: '欢迎所有篮球爱好者参加！我们将进行3对3的友谊比赛，提供饮用水和简单的奖品。请穿着运动装备参加。',
      date: dayjs().add(2, 'day').format('YYYY-MM-DD'),
      time: '14:00',
      location: '学校体育馆篮球场',
      maxParticipants: 12,
      participants: [demoUsers[1].id, demoUsers[2].id],
      creatorId: demoUsers[0].id,
      rules: '1. 比赛采用3对3形式\n2. 每场比赛15分钟\n3. 请准时到场\n4. 注意安全',
      status: 'upcoming',
      createTime: dayjs().subtract(3, 'day').format('YYYY-MM-DD HH:mm:ss')
    },
    {
      id: uuidv4(),
      title: '瑜伽放松课程',
      type: 'yoga',
      description: '适合初学者的瑜伽课程，帮助大家放松身心，缓解工作压力。我们会提供瑜伽垫，请穿着舒适的运动服装。',
      date: dayjs().add(1, 'day').format('YYYY-MM-DD'),
      time: '19:00',
      location: '健身房瑜伽室',
      maxParticipants: 15,
      participants: [demoUsers[0].id, demoUsers[3].id],
      creatorId: demoUsers[1].id,
      rules: '1. 请提前10分钟到场\n2. 穿着舒适的运动服\n3. 课程时长1小时\n4. 保持安静',
      status: 'upcoming',
      createTime: dayjs().subtract(5, 'day').format('YYYY-MM-DD HH:mm:ss')
    },
    {
      id: uuidv4(),
      title: '羽毛球双打锦标赛',
      type: 'badminton',
      description: '羽毛球双打比赛，欢迎所有水平的选手参加。我们会根据报名情况进行分组，确保比赛的公平性和趣味性。',
      date: dayjs().add(5, 'day').format('YYYY-MM-DD'),
      time: '16:00',
      location: '体育中心羽毛球馆',
      maxParticipants: 16,
      participants: [demoUsers[2].id, demoUsers[3].id],
      creatorId: demoUsers[2].id,
      rules: '1. 双打比赛\n2. 自带球拍\n3. 比赛采用淘汰制\n4. 设有奖品',
      status: 'upcoming',
      createTime: dayjs().subtract(2, 'day').format('YYYY-MM-DD HH:mm:ss')
    },
    {
      id: uuidv4(),
      title: '游泳训练营',
      type: 'swimming',
      description: '游泳技巧提升训练，适合有一定游泳基础的朋友。教练会针对性地指导大家改进游泳姿势和技巧。',
      date: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
      time: '18:00',
      location: '游泳馆',
      maxParticipants: 10,
      participants: [demoUsers[0].id, demoUsers[1].id, demoUsers[3].id],
      creatorId: demoUsers[3].id,
      rules: '1. 需要有基础游泳能力\n2. 自带游泳装备\n3. 训练时长1.5小时',
      status: 'finished',
      createTime: dayjs().subtract(7, 'day').format('YYYY-MM-DD HH:mm:ss')
    },
    {
      id: uuidv4(),
      title: '足球友谊赛',
      type: 'football',
      description: '11人制足球友谊赛，欢迎热爱足球的朋友参加。我们会组织两支队伍进行比赛，比赛时间为90分钟。',
      date: dayjs().add(7, 'day').format('YYYY-MM-DD'),
      time: '15:30',
      location: '学校足球场',
      maxParticipants: 22,
      participants: [demoUsers[1].id, demoUsers[2].id, demoUsers[3].id],
      creatorId: demoUsers[0].id,
      rules: '1. 11人制比赛\n2. 比赛时长90分钟\n3. 穿着足球鞋\n4. 注意安全',
      status: 'upcoming',
      createTime: dayjs().subtract(4, 'day').format('YYYY-MM-DD HH:mm:ss')
    },
    {
      id: uuidv4(),
      title: '网球入门教学',
      type: 'tennis',
      description: '面向网球初学者的教学活动，专业教练现场指导基本动作和技巧。欢迎零基础的朋友参加。',
      date: dayjs().add(3, 'day').format('YYYY-MM-DD'),
      time: '10:00',
      location: '网球场',
      maxParticipants: 8,
      participants: [demoUsers[0].id],
      creatorId: demoUsers[1].id,
      rules: '1. 适合初学者\n2. 提供球拍\n3. 教学时长2小时\n4. 穿着运动鞋',
      status: 'upcoming',
      createTime: dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss')
    }
  ]

  // 创建演示评论
  const demoComments = {}
  demoComments[demoActivities[0].id] = [
    {
      id: uuidv4(),
      activityId: demoActivities[0].id,
      authorId: demoUsers[1].id,
      content: '这个活动安排得很好，期待参加！',
      createTime: dayjs().subtract(2, 'day').format('YYYY-MM-DD HH:mm:ss'),
      likes: [demoUsers[0].id, demoUsers[2].id],
      replies: [
        {
          id: uuidv4(),
          authorId: demoUsers[0].id,
          content: '谢谢支持，到时见！',
          createTime: dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss')
        }
      ]
    },
    {
      id: uuidv4(),
      activityId: demoActivities[0].id,
      authorId: demoUsers[2].id,
      content: '需要自带篮球吗？',
      createTime: dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
      likes: [],
      replies: []
    }
  ]

  demoComments[demoActivities[1].id] = [
    {
      id: uuidv4(),
      activityId: demoActivities[1].id,
      authorId: demoUsers[3].id,
      content: '瑜伽课程很棒，老师教得很仔细！',
      createTime: dayjs().subtract(3, 'hour').format('YYYY-MM-DD HH:mm:ss'),
      likes: [demoUsers[0].id],
      replies: []
    }
  ]

  // 创建演示订单
  const demoOrders = [
    {
      id: uuidv4(),
      orderNumber: `SA${dayjs().format('YYYYMMDD')}ABC123`,
      activityId: demoActivities[0].id,
      userId: demoUsers[1].id,
      status: 'confirmed',
      orderData: {
        activityTitle: demoActivities[0].title,
        activityDate: demoActivities[0].date,
        activityTime: demoActivities[0].time,
        activityLocation: demoActivities[0].location,
        participantName: demoUsers[1].username,
        participantPhone: demoUsers[1].phone,
        specialRequirements: '',
        emergencyContact: ''
      },
      createTime: dayjs().subtract(2, 'day').format('YYYY-MM-DD HH:mm:ss'),
      updateTime: dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss')
    },
    {
      id: uuidv4(),
      orderNumber: `SA${dayjs().format('YYYYMMDD')}DEF456`,
      activityId: demoActivities[1].id,
      userId: demoUsers[3].id,
      status: 'pending',
      orderData: {
        activityTitle: demoActivities[1].title,
        activityDate: demoActivities[1].date,
        activityTime: demoActivities[1].time,
        activityLocation: demoActivities[1].location,
        participantName: demoUsers[3].username,
        participantPhone: demoUsers[3].phone,
        specialRequirements: '初学者，请多关照',
        emergencyContact: '张三 13800138001'
      },
      createTime: dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
      updateTime: dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss')
    }
  ]

  // 保存演示数据
  StorageService.saveUsers(demoUsers)
  StorageService.saveActivities(demoActivities)
  StorageService.setItem('sports_activity_comments', demoComments)
  StorageService.setItem('sports_activity_orders', demoOrders)

  return true // 初始化成功
}

const clearAllData = () => {
  StorageService.clear()
}

export { initDemoData, clearAllData }