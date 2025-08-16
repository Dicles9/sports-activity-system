import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'
import StorageService from './storage'
import AuthService from './authService'

export const ACTIVITY_TYPES = {
  basketball: '篮球',
  football: '足球',
  badminton: '羽毛球',
  yoga: '瑜伽',
  swimming: '游泳',
  tennis: '网球',
  other: '其他'
}

export const ACTIVITY_STATUS = {
  upcoming: '未开始',
  ongoing: '进行中',
  finished: '已结束'
}

class ActivityService {
  static createActivity(activityData) {
    const currentUser = AuthService.getCurrentUser()
    if (!currentUser.success) {
      return { success: false, message: '请先登录' }
    }

    const { title, type, description, date, time, location, maxParticipants, rules } = activityData

    if (!title || !type || !date || !time || !location || !maxParticipants) {
      return { success: false, message: '请填写完整的活动信息' }
    }

    if (maxParticipants < 1) {
      return { success: false, message: '活动人数上限不能少于1人' }
    }

    const activityDateTime = dayjs(`${date} ${time}`)
    if (activityDateTime.isBefore(dayjs())) {
      return { success: false, message: '活动时间不能早于当前时间' }
    }

    const newActivity = {
      id: uuidv4(),
      title,
      type,
      description: description || '',
      date,
      time,
      location,
      maxParticipants: parseInt(maxParticipants),
      participants: [],
      creatorId: currentUser.user.id,
      rules: rules || '',
      status: this.getActivityStatus(date, time),
      createTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
    }

    const activities = StorageService.getActivities()
    activities.push(newActivity)
    StorageService.saveActivities(activities)

    return { success: true, message: '活动创建成功', activity: newActivity }
  }

  static getAllActivities() {
    const activities = StorageService.getActivities()
    return activities.map(activity => ({
      ...activity,
      status: this.getActivityStatus(activity.date, activity.time),
      creator: AuthService.getUserById(activity.creatorId)
    }))
  }

  static getActivityById(activityId) {
    const activities = StorageService.getActivities()
    const activity = activities.find(a => a.id === activityId)
    
    if (!activity) {
      return { success: false, message: '活动不存在' }
    }

    return {
      success: true,
      activity: {
        ...activity,
        status: this.getActivityStatus(activity.date, activity.time),
        creator: AuthService.getUserById(activity.creatorId),
        participantDetails: activity.participants.map(participantId => 
          AuthService.getUserById(participantId)
        ).filter(Boolean)
      }
    }
  }

  static joinActivity(activityId) {
    const currentUser = AuthService.getCurrentUser()
    if (!currentUser.success) {
      return { success: false, message: '请先登录' }
    }

    const activities = StorageService.getActivities()
    const activityIndex = activities.findIndex(a => a.id === activityId)
    
    if (activityIndex === -1) {
      return { success: false, message: '活动不存在' }
    }

    const activity = activities[activityIndex]
    const userId = currentUser.user.id

    if (activity.creatorId === userId) {
      return { success: false, message: '不能报名自己创建的活动' }
    }

    if (activity.participants.includes(userId)) {
      return { success: false, message: '您已经报名了这个活动' }
    }

    if (activity.participants.length >= activity.maxParticipants) {
      return { success: false, message: '活动报名人数已满' }
    }

    const activityStatus = this.getActivityStatus(activity.date, activity.time)
    if (activityStatus !== 'upcoming') {
      return { success: false, message: '活动已开始或结束，无法报名' }
    }

    activities[activityIndex].participants.push(userId)
    StorageService.saveActivities(activities)

    return { success: true, message: '报名成功' }
  }

  static leaveActivity(activityId) {
    const currentUser = AuthService.getCurrentUser()
    if (!currentUser.success) {
      return { success: false, message: '请先登录' }
    }

    const activities = StorageService.getActivities()
    const activityIndex = activities.findIndex(a => a.id === activityId)
    
    if (activityIndex === -1) {
      return { success: false, message: '活动不存在' }
    }

    const activity = activities[activityIndex]
    const userId = currentUser.user.id

    if (!activity.participants.includes(userId)) {
      return { success: false, message: '您未报名此活动' }
    }

    const activityStatus = this.getActivityStatus(activity.date, activity.time)
    if (activityStatus === 'ongoing') {
      return { success: false, message: '活动已开始，无法取消报名' }
    }

    activities[activityIndex].participants = activity.participants.filter(id => id !== userId)
    StorageService.saveActivities(activities)

    return { success: true, message: '取消报名成功' }
  }

