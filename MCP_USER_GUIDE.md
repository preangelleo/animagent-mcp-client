# Sumatman AI Animation MCP Server - 完整使用指南

## 🎯 什么是Sumatman MCP Server？

Sumatman AI Animation MCP Server 是**世界首个AI代理故事动画MCP服务器**。它允许你通过Claude Code、ChatGPT等AI助手直接创建专业的动画故事视频，无需访问网站界面。

## 🚀 快速配置

### 步骤 1: 获取用户凭证

1. 访问 [https://app.sumatman.ai/developer](https://app.sumatman.ai/developer)
2. 登录你的账户
3. 记录你的 `User ID` 和注册邮箱

### 步骤 2: 配置Claude Code

**推荐方法（使用本项目安装脚本）**：
```bash
# 克隆项目并运行自动安装
git clone https://github.com/preangelleo/animagent-mcp-client.git
cd animagent-mcp-client
./install.sh  # macOS/Linux
# 或 install.bat  # Windows
```

**手动配置方法（如果使用mcp-remote）**：
```bash
claude mcp add animagent-mcp-client \
  -e ANIMAGENT_USER_ID=你的用户ID \
  -e ANIMAGENT_USER_EMAIL=你的邮箱地址 \
  -- npx mcp-remote https://app.sumatman.ai/api/mcp
```

### 步骤 3: 验证连接

运行以下命令检查连接状态：
```bash
claude mcp list
```

你应该看到：
```
sumatman-ai-animation: npx mcp-remote https://app.sumatman.ai/api/mcp - ✓ Connected
```

## 🎬 创建动画的完整流程

### 🔒 必须确认的参数（按顺序）

AI助手会按以下顺序询问这些**关键参数**：

#### 1. 📚 故事类型 (STORY_TYPE) - **最重要，必须首先选择**

选择以下13种故事类型之一（**必须精确拼写**）：
- `fairytale_story` - 🧚‍♀️ 童话故事
- `educational_story` - 📚 教育故事  
- `historical_story` - 🏛️ 历史故事
- `sci_fi_story` - 🚀 科幻故事
- `fantasy_story` - 🐉 奇幻故事
- `adventure_story` - 🗺️ 冒险故事
- `romantic_story` - 💕 爱情故事
- `cinematic_story` - 🎬 电影风格
- `bible_story` - ✝️ 圣经故事
- `poetry_story` - ✍️ 诗歌故事
- `lyric_story` - 🎵 歌词故事
- `comics_story` - 💥 漫画故事（**特殊**：可以上传固定角色形象）
- `book_story` - 📖 书籍改编

**⚠️ 重要**：每种故事类型都有专门的系统提示词，拼写错误会导致任务失败！

#### 2. 🗣️ 故事语言 (VOICE_LANGUAGE)

选择故事和旁白的语言：
- `english` - 英语
- `chinese` - 中文
- `spanish` - 西班牙语
- `french` - 法语
- 以及其他支持的语言

**💡 提示**：即使你用中文和AI聊天，也可能想要英文动画！

#### 3. ⏱️ 视频时长 (VIDEO_DURATION)

选择视频长度（分钟），必须是5的倍数：
- 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60
- **默认推荐**：10分钟

#### 4. 📱 视频格式 (DIMENSION_TYPE)

选择视频方向：
- `landscape` - 横屏（16:9，适合电脑/电视）
- `portrait` - 竖屏（9:16，适合手机）

### 🤖 可选的AI可读参数

这些参数可以用**自然语言**描述，不限于固定选项：

#### 5. 🎨 插画风格 (ILLUSTRATION_STYLE)

**预设风格**：
- "Epic Cinematic Matte Painting" - 史诗电影风格
- "Stage Theatre Illustration" - 舞台剧风格
- "Silk Scroll Miniature Painting" - 丝绸卷轴画
- "Japanese Ghibli-inspired Style" - 宫崎骏风格（默认）
- "Silhouette Shadow Drama Style" - 皮影戏风格
- "Mythological Chinese Painting" - 中国神话画风
- "Fantasy Realism with Chinese Elements" - 中式奇幻写实
- "Modern Cinematic Illustration" - 现代电影插画

**自定义风格**：任何GPT能理解的艺术风格
- 例如："水彩画风格"、"漫画书风格"、"照片写实风格"、"动漫风格"

#### 6. 👶 目标年龄 (AUDIENCE_AGE)

**预设选项**：
- `toddlers` (1-3岁)、`preschool` (4-5岁)、`children` (6-12岁)
- `teens` (13-17岁)、`young_adults` (18-25岁)、`adults` (26-64岁)
- `seniors` (65岁以上)

**自然语言**：
- "8-10岁的孩子"、"青少年"、"老年人"等

#### 7. 👫 性别导向 (AUDIENCE_GENDER)

**预设选项**：`all_genders`、`male`、`female`

**自然语言**：
- "年轻女性"、"男孩子"、"成熟男性"等

#### 8. 🌍 文化背景 (AUDIENCE_LOCATION)

**预设选项**：
- `global`、`western`、`east_asian`、`islamic`、`christian` 等

**自然语言**：
- "中世纪欧洲风格"、"现代亚洲风格"、"传统非洲风格"等

## 📝 使用示例

### 示例 1: 基础动画创建
```
用户: "我想创建一个关于友谊的温馨故事"

AI助手会询问：
1. "您想要什么类型的故事？" → 选择 fairytale_story
2. "故事用什么语言？" → 选择 chinese  
3. "视频多长时间？" → 选择 10分钟
4. "横屏还是竖屏？" → 选择 landscape
5. 然后开始创建任务
```

### 示例 2: 高级定制动画
```
用户: "制作一个科幻故事，关于机器人帮助人类探索宇宙"

AI助手确认参数：
- 故事类型：sci_fi_story
- 语言：english  
- 时长：15分钟
- 格式：landscape
- 插画风格："Modern Cinematic Illustration"
- 目标受众："teenagers"
```

### 示例 3: 漫画角色故事
```
用户: "用我的角色创建一个漫画故事"

AI助手会选择：
- 故事类型：comics_story （支持固定角色上传）
- 其他参数正常询问...
```

## 🛠️ 可用工具

### 1. create_animation_task
创建新的动画任务

### 2. get_task_details  
查询任务状态和详情
```
"检查我的动画任务进度，任务ID：task_abc123"
```

### 3. edit_animation_task
修改现有任务

### 4. repeat_animation_task
基于已完成任务创建变体

## ⚠️ 重要注意事项

### 安全提醒
- **永远不要分享你的用户ID和邮箱**
- 环境变量安全传输，AI助手看不到你的凭证

### 计费说明
- 每个动画任务消耗相应积分
- 创建前会显示所需积分数量
- 余额不足时会提示充值

### 技术限制
- **处理时间**：通常5-15分钟
- **并发限制**：根据订阅计划
- **文件大小**：根据视频时长自动优化

## 🔧 故障排除

### 连接问题
1. 检查用户ID和邮箱是否正确
2. 确认网络连接正常  
3. 重启Claude Code
4. 检查 https://app.sumatman.ai 网站是否正常

### 任务创建失败
1. **最常见**：story_type拼写错误 → 必须使用精确的英文名称
2. 检查积分余额是否充足
3. 确认input_story参数不为空
4. 检查参数格式是否正确

### 参数相关问题
- **story_type错误**：必须从13个选项中精确选择
- **语言不匹配**：确认voice_language设置正确
- **时长无效**：必须是5的倍数（5-60分钟）
- **格式错误**：只能是landscape或portrait

## 📞 获取帮助

- **技术支持**：访问 [https://app.sumatman.ai/developer](https://app.sumatman.ai/developer)  
- **文档更新**：查看项目README文件
- **社区支持**：GitHub Issues
- **在线演示**：https://app.sumatman.ai

## 🌟 高级功能

### Comics Story特殊功能
当选择`comics_story`时，你可以：
- 使用固定角色贯穿整个故事情节
- 角色形象保持一致，适合创建连载漫画系列

**⚠️ 重要：角色图片上传要求**
- **MCP交互中无法直接上传图片**
- 必须先在 [https://app.sumatman.ai](https://app.sumatman.ai) 的 **Asset Management** 页面上传角色图片
- 上传时为角色命名（如："Super Hero"）
- 在MCP对话中只需提供角色名称即可调用
- 支持的格式：PNG、JPG，建议使用方形图片以获得最佳效果

### 自然语言灵活性
对于AI可读字段，你可以：
- 使用任何描述性语言
- 组合多个风格元素
- 创建独特的视觉效果

---

**🎨 开始你的AI动画创作之旅！** ✨

*最后更新：2025年7月31日*