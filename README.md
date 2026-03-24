# Bookkeeping App

一个可注册、可登录、带前后端和数据库的在线记账系统。

- GitHub：<https://github.com/zzzzz9999/bookkeeping-app>
- 在线地址：<https://bookkeeping-app-v2.vercel.app>

## 当前版本功能

- 用户注册
- 用户登录 / 退出登录
- 每个用户拥有自己的独立账本
- 新增收入 / 支出流水
- 删除流水
- 自动初始化默认分类
- 本月收入、支出、结余统计
- 支出分类图表
- 最近 6 个月收支趋势图

## 注册与登录规则

当前版本使用：

- **账号 + 密码** 登录
- **账号至少 6 位**
- **密码至少 6 位**
- 账号内容可以自行填写，不要求邮箱格式

## 线上使用方式

1. 打开：<https://bookkeeping-app-v2.vercel.app>
2. 进入注册页
3. 填写账号和密码
   - 账号至少 6 位
   - 密码至少 6 位
4. 注册成功后自动进入你的账本首页
5. 后续可直接用同一账号密码登录

## 本地运行方式

### 1）克隆项目

```bash
git clone https://github.com/zzzzz9999/bookkeeping-app.git
cd bookkeeping-app
```

### 2）安装依赖

```bash
npm install
```

### 3）配置环境变量

在项目根目录创建 `.env.local`：

```env
POSTGRES_PRISMA_URL="your_postgres_prisma_url"
DATABASE_URL="your_postgres_url"
AUTH_SECRET="change-this-to-a-long-random-string"
```

说明：
- `POSTGRES_PRISMA_URL`：Prisma 使用的数据库连接串
- `DATABASE_URL`：数据库连接串
- `AUTH_SECRET`：登录态签名密钥，建议自行换成更长的随机字符串

如果你使用 Neon/Postgres，把控制台给你的连接串填进去即可。

### 4）同步数据库结构

```bash
npx prisma generate
npx prisma db push
```

### 5）启动项目

```bash
npm run dev
```

然后打开：

```bash
http://localhost:3000
```

## 常用命令

```bash
npm run dev         # 本地开发
npm run build       # 生产构建（会先 prisma generate + db push）
npm run start       # 生产启动
npm run lint        # 代码检查
npm run db:generate # 生成 Prisma Client
npm run db:migrate  # 执行迁移
npm run db:studio   # 打开 Prisma Studio
```

## API

### 认证

- `POST /api/auth/register`：注册
- `POST /api/auth/login`：登录
- `POST /api/auth/logout`：退出登录

#### 注册请求示例

```json
{
  "username": "myuser01",
  "password": "123456"
}
```

#### 登录请求示例

```json
{
  "username": "myuser01",
  "password": "123456"
}
```

### 分类

- `GET /api/categories`：获取当前用户分类
- `POST /api/categories`：新增分类

### 流水

- `GET /api/transactions`：获取当前用户流水
- `POST /api/transactions`：新增流水
- `DELETE /api/transactions/:id`：删除指定流水

#### 新增流水请求示例

```json
{
  "title": "午饭",
  "amount": 38,
  "type": "EXPENSE",
  "note": "工作日午餐",
  "occurredAt": "2026-03-24",
  "categoryId": "your-category-id"
}
```

## 部署说明

当前线上版本部署在：
- Vercel
- Neon Postgres

如果你要自己重新部署：

1. 导入 GitHub 仓库到 Vercel
2. 使用 Node 22.x
3. 绑定一个 Postgres 数据库（推荐 Neon）
4. 配置环境变量：
   - `POSTGRES_PRISMA_URL`
   - `DATABASE_URL`
   - `AUTH_SECRET`
5. 重新部署

## 后续可继续扩展

- 编辑流水
- 搜索 / 筛选
- 月度预算
- 导出 CSV
- 多账本 / 多成员
