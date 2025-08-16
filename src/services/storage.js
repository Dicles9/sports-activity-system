const STORAGE_KEYS = {
  USERS: 'sports_activity_users',
  ACTIVITIES: 'sports_activity_activities',
  CURRENT_USER: 'sports_activity_current_user'
}

class StorageService {
  static getItem(key) {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error('获取本地存储数据失败:', error)
      return null
    }
  }

  static setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error('保存本地存储数据失败:', error)
      return false
    }
  }

  static removeItem(key) {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error('删除本地存储数据失败:', error)
      return false
    }
  }

  static clear() {
    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.error('清空本地存储失败:', error)
      return false
    }
  }

  static getUsers() {
    return this.getItem(STORAGE_KEYS.USERS) || []
  }

  static saveUsers(users) {
    return this.setItem(STORAGE_KEYS.USERS, users)
  }

  static getActivities() {
    return this.getItem(STORAGE_KEYS.ACTIVITIES) || []
  }

  static saveActivities(activities) {
    return this.setItem(STORAGE_KEYS.ACTIVITIES, activities)
  }

  static getCurrentUser() {
    return this.getItem(STORAGE_KEYS.CURRENT_USER)
  }

  static saveCurrentUser(user) {
    return this.setItem(STORAGE_KEYS.CURRENT_USER, user)
  }

  static clearCurrentUser() {
    return this.removeItem(STORAGE_KEYS.CURRENT_USER)
  }
}

export default StorageService
export { STORAGE_KEYS }