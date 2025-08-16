import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Card, 
  Table, 
  Tag, 
  Button, 
  Space, 
  Input, 
  Select, 
  Modal,
  Form,
  message,
  Typography,
  Descriptions,
  Badge,
  Popconfirm
} from 'antd'
import { 
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  ReloadOutlined
} from '@ant-design/icons'
import OrderService, { ORDER_STATUS, ORDER_STATUS_TEXT } from '../services/orderService'
import AuthService from '../services/authService'

const { Search } = Input
const { Option } = Select
const { Title, Text } = Typography
const { TextArea } = Input

const OrderManagement = () => {
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [detailVisible, setDetailVisible] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [editVisible, setEditVisible] = useState(false)
  const [form] = Form.useForm()
  const navigate = useNavigate()

  useEffect(() => {
    loadCurrentUser()
    loadOrders()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [orders, searchKeyword, statusFilter])

  const loadCurrentUser = () => {
    const authResult = AuthService.getCurrentUser()
    if (authResult.success) {
      setCurrentUser(authResult.user)
    } else {
      navigate('/login')
    }
  }

  const loadOrders = async () => {
    setLoading(true)
    try {
      if (currentUser) {
        const userOrders = OrderService.getUserOrders(currentUser.id)
        setOrders(userOrders)
      }
    } catch (error) {
      message.error('加载订单失败')
    } finally {
      setLoading(false)
    }
  }

  const filterOrders = () => {
    let filtered = orders

    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase()
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(keyword) ||
        order.orderData.activityTitle.toLowerCase().includes(keyword) ||
        order.orderData.participantName.toLowerCase().includes(keyword)
      )
    }

    if (statusFilter) {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    setFilteredOrders(filtered)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case ORDER_STATUS.PENDING: return 'orange'
      case ORDER_STATUS.CONFIRMED: return 'blue'
      case ORDER_STATUS.COMPLETED: return 'green'
      case ORDER_STATUS.CANCELLED: return 'red'
      default: return 'default'
    }
  }

  const handleViewDetail = (order) => {
    setSelectedOrder(order)
    setDetailVisible(true)
  }

  const handleEditOrder = (order) => {
    setSelectedOrder(order)
    form.setFieldsValue(order.orderData)
    setEditVisible(true)
  }

  const handleUpdateOrder = async (values) => {
    try {
      const result = OrderService.updateOrderData(selectedOrder.id, values)
      if (result.success) {
        message.success(result.message)
        setEditVisible(false)
        loadOrders()
      } else {
        message.error(result.message)
      }
    } catch (error) {
      message.error('更新订单失败')
    }
  }

  const handleCancelOrder = async (orderId) => {
    try {
      const result = OrderService.cancelOrder(orderId, '用户主动取消')
      if (result.success) {
        message.success(result.message)
        loadOrders()
      } else {
        message.error(result.message)
      }
    } catch (error) {
      message.error('取消订单失败')
    }
  }

  const columns = [
    {
      title: '订单号',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      fixed: 'left',
      width: 140
    },
    {
      title: '活动名称',
      dataIndex: ['orderData', 'activityTitle'],
      key: 'activityTitle',
      ellipsis: true,
      render: (text, record) => (
        <Button 
          type="link" 
          onClick={() => navigate(`/activities/${record.activityId}`)}
        >
          {text}
        </Button>
      )
    },
    {
      title: '参与者',
      dataIndex: ['orderData', 'participantName'],
      key: 'participantName'
    },
    {
      title: '活动时间',
      key: 'activityTime',
      render: (_, record) => (
        <span>
          {record.orderData.activityDate} {record.orderData.activityTime}
        </span>
      )
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {ORDER_STATUS_TEXT[status]}
        </Tag>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      sorter: (a, b) => new Date(a.createTime) - new Date(b.createTime)
    },
    {
      title: '操作',
      key: 'actions',
      fixed: 'right',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            详情
          </Button>
          {record.status === ORDER_STATUS.PENDING && (
            <>
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => handleEditOrder(record)}
              >
                修改
              </Button>
              <Popconfirm
                title="确定要取消这个订单吗？"
                onConfirm={() => handleCancelOrder(record.id)}
                okText="确定"
                cancelText="取消"
              >
                <Button
                  type="text"
                  danger
                  icon={<CloseOutlined />}
                >
                  取消
                </Button>
              </Popconfirm>
            </>
          )}
        </Space>
      )
    }
  ]

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>我的订单</Title>
        
        <Card style={{ marginBottom: '16px' }}>
          <Space wrap>
            <Search
              placeholder="搜索订单号、活动名称或参与者"
              style={{ width: 300 }}
              onSearch={setSearchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <Select
              placeholder="选择订单状态"
              style={{ width: 150 }}
              allowClear
              value={statusFilter}
              onChange={setStatusFilter}
            >
              {Object.entries(ORDER_STATUS_TEXT).map(([key, label]) => (
                <Option key={key} value={key}>{label}</Option>
              ))}
            </Select>
            <Button 
              icon={<ReloadOutlined />}
              onClick={() => {
                setSearchKeyword('')
                setStatusFilter('')
                loadOrders()
              }}
            >
              重置
            </Button>
          </Space>
        </Card>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={filteredOrders}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 个订单`
          }}
        />
      </Card>

      {/* 订单详情模态框 */}
      <Modal
        title="订单详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={600}
      >
        {selectedOrder && (
          <div>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="订单号" span={2}>
                {selectedOrder.orderNumber}
              </Descriptions.Item>
              <Descriptions.Item label="订单状态">
                <Badge 
                  status={getStatusColor(selectedOrder.status)} 
                  text={ORDER_STATUS_TEXT[selectedOrder.status]} 
                />
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">
                {selectedOrder.createTime}
              </Descriptions.Item>
              <Descriptions.Item label="活动名称" span={2}>
                {selectedOrder.orderData.activityTitle}
              </Descriptions.Item>
              <Descriptions.Item label="活动时间">
                {selectedOrder.orderData.activityDate}
              </Descriptions.Item>
              <Descriptions.Item label="活动地点">
                {selectedOrder.orderData.activityLocation}
              </Descriptions.Item>
              <Descriptions.Item label="参与者姓名">
                {selectedOrder.orderData.participantName}
              </Descriptions.Item>
              <Descriptions.Item label="联系电话">
                {selectedOrder.orderData.participantPhone || '未填写'}
              </Descriptions.Item>
              <Descriptions.Item label="紧急联系人" span={2}>
                {selectedOrder.orderData.emergencyContact || '未填写'}
              </Descriptions.Item>
              <Descriptions.Item label="特殊要求" span={2}>
                {selectedOrder.orderData.specialRequirements || '无'}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>

      {/* 编辑订单模态框 */}
      <Modal
        title="编辑订单信息"
        open={editVisible}
        onCancel={() => setEditVisible(false)}
        onOk={() => form.submit()}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdateOrder}
        >
          <Form.Item
            name="participantName"
            label="参与者姓名"
            rules={[{ required: true, message: '请输入参与者姓名' }]}
          >
            <Input placeholder="请输入参与者姓名" />
          </Form.Item>

          <Form.Item
            name="participantPhone"
            label="联系电话"
            rules={[
              { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' }
            ]}
          >
            <Input placeholder="请输入联系电话" />
          </Form.Item>

          <Form.Item
            name="emergencyContact"
            label="紧急联系人"
          >
            <Input placeholder="请输入紧急联系人姓名和电话" />
          </Form.Item>

          <Form.Item
            name="specialRequirements"
            label="特殊要求"
          >
            <TextArea
              rows={3}
              placeholder="请输入特殊要求或备注"
              maxLength={200}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default OrderManagement