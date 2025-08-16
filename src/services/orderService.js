import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'
import StorageService from './storage'
import AuthService from './authService'
import ActivityService from './activityService'

const ORDERS_STORAGE_KEY = 'sports_activity_orders'

export const ORDER_STATUS = {
  PENDING: 'pending',     // 待确认
  CONFIRMED: 'confirmed', // 已确认
  CANCELLED: 'cancelled', // 已取消
  COMPLETED: 'completed'  // 已完成
}

export const ORDER_STATUS_TEXT = {
  [ORDER_STATUS.PENDING]: '待确认',
  [ORDER_STATUS.CONFIRMED]: '已确认',
  [ORDER_STATUS.CANCELLED]: '已取消',
  [ORDER_STATUS.COMPLETED]: '已完成'
}

class OrderService {
  static createOrder(activityId, orderData = {}) {
    const currentUser = AuthService.getCurrentUser()
    if (!currentUser.success) {
      return { success: false, message: '请先登录' }
    }

    // 获取活动信息
    const activityResult = ActivityService.getActivityById(activityId)
    if (!activityResult.success) {
      return { success: false, message: '活动不存在' }
    }

    const activity = activityResult.activity

    // 检查活动状态
    if (activity.status !== 'upcoming') {
      return { success: false, message: '该活动已开始或结束，无法创建订单' }
    }

    // 检查是否已有订单
    const existingOrders = this.getUserOrders(currentUser.user.id)
    const existingOrder = existingOrders.find(order => 
      order.activityId === activityId && 
      order.status !== ORDER_STATUS.CANCELLED
    )

    if (existingOrder) {
      return { success: false, message: '您已经有该活动的订单了' }
    }

    const orders = StorageService.getItem(ORDERS_STORAGE_KEY) || []
    
    const newOrder = {
      id: uuidv4(),
      orderNumber: this.generateOrderNumber(),
      activityId,
      userId: currentUser.user.id,
      status: ORDER_STATUS.PENDING,
      orderData: {
        activityTitle: activity.title,
        activityDate: activity.date,
        activityTime: activity.time,
        activityLocation: activity.location,
        participantName: orderData.participantName || currentUser.user.username,
        participantPhone: orderData.participantPhone || currentUser.user.phone || '',
        specialRequirements: orderData.specialRequirements || '',
        emergencyContact: orderData.emergencyContact || ''
      },
      createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
    }

    orders.push(newOrder)
    StorageService.setItem(ORDERS_STORAGE_KEY, orders)

    return { 
      success: true, 
      message: '订单创建成功，请等待确认',
      order: newOrder 
    }
  }

  static getOrderById(orderId) {
    const orders = StorageService.getItem(ORDERS_STORAGE_KEY) || []
    const order = orders.find(o => o.id === orderId)
    
    if (!order) {
      return { success: false, message: '订单不存在' }
    }

    return {
      success: true,
      order: {
        ...order,
        user: AuthService.getUserById(order.userId),
        activity: ActivityService.getActivityById(order.activityId).activity
      }
    }
  }

  static getUserOrders(userId) {
    const orders = StorageService.getItem(ORDERS_STORAGE_KEY) || []
    return orders
      .filter(order => order.userId === userId)
      .map(order => ({
        ...order,
        activity: ActivityService.getActivityById(order.activityId).activity
      }))
      .sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
  }

  static getActivityOrders(activityId) {
    const orders = StorageService.getItem(ORDERS_STORAGE_KEY) || []
    return orders
      .filter(order => order.activityId === activityId)
      .map(order => ({
        ...order,
        user: AuthService.getUserById(order.userId)
      }))
      .sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
  }

  static updateOrderStatus(orderId, newStatus, reason = '') {
    const currentUser = AuthService.getCurrentUser()
    if (!currentUser.success) {
      return { success: false, message: '请先登录' }
    }

    const orders = StorageService.getItem(ORDERS_STORAGE_KEY) || []
    const orderIndex = orders.findIndex(o => o.id === orderId)
    
    if (orderIndex === -1) {
      return { success: false, message: '订单不存在' }
    }

    const order = orders[orderIndex]
    
    // 检查权限 - 只有订单创建者或活动创建者可以修改
    const activityResult = ActivityService.getActivityById(order.activityId)
    const canUpdate = order.userId === currentUser.user.id || 
                     (activityResult.success && activityResult.activity.creatorId === currentUser.user.id)
    
    if (!canUpdate) {
      return { success: false, message: '无权限修改此订单' }
    }

    // 更新订单状态
    orders[orderIndex] = {
      ...order,
      status: newStatus,
      updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      statusReason: reason
    }

    StorageService.setItem(ORDERS_STORAGE_KEY, orders)

    return { 
      success: true, 
      message: `订单状态已更新为${ORDER_STATUS_TEXT[newStatus]}`,
      order: orders[orderIndex]
    }
  }

