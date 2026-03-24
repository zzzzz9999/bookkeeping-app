# Bookkeeping App (Vibe Coding MVP)

全栈记账系统，包含前端、后端 API、数据库逻辑。

## 技术栈

- Next.js 16 (App Router)
- TypeScript + Tailwind CSS
- Prisma + Neon Postgres
- Recharts（图表）

## 功能

- 新增收入/支出流水
- 分类管理（默认内置分类）
- 最近流水列表 + 删除
- 本月收支汇总
- 支出分类饼图
- 近 6 个月收支趋势图

## 本地运行

```bash
npm install
npm run db:migrate
npm run dev
```

打开：`http://localhost:3000`

## 数据库

- SQLite 文件：`dev.db`
- Prisma Schema：`prisma/schema.prisma`

常用命令：

```bash
npm run db:generate
npm run db:migrate
npm run db:studio
```

## API

### 分类
- `GET /api/categories` 获取分类
- `POST /api/categories` 新增分类

### 流水
- `GET /api/transactions` 获取流水
- `POST /api/transactions` 新增流水
- `DELETE /api/transactions/:id` 删除流水

## 发布到 GitHub

```bash
git init
git add .
git commit -m "feat: full-stack bookkeeping app"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

> 如果你要，我可以继续帮你直接执行推送步骤。
