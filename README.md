# 体育活动室管理系统

[![CI/CD](https://github.com/your-username/sports-activity-system/workflows/CI/CD%20Pipeline/badge.svg)](https://github.com/your-username/sports-activity-system/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

一个基于 React 的现代化体育活动室管理系统，支持活动发布、报名管理、用户中心等功能。

## 🎯 项目特性

### 核心功能
- 🔐 **用户认证** - 注册、登录、密码管理
- 🏃 **活动管理** - 创建、编辑、删除活动
- 📝 **活动报名** - 在线报名、取消报名
- 💬 **活动评论** - 评论、回复、点赞互动
- 📋 **订单管理** - 活动订单创建与跟踪
- 👤 **用户中心** - 个人信息、活动统计
- 📊 **数据统计** - 活动类型统计、参与分析

### 技术特性
- ⚡ **现代化技术栈** - React 18 + Vite + Ant Design
- 📱 **响应式设计** - 完美适配桌面端、平板、手机
- 🎨 **精美界面** - 基于 Ant Design 的现代化 UI
- 🔍 **智能搜索** - 活动搜索与筛选
- 🛡️ **错误处理** - 全局错误边界与用户友好提示
- 🔄 **持续集成** - GitHub Actions 自动化部署

## 🚀 快速开始

### 环境要求
- Node.js >= 18.0.0
- npm >= 8.0.0

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/your-username/sports-activity-system.git
cd sports-activity-system
```

2. **安装依赖**
```bash
npm install
```

3. **启动开发服务器**
```bash
npm run dev
```

4. **访问应用**
   - 打开浏览器访问 `http://localhost:5173`
   - 在开发环境中，点击右下角"初始化演示数据"获取测试数据

### 构建生产版本
```bash
npm run build
```

## 📚 使用指南

### 演示账户
系统提供以下演示账户用于测试：

| 用户名 | 密码 | 角色 |
|--------|------|------|
| admin | admin123 | 管理员 |
| 张三 | 123456 | 普通用户 |
| 李四 | 123456 | 普通用户 |
| 王五 | 123456 | 普通用户 |

### 主要功能模块

#### 1. 用户认证
- **注册**: 用户名、邮箱、密码注册
- **登录**: 支持用户名或邮箱登录
- **密码管理**: 修改密码功能

#### 2. 活动管理
- **创建活动**: 填写活动信息、设置报名上限
- **活动类型**: 篮球、足球、羽毛球、瑜伽、游泳、网球等
- **活动状态**: 未开始、进行中、已结束
- **报名管理**: 查看报名人员、管理报名状态

#### 3. 活动报名
- **在线报名**: 一键报名感兴趣的活动
- **取消报名**: 活动开始前可取消报名
- **报名限制**: 防止重复报名、人数限制

#### 4. 互动功能
- **活动评论**: 发表评论、回复他人
- **点赞功能**: 为评论点赞
- **活动讨论**: 参与者间的交流互动

#### 5. 订单系统
- **订单创建**: 报名时自动生成订单
- **订单状态**: 待确认、已确认、已取消、已完成
- **订单管理**: 查看、修改、取消订单

## 🏗️ 项目架构

### 技术架构

#### 前端技术栈
- **框架**: React 18
- **构建工具**: Vite
- **UI库**: Ant Design
- **路由**: React Router DOM
- **状态管理**: React Hooks + Context API
- **样式**: CSS + Ant Design 主题
- **日期处理**: Day.js
- **工具库**: UUID

#### 数据存储
- **本地存储**: localStorage (可扩展为后端API)
- **数据格式**: JSON
- **数据持久化**: 浏览器本地存储

#### 部署与CI/CD
- **CI/CD**: GitHub Actions
- **部署平台**: GitHub Pages (可配置其他平台)
- **自动化**: 代码检查、测试、构建、部署

## 🧪 测试

### 运行测试
```bash
npm test
```

### 构建测试
```bash
npm run build
```

## 📈 性能优化

### 已实现的优化
- ✅ 组件懒加载
- ✅ 图片优化
- ✅ 代码分割
- ✅ 缓存策略
- ✅ 响应式设计

## 🔒 安全特性

- **密码加密**: 本地密码散列存储
- **XSS防护**: 输入内容过滤
- **数据验证**: 前端表单验证
- **权限控制**: 基于角色的访问控制

## 🌐 浏览器支持

| 浏览器 | 支持版本 |
|--------|----------|
| Chrome | >= 88 |
| Firefox | >= 85 |
| Safari | >= 14 |
| Edge | >= 88 |

## 📄 许可证

本项目基于 [MIT](https://opensource.org/licenses/MIT) 许可证开源。

## 🙏 致谢

- [React](https://reactjs.org/) - 用户界面库
- [Ant Design](https://ant.design/) - React UI 组件库
- [Vite](https://vitejs.dev/) - 现代化构建工具
- [Day.js](https://dayjs.gitee.io/) - 轻量级日期库

---

⭐ 如果这个项目对你有帮助，请给个 Star 支持一下！
