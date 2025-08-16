// RESTful API 客户端封装
// 当前使用 localStorage 模拟，将来可以轻松替换为真实 API

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api/v1'

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL
    this.headers = {
      'Content-Type': 'application/json'
    }
  }

  // 设置认证令牌
  setAuthToken(token) {
    if (token) {
      this.headers['Authorization'] = `Bearer ${token}`
    } else {
      delete this.headers['Authorization']
    }
  }

  // 通用请求方法
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      headers: { ...this.headers, ...options.headers },
      ...options
    }

    try {
      // 这里将来替换为真实的 fetch 请求
      // const response = await fetch(url, config)
      // return await response.json()
      
      // 当前返回模拟数据，保持接口一致性
      return this.mockRequest(endpoint, config)
    } catch (error) {
      throw new Error(`API request failed: ${error.message}`)
    }
  }

  // 模拟请求 (用于当前 localStorage 实现)
  mockRequest(endpoint, config) {
    // 这个方法将来会被移除，当前用于保持接口一致性
    return Promise.resolve({ success: true, data: null })
  }

  // GET 请求
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString()
    const url = queryString ? `${endpoint}?${queryString}` : endpoint
    
    return this.request(url, { method: 'GET' })
  }

  // POST 请求
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  // PUT 请求
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  // PATCH 请求
  async patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data)
    })
  }

  // DELETE 请求
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' })
  }
}

// RESTful API 端点定义
export const API_ENDPOINTS = {
  // 用户认证相关
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password'
  },

  // 用户管理
  USERS: {
    LIST: '/users',
    DETAIL: (id) => `/users/${id}`,
    CREATE: '/users',
    UPDATE: (id) => `/users/${id}`,
    DELETE: (id) => `/users/${id}`
  },

  // 活动管理
  ACTIVITIES: {
    LIST: '/activities',
    DETAIL: (id) => `/activities/${id}`,
    CREATE: '/activities',
    UPDATE: (id) => `/activities/${id}`,
    DELETE: (id) => `/activities/${id}`,
    SEARCH: '/activities/search',
    BY_TYPE: (type) => `/activities?type=${type}`,
    BY_STATUS: (status) => `/activities?status=${status}`,
    STATS: '/activities/stats'
  },

  // 活动报名管理
  REGISTRATIONS: {
    LIST: '/registrations',
    DETAIL: (id) => `/registrations/${id}`,
    CREATE: '/registrations',
    CANCEL: (id) => `/registrations/${id}/cancel`,
    BY_ACTIVITY: (activityId) => `/activities/${activityId}/registrations`,
    BY_USER: (userId) => `/users/${userId}/registrations`
  },

  // 活动评论
  COMMENTS: {
    LIST: (activityId) => `/activities/${activityId}/comments`,
    CREATE: (activityId) => `/activities/${activityId}/comments`,
    UPDATE: (activityId, commentId) => `/activities/${activityId}/comments/${commentId}`,
    DELETE: (activityId, commentId) => `/activities/${activityId}/comments/${commentId}`,
    LIKE: (activityId, commentId) => `/activities/${activityId}/comments/${commentId}/like`
  },

  // 活动订单管理
  ORDERS: {
    LIST: '/orders',
    DETAIL: (id) => `/orders/${id}`,
    CREATE: '/orders',
    UPDATE: (id) => `/orders/${id}`,
    CANCEL: (id) => `/orders/${id}/cancel`,
    BY_USER: (userId) => `/users/${userId}/orders`,
    BY_ACTIVITY: (activityId) => `/activities/${activityId}/orders`
  },

  // 系统统计
  STATISTICS: {
    DASHBOARD: '/statistics/dashboard',
    ACTIVITIES: '/statistics/activities',
    USERS: '/statistics/users',
    REGISTRATIONS: '/statistics/registrations'
  }
}

// 创建全局 API 客户端实例
const apiClient = new ApiClient()

export default apiClient

// 响应数据标准格式
export const API_RESPONSE_FORMAT = {
  // 成功响应
  SUCCESS: {
    success: true,
    data: {}, // 实际数据
    message: 'Operation successful',
    timestamp: new Date().toISOString()
  },

  // 错误响应
  ERROR: {
    success: false,
    error: {
      code: 'ERROR_CODE',
      message: 'Error description',
      details: {} // 错误详情
    },
    timestamp: new Date().toISOString()
  },

  // 分页响应
  PAGINATED: {
    success: true,
    data: {
      items: [], // 数据数组
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0,
        totalPages: 0
      }
    },
    message: 'Data retrieved successfully',
    timestamp: new Date().toISOString()
  }
}

// HTTP 状态码常量
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
}