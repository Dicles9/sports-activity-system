import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'
import StorageService from './storage'
import AuthService from './authService'

const COMMENTS_STORAGE_KEY = 'sports_activity_comments'

class CommentService {
  static getCommentsByActivity(activityId) {
    const comments = StorageService.getItem(COMMENTS_STORAGE_KEY) || {}
    const activityComments = comments[activityId] || []
    
    return activityComments.map(comment => ({
      ...comment,
      author: AuthService.getUserById(comment.authorId)
    })).sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
  }

  static addComment(activityId, content) {
    const currentUser = AuthService.getCurrentUser()
    if (!currentUser.success) {
      return { success: false, message: '请先登录' }
    }

    if (!content || content.trim().length === 0) {
      return { success: false, message: '评论内容不能为空' }
    }

    if (content.trim().length > 500) {
      return { success: false, message: '评论内容不能超过500字符' }
    }

    const comments = StorageService.getItem(COMMENTS_STORAGE_KEY) || {}
    if (!comments[activityId]) {
      comments[activityId] = []
    }

    const newComment = {
      id: uuidv4(),
      activityId,
      authorId: currentUser.user.id,
      content: content.trim(),
      createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      likes: [],
      replies: []
    }

    comments[activityId].push(newComment)
    StorageService.setItem(COMMENTS_STORAGE_KEY, comments)

    return { 
      success: true, 
      message: '评论发表成功', 
      comment: {
        ...newComment,
        author: currentUser.user
      }
    }
  }

  static deleteComment(activityId, commentId) {
    const currentUser = AuthService.getCurrentUser()
    if (!currentUser.success) {
      return { success: false, message: '请先登录' }
    }

    const comments = StorageService.getItem(COMMENTS_STORAGE_KEY) || {}
    const activityComments = comments[activityId] || []
    
    const commentIndex = activityComments.findIndex(c => c.id === commentId)
    if (commentIndex === -1) {
      return { success: false, message: '评论不存在' }
    }

    const comment = activityComments[commentIndex]
    if (comment.authorId !== currentUser.user.id) {
      return { success: false, message: '只能删除自己的评论' }
    }

    activityComments.splice(commentIndex, 1)
    StorageService.setItem(COMMENTS_STORAGE_KEY, comments)

    return { success: true, message: '评论删除成功' }
  }

  static likeComment(activityId, commentId) {
    const currentUser = AuthService.getCurrentUser()
    if (!currentUser.success) {
      return { success: false, message: '请先登录' }
    }

    const comments = StorageService.getItem(COMMENTS_STORAGE_KEY) || {}
    const activityComments = comments[activityId] || []
    
    const commentIndex = activityComments.findIndex(c => c.id === commentId)
    if (commentIndex === -1) {
      return { success: false, message: '评论不存在' }
    }

    const comment = activityComments[commentIndex]
    const userId = currentUser.user.id
    const likeIndex = comment.likes.indexOf(userId)

    if (likeIndex > -1) {
      // 取消点赞
      comment.likes.splice(likeIndex, 1)
      StorageService.setItem(COMMENTS_STORAGE_KEY, comments)
      return { success: true, message: '取消点赞', liked: false, likesCount: comment.likes.length }
    } else {
      // 点赞
      comment.likes.push(userId)
      StorageService.setItem(COMMENTS_STORAGE_KEY, comments)
      return { success: true, message: '点赞成功', liked: true, likesCount: comment.likes.length }
    }
  }

  static addReply(activityId, commentId, content) {
    const currentUser = AuthService.getCurrentUser()
    if (!currentUser.success) {
      return { success: false, message: '请先登录' }
    }

    if (!content || content.trim().length === 0) {
      return { success: false, message: '回复内容不能为空' }
    }

    if (content.trim().length > 300) {
      return { success: false, message: '回复内容不能超过300字符' }
    }

    const comments = StorageService.getItem(COMMENTS_STORAGE_KEY) || {}
    const activityComments = comments[activityId] || []
    
    const commentIndex = activityComments.findIndex(c => c.id === commentId)
    if (commentIndex === -1) {
      return { success: false, message: '评论不存在' }
    }

    const comment = activityComments[commentIndex]
    const newReply = {
      id: uuidv4(),
      authorId: currentUser.user.id,
      content: content.trim(),
      createTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
    }

    comment.replies.push(newReply)
    StorageService.setItem(COMMENTS_STORAGE_KEY, comments)

    return { 
      success: true, 
      message: '回复成功',
      reply: {
        ...newReply,
        author: currentUser.user
      }
    }
  }

  static getCommentStats(activityId) {
    const comments = StorageService.getItem(COMMENTS_STORAGE_KEY) || {}
    const activityComments = comments[activityId] || []
    
    const totalComments = activityComments.length
    const totalReplies = activityComments.reduce((sum, comment) => sum + comment.replies.length, 0)
    const totalLikes = activityComments.reduce((sum, comment) => sum + comment.likes.length, 0)

    return {
      totalComments,
      totalReplies,
      totalLikes,
      totalInteractions: totalComments + totalReplies + totalLikes
    }
  }

  static isUserLikedComment(activityId, commentId, userId) {
    const comments = StorageService.getItem(COMMENTS_STORAGE_KEY) || {}
    const activityComments = comments[activityId] || []
    
    const comment = activityComments.find(c => c.id === commentId)
    return comment ? comment.likes.includes(userId) : false
  }
}

export default CommentService