  static cancelOrder(orderId, reason = '') {
    return this.updateOrderStatus(orderId, ORDER_STATUS.CANCELLED, reason)
  }

  static confirmOrder(orderId) {
    const result = this.updateOrderStatus(orderId, ORDER_STATUS.CONFIRMED)
    
    if (result.success) {
      // 确认订单时，自动为用户报名活动
      const order = this.getOrderById(orderId)
      if (order.success) {
        ActivityService.joinActivity(order.order.activityId)
      }
    }
    
    return result
  }

  static completeOrder(orderId) {
    return this.updateOrderStatus(orderId, ORDER_STATUS.COMPLETED)
  }

  static updateOrderData(orderId, newData) {
    const currentUser = AuthService.getCurrentUser()
    if (!currentUser.success) {
      return { success: false, message: '请先登录' }
    }

    const orders = StorageService.getItem(ORDERS_STORAGE_KEY) || []
    const orderIndex = orders.findIndex(o => o.id === orderId)
    
    if (orderIndex === -1) {
      return { success: false, message: '订单不存在' }
    }

    const order = orders[orderIndex]
    
    // 只有订单创建者可以修改订单信息
    if (order.userId !== currentUser.user.id) {
      return { success: false, message: '只能修改自己的订单' }
    }

    // 只有待确认状态的订单可以修改
    if (order.status !== ORDER_STATUS.PENDING) {
      return { success: false, message: '只有待确认状态的订单可以修改' }
    }

    orders[orderIndex] = {
      ...order,
      orderData: { ...order.orderData, ...newData },
      updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
    }

    StorageService.setItem(ORDERS_STORAGE_KEY, orders)

    return { 
      success: true, 
      message: '订单信息更新成功',
      order: orders[orderIndex]
    }
  }

  static generateOrderNumber() {
    const date = dayjs().format('YYYYMMDD')
    const random = Math.random().toString(36).substr(2, 6).toUpperCase()
    return `SA${date}${random}`
  }

  static getOrderStats() {
    const orders = StorageService.getItem(ORDERS_STORAGE_KEY) || []
    
    const stats = {
      total: orders.length,
      byStatus: {
        [ORDER_STATUS.PENDING]: 0,
        [ORDER_STATUS.CONFIRMED]: 0,
        [ORDER_STATUS.CANCELLED]: 0,
        [ORDER_STATUS.COMPLETED]: 0
      },
      recentOrders: orders
        .sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
        .slice(0, 10)
    }

    orders.forEach(order => {
      stats.byStatus[order.status]++
    })

    return stats
  }

  static searchOrders(keyword, filters = {}) {
    const orders = StorageService.getItem(ORDERS_STORAGE_KEY) || []
    
    let filteredOrders = orders.map(order => ({
      ...order,
      user: AuthService.getUserById(order.userId),
      activity: ActivityService.getActivityById(order.activityId).activity
    }))

    // 关键词搜索
    if (keyword && keyword.trim()) {
      const searchTerm = keyword.toLowerCase()
      filteredOrders = filteredOrders.filter(order =>
        order.orderNumber.toLowerCase().includes(searchTerm) ||
        order.orderData.activityTitle.toLowerCase().includes(searchTerm) ||
        order.orderData.participantName.toLowerCase().includes(searchTerm) ||
        order.user?.username.toLowerCase().includes(searchTerm)
      )
    }

    // 状态筛选
    if (filters.status) {
      filteredOrders = filteredOrders.filter(order => order.status === filters.status)
    }

    // 用户筛选
    if (filters.userId) {
      filteredOrders = filteredOrders.filter(order => order.userId === filters.userId)
    }

    // 活动筛选
    if (filters.activityId) {
      filteredOrders = filteredOrders.filter(order => order.activityId === filters.activityId)
    }

    return filteredOrders.sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
  }
}

export default OrderService