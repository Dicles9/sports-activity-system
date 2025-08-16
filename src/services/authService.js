import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'
import StorageService from './storage'

class AuthService {
  static register(userData) {
    const { username, password, email, phone } = userData
    
    if (!username || !password || !email) {
      return { success: false, message: '请填写完整信息' }
    }

    const users = StorageService.getUsers()
    
    const existingUser = users.find(user => 
      user.username === username || user.email === email
    )
    
    if (existingUser) {
      return { success: false, message: '用户名或邮箱已存在' }
    }

    const newUser = {
      id: uuidv4(),
      username,
      password: this.hashPassword(password),
      email,
      phone: phone || '',
      registerTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
    }

    users.push(newUser)
    StorageService.saveUsers(users)

    return { success: true, message: '注册成功', user: this.sanitizeUser(newUser) }
  }

  static login(username, password) {
    if (!username || !password) {
      return { success: false, message: '请输入用户名和密码' }
    }

    const users = StorageService.getUsers()
    const user = users.find(u => 
      (u.username === username || u.email === username) && 
      u.password === this.hashPassword(password)
    )

    if (!user) {
      return { success: false, message: '用户名或密码错误' }
    }

    const sanitizedUser = this.sanitizeUser(user)
    StorageService.saveCurrentUser(sanitizedUser)

    return { success: true, message: '登录成功', user: sanitizedUser }
  }

  static logout() {
    StorageService.clearCurrentUser()
    return { success: true, message: '已退出登录' }
  }

  static getCurrentUser() {
    const user = StorageService.getCurrentUser()
    return user ? { success: true, user } : { success: false, user: null }
  }

  static isAuthenticated() {
    const currentUser = StorageService.getCurrentUser()
    return !!currentUser
  }

  static updatePassword(oldPassword, newPassword) {
    const currentUser = StorageService.getCurrentUser()
    if (!currentUser) {
      return { success: false, message: '请先登录' }
    }

    const users = StorageService.getUsers()
    const userIndex = users.findIndex(u => u.id === currentUser.id)
    
    if (userIndex === -1) {
      return { success: false, message: '用户不存在' }
    }

    if (users[userIndex].password !== this.hashPassword(oldPassword)) {
      return { success: false, message: '原密码错误' }
    }

    users[userIndex].password = this.hashPassword(newPassword)
    StorageService.saveUsers(users)

    return { success: true, message: '密码修改成功' }
  }

  static hashPassword(password) {
    return btoa(password + 'sports_activity_salt')
  }

  static sanitizeUser(user) {
    const { password, ...sanitizedUser } = user
    return sanitizedUser
  }

  static getUserById(userId) {
    const users = StorageService.getUsers()
    const user = users.find(u => u.id === userId)
    return user ? this.sanitizeUser(user) : null
  }

  static getAllUsers() {
    const users = StorageService.getUsers()
    return users.map(user => this.sanitizeUser(user))
  }
}

export default AuthService