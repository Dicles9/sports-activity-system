import { useState, useEffect } from 'react'
import { 
  Card, 
  List, 
  Avatar, 
  Button, 
  Input, 
  message, 
  Space, 
  Typography,
  Divider,
  Popconfirm,
  Badge
} from 'antd'
import { 
  UserOutlined, 
  LikeOutlined, 
  LikeFilled,
  MessageOutlined,
  DeleteOutlined,
  SendOutlined
} from '@ant-design/icons'
import CommentService from '../services/commentService'
import AuthService from '../services/authService'

const { TextArea } = Input
const { Text, Paragraph } = Typography

const ActivityComments = ({ activityId }) => {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState(null)
  const [replyContent, setReplyContent] = useState('')
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    loadComments()
    loadCurrentUser()
  }, [activityId])

  const loadCurrentUser = () => {
    const authResult = AuthService.getCurrentUser()
    if (authResult.success) {
      setCurrentUser(authResult.user)
    }
  }

  const loadComments = () => {
    setLoading(true)
    try {
      const commentList = CommentService.getCommentsByActivity(activityId)
      setComments(commentList)
    } catch (error) {
      message.error('加载评论失败')
    } finally {
      setLoading(false)
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      message.warning('请输入评论内容')
      return
    }

    setSubmitting(true)
    try {
      const result = CommentService.addComment(activityId, newComment)
      if (result.success) {
        message.success(result.message)
        setNewComment('')
        loadComments()
      } else {
        message.error(result.message)
      }
    } catch (error) {
      message.error('发表评论失败')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteComment = async (commentId) => {
    try {
      const result = CommentService.deleteComment(activityId, commentId)
      if (result.success) {
        message.success(result.message)
        loadComments()
      } else {
        message.error(result.message)
      }
    } catch (error) {
      message.error('删除评论失败')
    }
  }

  const handleLikeComment = async (commentId) => {
    try {
      const result = CommentService.likeComment(activityId, commentId)
      if (result.success) {
        loadComments()
      } else {
        message.error(result.message)
      }
    } catch (error) {
      message.error('操作失败')
    }
  }

  const handleAddReply = async (commentId) => {
    if (!replyContent.trim()) {
      message.warning('请输入回复内容')
      return
    }

    try {
      const result = CommentService.addReply(activityId, commentId, replyContent)
      if (result.success) {
        message.success(result.message)
        setReplyContent('')
        setReplyingTo(null)
        loadComments()
      } else {
        message.error(result.message)
      }
    } catch (error) {
      message.error('回复失败')
    }
  }

  const isUserLiked = (comment) => {
    return currentUser && comment.likes.includes(currentUser.id)
  }

  const renderCommentActions = (comment) => {
    const liked = isUserLiked(comment)
    
    return [
      <Button
        key="like"
        type="text"
        size="small"
        icon={liked ? <LikeFilled style={{ color: '#1890ff' }} /> : <LikeOutlined />}
        onClick={() => handleLikeComment(comment.id)}
      >
        {comment.likes.length > 0 ? comment.likes.length : ''}
      </Button>,
      <Button
        key="reply"
        type="text"
        size="small"
        icon={<MessageOutlined />}
        onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
      >
        回复
      </Button>,
      currentUser && comment.authorId === currentUser.id && (
        <Popconfirm
          key="delete"
          title="确定要删除这条评论吗？"
          onConfirm={() => handleDeleteComment(comment.id)}
          okText="确定"
          cancelText="取消"
        >
          <Button
            type="text"
            size="small"
            danger
            icon={<DeleteOutlined />}
          >
            删除
          </Button>
        </Popconfirm>
      )
    ].filter(Boolean)
  }

  const renderReplies = (replies) => {
    if (!replies || replies.length === 0) return null

    return (
      <div style={{ marginLeft: '48px', marginTop: '12px' }}>
        {replies.map((reply, index) => (
          <div key={reply.id} style={{ marginBottom: '8px' }}>
            <Space size="small">
              <Avatar size="small" icon={<UserOutlined />} />
              <Text strong>{AuthService.getUserById(reply.authorId)?.username || '未知'}</Text>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {reply.createTime}
              </Text>
            </Space>
            <div style={{ marginLeft: '28px', marginTop: '4px' }}>
              <Text>{reply.content}</Text>
            </div>
            {index < replies.length - 1 && <Divider style={{ margin: '8px 0' }} />}
          </div>
        ))}
      </div>
    )
  }

  return (
    <Card title={
      <Space>
        <MessageOutlined />
        <span>活动评论</span>
        <Badge count={comments.length} showZero />
      </Space>
    }>
      {/* 发表评论 */}
      {currentUser && (
        <div style={{ marginBottom: '24px' }}>
          <TextArea
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="写下你的评论..."
            maxLength={500}
            showCount
          />
          <div style={{ marginTop: '8px', textAlign: 'right' }}>
            <Button
              type="primary"
              icon={<SendOutlined />}
              loading={submitting}
              onClick={handleAddComment}
              disabled={!newComment.trim()}
            >
              发表评论
            </Button>
          </div>
        </div>
      )}

      {/* 评论列表 */}
      <List
        itemLayout="vertical"
        loading={loading}
        dataSource={comments}
        locale={{ emptyText: '暂无评论，快来发表第一条评论吧！' }}
        renderItem={(comment) => (
          <List.Item
            key={comment.id}
            actions={renderCommentActions(comment)}
          >
            <List.Item.Meta
              avatar={<Avatar icon={<UserOutlined />} />}
              title={
                <Space>
                  <Text strong>{comment.author?.username || '未知用户'}</Text>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {comment.createTime}
                  </Text>
                </Space>
              }
              description={
                <Paragraph style={{ marginBottom: 0 }}>
                  {comment.content}
                </Paragraph>
              }
            />

            {/* 回复框 */}
            {replyingTo === comment.id && currentUser && (
              <div style={{ marginTop: '12px', marginLeft: '48px' }}>
                <TextArea
                  rows={2}
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder={`回复 ${comment.author?.username || '用户'}`}
                  maxLength={300}
                  showCount
                />
                <div style={{ marginTop: '8px', textAlign: 'right' }}>
                  <Space>
                    <Button
                      size="small"
                      onClick={() => {
                        setReplyingTo(null)
                        setReplyContent('')
                      }}
                    >
                      取消
                    </Button>
                    <Button
                      type="primary"
                      size="small"
                      onClick={() => handleAddReply(comment.id)}
                      disabled={!replyContent.trim()}
                    >
                      回复
                    </Button>
                  </Space>
                </div>
              </div>
            )}

            {/* 回复列表 */}
            {renderReplies(comment.replies)}
          </List.Item>
        )}
      />

      {!currentUser && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Text type="secondary">请登录后参与评论讨论</Text>
        </div>
      )}
    </Card>
  )
}

export default ActivityComments