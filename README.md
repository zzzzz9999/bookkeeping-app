# Bookkeeping App

一个带前端、后端 API、数据库逻辑的全栈记账系统。

- 仓库地址：<https://github.com/zzzzz9999/bookkeeping-app>
- 最新线上地址：<https://bookkeeping-app-v2.vercel.app>

## 技术栈

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Prisma ORM
- Neon Postgres
- Recharts

## 当前功能

- 新增收入 / 支出流水
- 默认分类初始化
- 最近流水列表
- 删除流水
- 本月收入、支出、结余统计
- 支出分类饼图
- 最近 6 个月收支趋势图

## 项目结构

```bash
src/
  app/
    api/
      categories/
      transactions/
  components/
    bookkeeping-dashboard.tsx
  lib/
    prisma.ts
    dashboard.ts
    seed.ts
prisma/
  schema.prisma
```

## 使用方法

### 1. 克隆项目

```bash
git clone https://github.com/zzzzz9999/bookkeeping-app.git
cd bookkeeping-app
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

本项目默认使用 Prisma + Postgres。

新建 `.env.local`，至少填写：

```env
POSTGRES_PRISMA_URL="your_postgres_prisma_url"
DATABASE_URL="your_postgres_url"
```

如果你使用的是 Neon，通常可以直接把控制台提供的连接串填进去。

### 4. 同步数据库结构

```bash
npx prisma generate
npx prisma db push
```

如果你想用 migration 流程，也可以：

```bash
npm run db:migrate
```

### 5. 本地启动

```bash
npm run dev
```

打开：<http://localhost:3000>

## 常用命令

```bash
npm run dev         # 本地开发
npm run build       # 生产构建（会先 prisma generate + db push）
npm run start       # 启动生产服务
npm run lint        # 代码检查
npm run db:generate # 生成 Prisma Client
npm run db:migrate  # 执行迁移
npm run db:studio   # 打开 Prisma Studio
```

## API 说明

### 分类

- `GET /api/categories`：获取分类列表
- `POST /api/categories`：新增分类

请求体示例：

```json
{
  "name": "学习",
  "color": "#6366f1",
  "icon": "📚"
}
```

### 流水

- `GET /api/transactions`：获取流水列表
- `POST /api/transactions`：新增流水
- `DELETE /api/transactions/:id`：删除指定流水

新增流水请求体示例：

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

当前项目已经接入 **Vercel + Neon Postgres**，当前可用线上版本：

- <https://bookkeeping-app-v2.vercel.app>

如果你要自己重新部署：

1. 导入 GitHub 仓库到 Vercel
2. 新建一个干净的 Vercel Project（建议 Node 版本使用 **22.x**）
3. 绑定一个 Postgres 数据库（如 Neon）
4. 配置环境变量：
   - `POSTGRES_PRISMA_URL`
   - `DATABASE_URL`
5. 重新部署

## 备注

这个项目目前是一个实用型 MVP，适合继续往下面扩：

- 编辑流水
- 搜索 / 筛选
- 月度预算
- 多用户登录
- 数据导出
