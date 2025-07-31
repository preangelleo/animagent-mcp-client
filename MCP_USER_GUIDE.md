# Animagent MCP Server - User Guide

## 🎯 What is Animagent MCP Server?

The Animagent MCP Server is the **world's first AI agent MCP server for story animation**. It allows you to create professional animated story videos directly through AI assistants like Claude Code, ChatGPT, and others, without needing to access the web interface.

## 🚀 Quick Setup

### Step 1: Get Your User Credentials

1. Visit [https://app.sumatman.ai](https://app.sumatman.ai)
2. Log in to your account
3. Go to the **Welcome page** to find your `User ID`
4. Note your registered email address

### Step 2: Configure Claude Code

**Recommended Method (Using Project Installer)**:
```bash
# Clone the project and run automatic installation
git clone https://github.com/preangelleo/animagent-mcp-client.git
cd animagent-mcp-client
./install.sh  # macOS/Linux
# or install.bat  # Windows
```

**Manual Configuration Method (if using mcp-remote)**:
```bash
claude mcp add animagent-mcp-server \
  -e ANIMAGENT_USER_ID=your-user-id \
  -e ANIMAGENT_USER_EMAIL=your-email@example.com \
  -- npx mcp-remote https://app.sumatman.ai/api/mcp
```

### Step 3: Verify Connection

Run the following command to check connection status:
```bash
claude mcp list
```

You should see:
```
animagent-mcp-server: npx mcp-remote https://app.sumatman.ai/api/mcp - ✓ Connected
```

## 🎬 Complete Animation Creation Process

### 🔒 Required Parameters (In Order)

AI assistants will ask for these **critical parameters** in the following order:

#### 1. 📚 Story Type (STORY_TYPE) - **Most Important, Must Ask First**

Choose one of the following 13 story types (**must be spelled exactly**):
- `fairytale_story` - 🧚‍♀️ Fairytale Stories
- `educational_story` - 📚 Educational Stories  
- `historical_story` - 🏛️ Historical Stories
- `sci_fi_story` - 🚀 Science Fiction
- `fantasy_story` - 🐉 Fantasy Stories
- `adventure_story` - 🗺️ Adventure Stories
- `romantic_story` - 💕 Romance Stories
- `cinematic_story` - 🎬 Cinematic Style
- `bible_story` - ✝️ Bible Stories
- `poetry_story` - ✍️ Poetry Stories
- `lyric_story` - 🎵 Lyrical Stories
- `comics_story` - 💥 Comic Stories (**Special**: allows fixed character uploads)
- `book_story` - 📖 Book Adaptations

**⚠️ Important**: Each story type has specific system prompts, spelling errors will cause task failure!

#### 2. 🗣️ Story Language (VOICE_LANGUAGE)

Choose the language for story and narration:
- `english` - English
- `chinese` - Chinese
- `spanish` - Spanish
- `french` - French
- And other supported languages

**💡 Tip**: Even if you chat with AI in Chinese, you might want an English animation!

#### 3. ⏱️ Video Duration (VIDEO_DURATION)

Choose video length (minutes), must be multiples of 5:
- 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60
- **Default recommended**: 10 minutes

#### 4. 📱 Video Format (DIMENSION_TYPE)

Choose video orientation:
- `landscape` - Horizontal (16:9, suitable for computers/TV)
- `portrait` - Vertical (9:16, suitable for mobile phones)

### 🤖 Optional AI Readable Parameters

These parameters can be described using **natural language**, not limited to fixed options:

#### 5. 🎨 Illustration Style (ILLUSTRATION_STYLE)

**Predefined Styles**:
- "Epic Cinematic Matte Painting" - Epic cinematic style
- "Stage Theatre Illustration" - Theatrical style
- "Silk Scroll Miniature Painting" - Traditional silk scroll art
- "Japanese Ghibli-inspired Style" - Studio Ghibli style (default)
- "Silhouette Shadow Drama Style" - Shadow puppet style
- "Mythological Chinese Painting" - Chinese mythology art
- "Fantasy Realism with Chinese Elements" - Eastern fantasy realism
- "Modern Cinematic Illustration" - Contemporary film illustration

**Custom Styles**: Any GPT-recognizable art style
- Examples: "watercolor style", "comic book style", "photorealistic style", "anime style"

#### 6. 👶 Target Age (AUDIENCE_AGE)

**Predefined Options**:
- `toddlers` (1-3 years), `preschool` (4-5 years), `children` (6-12 years)
- `teens` (13-17 years), `young_adults` (18-25 years), `adults` (26-64 years)
- `seniors` (65+ years)

**Natural Language**:
- "kids aged 8-10", "teenagers", "elderly people", etc.

#### 7. 👫 Gender Focus (AUDIENCE_GENDER)

**Predefined Options**: `all_genders`, `male`, `female`

**Natural Language**:
- "young women", "boys", "mature men", etc.

#### 8. 🌍 Cultural Background (AUDIENCE_LOCATION)

**Predefined Options**:
- `global`, `western`, `east_asian`, `islamic`, `christian`, etc.

**Natural Language**:
- "medieval European style", "modern Asian style", "traditional African style", etc.

## 📝 Usage Examples

### Example 1: Basic Animation Creation
```
User: "I want to create a heartwarming story about friendship"

AI assistant will ask:
1. "What type of story would you like?" → Choose fairytale_story
2. "What language for the story?" → Choose english  
3. "How long should the video be?" → Choose 10 minutes
4. "Landscape or portrait format?" → Choose landscape
5. Then start creating the task
```

### Example 2: Advanced Custom Animation
```
User: "Create a sci-fi story about robots helping humans explore the universe"

AI assistant confirms parameters:
- Story type: sci_fi_story
- Language: english  
- Duration: 15 minutes
- Format: landscape
- Illustration style: "Modern Cinematic Illustration"
- Target audience: "teenagers"
```

### Example 3: Comics Character Story
```
User: "Create a comic story using my character"

AI assistant will choose:
- Story type: comics_story (supports fixed character uploads)
- Other parameters asked normally...
```

## 🛠️ Available Tools

### 1. create_animation_task
Create new animation tasks

### 2. get_task_details  
Query task status and details
```
"Check my animation task progress, task ID: task_abc123"
```

### 3. edit_animation_task
Modify existing tasks

### 4. repeat_animation_task
Create variations based on completed tasks

## ⚠️ Important Notes

### Security Reminders
- **Never share your User ID and email**
- Environment variables are transmitted securely, AI assistants cannot see your credentials

### Billing Information
- Each animation task consumes corresponding credits
- Required credits will be displayed before creation
- You'll be prompted to top up if balance is insufficient

## 🔧 Troubleshooting

### Connection Issues
1. Check if User ID and email are correct
2. Confirm network connection is stable  
3. Restart Claude Code
4. Check if https://app.sumatman.ai website is accessible

### Task Creation Failures
1. **Most common**: story_type spelling error → Must use exact English names
2. Check if credit balance is sufficient
3. Confirm input_story parameter is not empty
4. Check if parameter format is correct

### Parameter-Related Issues
- **story_type error**: Must choose precisely from 13 options
- **language mismatch**: Confirm voice_language is set correctly
- **invalid duration**: Must be multiples of 5 (5-60 minutes)
- **format error**: Must be landscape or portrait only

## 📞 Getting Help

- **Technical Support**: Visit [https://app.sumatman.ai](https://app.sumatman.ai)  
- **Documentation Updates**: Check project README files
- **Community Support**: GitHub Issues
- **Live Demo**: https://app.sumatman.ai

## 🌟 Advanced Features

### Comics Story Special Features
When selecting `comics_story`, you can:
- Use fixed characters throughout the entire storyline
- Maintain consistent character appearance, perfect for serialized comic series

**⚠️ Important: Character Image Upload Requirements**
- **MCP interactions cannot directly upload images**
- Must first upload character images in **Asset Management** at [https://app.sumatman.ai/asset-management](https://app.sumatman.ai/asset-management)
- Name your characters during upload (e.g., "Super Hero")
- In MCP conversations, simply provide the character name to reference them
- Supported formats: PNG, JPG, recommend square images for best results

### Natural Language Flexibility
For AI readable fields, you can:
- Use any descriptive language
- Combine multiple style elements
- Create unique visual effects

---

**🎨 Start your AI animation creation journey!** ✨

*Last updated: July 31, 2025*