# 科妍客户管理系统

基于Excel数据开发的客户管理系统，用于管理客户档案和充值记录。

## 功能特性

- **客户档案管理**：查看、搜索、编辑、添加、删除客户信息
- **充值记录管理**：查看充值历史、按类型筛选、添加删除充值记录
- **数据统计**：展示总客户数、充值次数、充值类型分布等关键指标
- **数据导入导出**：支持从Excel导入数据和导出数据到Excel
- **响应式界面**：基于Ant Design的现代化Web界面

## 技术栈

- **前端框架**: Next.js 15
- **UI组件**: Ant Design 5
- **样式**: Tailwind CSS
- **数据处理**: xlsx (Excel读写)
- **状态管理**: React Context

## 本地运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000

## 部署到Cloudflare Pages

### 方式一：GitHub自动部署（推荐）

1. **推送代码到GitHub**
   ```bash
   git add .
   git commit -m "Deploy to Cloudflare"
   git push origin main
   ```

2. **连接Cloudflare Pages**
   - 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
   - 进入 Workers 和 Pages → Pages
   - 点击 "创建项目" → 选择 "连接到 Git"
   - 选择您的GitHub仓库 `xiong7569439/keyan`
   - 构建设置：
     - 构建命令: `npm run build`
     - 构建输出目录: `out`
   - 点击 "保存并部署"

### 方式二：命令行手动部署

1. **安装Wrangler CLI**
   ```bash
   npm install -D wrangler
   ```

2. **登录Cloudflare**
   ```bash
   npx wrangler login
   ```

3. **部署**
   ```bash
   npm run build
   npx wrangler pages deploy out
   ```

   部署完成后会显示访问地址。

## 项目结构

```
keyan/
├── src/
│   ├── app/
│   │   ├── layout.tsx      # 根布局
│   │   ├── page.tsx        # 首页（统计）
│   │   ├── customers/      # 客户档案页面
│   │   ├── recharges/     # 充值记录页面
│   │   └── import/        # 导入导出页面
│   ├── components/
│   │   └── Sidebar.tsx    # 侧边栏导航
│   └── context/
│       └── DataContext.tsx # 数据状态管理
├── package.json
├── next.config.js
└── tailwind.config.ts
```

## 注意事项

- 数据存储在浏览器localStorage中，刷新页面会保留数据
- 如需持久化存储，建议使用数据库
- Cloudflare Pages静态部署不支持服务端API，数据处理均在客户端完成