  static getUserActivities(userId) {
    const activities = StorageService.getActivities()
    
    return {
      created: activities.filter(a => a.creatorId === userId).map(activity => ({
        ...activity,
        status: this.getActivityStatus(activity.date, activity.time)
      })),
      joined: activities.filter(a => a.participants.includes(userId)).map(activity => ({
        ...activity,
        status: this.getActivityStatus(activity.date, activity.time),
        creator: AuthService.getUserById(activity.creatorId)
      }))
    }
  }

  static updateActivity(activityId, updateData) {
    const currentUser = AuthService.getCurrentUser()
    if (!currentUser.success) {
      return { success: false, message: '请先登录' }
    }

    const activities = StorageService.getActivities()
    const activityIndex = activities.findIndex(a => a.id === activityId)
    
    if (activityIndex === -1) {
      return { success: false, message: '活动不存在' }
    }

    const activity = activities[activityIndex]
    
    if (activity.creatorId !== currentUser.user.id) {
      return { success: false, message: '只能修改自己创建的活动' }
    }

    const activityStatus = this.getActivityStatus(activity.date, activity.time)
    if (activityStatus !== 'upcoming') {
      return { success: false, message: '活动已开始或结束，无法修改' }
    }

    if (updateData.maxParticipants && updateData.maxParticipants < activity.participants.length) {
      return { success: false, message: '人数上限不能少于已报名人数' }
    }

    activities[activityIndex] = { ...activity, ...updateData }
    StorageService.saveActivities(activities)

    return { success: true, message: '活动更新成功' }
  }

  static deleteActivity(activityId) {
    const currentUser = AuthService.getCurrentUser()
    if (!currentUser.success) {
      return { success: false, message: '请先登录' }
    }

    const activities = StorageService.getActivities()
    const activityIndex = activities.findIndex(a => a.id === activityId)
    
    if (activityIndex === -1) {
      return { success: false, message: '活动不存在' }
    }

    const activity = activities[activityIndex]
    
    if (activity.creatorId !== currentUser.user.id) {
      return { success: false, message: '只能删除自己创建的活动' }
    }

    activities.splice(activityIndex, 1)
    StorageService.saveActivities(activities)

    return { success: true, message: '活动删除成功' }
  }

  static getActivityStatus(date, time) {
    const activityDateTime = dayjs(`${date} ${time}`)
    const now = dayjs()
    const activityEndTime = activityDateTime.add(2, 'hour')

    if (now.isBefore(activityDateTime)) {
      return 'upcoming'
    } else if (now.isAfter(activityDateTime) && now.isBefore(activityEndTime)) {
      return 'ongoing'
    } else {
      return 'finished'
    }
  }

  static searchActivities(keyword) {
    const activities = this.getAllActivities()
    
    if (!keyword) {
      return activities
    }

    const searchKeyword = keyword.toLowerCase()
    return activities.filter(activity => 
      activity.title.toLowerCase().includes(searchKeyword) ||
      activity.location.toLowerCase().includes(searchKeyword) ||
      activity.description.toLowerCase().includes(searchKeyword)
    )
  }

  static getActivityStats() {
    const activities = StorageService.getActivities()
    const stats = {
      total: activities.length,
      byType: {},
      byStatus: { upcoming: 0, ongoing: 0, finished: 0 }
    }

    activities.forEach(activity => {
      const status = this.getActivityStatus(activity.date, activity.time)
      stats.byStatus[status]++
      
      if (stats.byType[activity.type]) {
        stats.byType[activity.type]++
      } else {
        stats.byType[activity.type] = 1
      }
    })

    return stats
  }
}

export default ActivityService