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
git clone https://github.com/preangelleo/animagent-mcp-server.git
cd animagent-mcp-server
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

**Animation Styles (Recommended for Stories)**:
- "3D Rendering" - 🎮 3D graphics
- "Acrylic Painting" - 🎨 Traditional medium
- "Anime Style" - 🌸 Japanese animation
- "Chinese Ink Painting" - 🖌️ Traditional Chinese art
- "Comic Book Style" - 💥 Comics art
- "Hayao Miyazaki Style" - 🍃 Studio Ghibli aesthetic
- "Japanese Ghibli-inspired Style" - 🌿 Studio Ghibli style (default)
- "Japanese Woodblock" - 🌊 Ukiyo-e style
- "Vector Art" - 🎯 Clean graphics
- "Watercolor" - 💧 Fluid art style

**Other Popular Styles**:
- "Cinematic Realism" - 🎬 Movie quality
- "Digital Painting" - 💻 Digital art
- "Fantasy Art" - 🐉 Imaginative style
- "Oil Painting" - 🖼️ Classic art
- "Photorealistic" - 📷 Like real life

**Custom Styles**: Any GPT-recognizable art style works!
- View all 18 styles with samples at: https://animagent.ai/illustration-styles

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

### 🎬 Advanced Video Options (New!)

#### 9. 📝 Subtitles (ENABLE_SUBTITLE)
- **Type**: Boolean (true/false)
- **Default**: false
- **Description**: Enable synchronized subtitles in the video
- **Note**: Subtitles will be automatically generated and timed with the narration

#### 10. 🎥 Zoom Effects (ENABLE_ZOOM_EFFECT)
- **Type**: Boolean (true/false)
- **Default**: false
- **Description**: Add cinematic zoom in/out effects to images
- **Note**: Makes static images more dynamic and engaging

#### 11. 💧 Watermark (WATERMARK_ENABLED)
- **Type**: Boolean (true/false)
- **Default**: false
- **Description**: Add your custom watermark to the video
- **⚠️ Important**: You must first upload a watermark image for your story type at [app.sumatman.ai/asset-management](https://app.sumatman.ai/asset-management)

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

### Example 3: With Advanced Options
```
User: "Create an educational story with subtitles and zoom effects"

AI assistant confirms parameters:
- Story type: educational_story
- Enable subtitles: true
- Enable zoom effects: true
- Watermark: false (unless user has uploaded one)
```

### Example 4: Comics Character Story
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

### 3. edit_animation_task ⚡ *Enhanced Validation*
Modify existing tasks  
**🔒 Critical Requirement**: Must provide `task_id` parameter - client validates this locally

### 4. repeat_animation_task ⚡ *Enhanced Validation*
Create variations based on completed tasks
**🔒 Critical Requirement**: Must provide `task_id` parameter - client validates this locally

### 5. delete_animation_task ⚡ *Enhanced Validation*  
Delete pending animation tasks
**🔒 Critical Requirement**: Must provide `task_id` parameter - client validates this locally

## ⚠️ Important Notes

### ⚡ Task ID Requirements (Critical for Task Operations)
- **edit_animation_task**: MUST provide `task_id` of the task to modify
- **repeat_animation_task**: MUST provide `task_id` of completed task to copy settings from
- **delete_animation_task**: MUST provide `task_id` of pending task to delete
- **Local Validation**: Client automatically checks for missing `task_id` before sending to server
- **Best Practice**: Always use `get_task_details` first to find the correct task ID

### Security Reminders
- **Never share your User ID and email**
- Environment variables are transmitted securely, AI assistants cannot see your credentials

### Billing Information
- Each animation task consumes corresponding credits
- Required credits will be displayed before creation
- You'll be prompted to top up if balance is insufficient

## 🔧 Troubleshooting

### ⚡ Client Validation Errors (New - Caught Locally)

**"❌ Client Validation Error - TASK_ID IS MANDATORY"**
- **When it appears**: Trying to edit, repeat, or delete without providing `task_id`
- **Why it happens**: AI assistant forgot to include the required task ID parameter
- **How to fix**: 
  1. First use: `"Check my task details for task ID: [your_task_id]"`
  2. Then retry with: `"Edit that task to change [specific field]"`
- **Example conversation**:
  ```
  User: "Edit my animation to make it 15 minutes long"
  AI: ❌ Client Validation Error - TASK_ID IS MANDATORY
  User: "First check task details for task_abc123, then edit it to 15 minutes"
  AI: ✅ Successfully edited task
  ```

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

### Task Management Issues ⚡ Enhanced
- **Missing task_id error**: Now caught locally with helpful guidance
- **Edit failed silently**: Fixed through better AI guidance and validation
- **Wrong task status**: Server still validates business rules (pending/completed status)

## 📞 Getting Help

- **Technical Support**: Visit [https://app.sumatman.ai](https://app.sumatman.ai)  
- **Documentation Updates**: Check project README files
- **Community Support**: GitHub Issues
- **Live Demo**: https://app.sumatman.ai

## 🌟 Advanced Features

### ⚡ Smart Error Prevention (v2.1.0)
- **Local Validation**: Client catches missing parameters before server contact
- **Instant Feedback**: No waiting for server roundtrip on obvious errors  
- **Usage Guidance**: Error messages include exact syntax examples
- **Dual-Layer Protection**: Client validates required fields, server validates business logic

### 🔧 Latest Technical Improvements (July 2025)
- **Fixed Parameter Mapping**: Resolved critical backend parameter mapping issues
- **Fully Working Edit Operations**: Edit, repeat, and delete now work reliably
- **Consistent Parameter Handling**: Unified parameter conversion across all operation modes
- **Enhanced Reliability**: All task management operations fully tested and verified

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

### Task Management Best Practices ⚡ Updated
- **Always start with get_task_details** when working with existing tasks
- **Provide task_id explicitly** for edit/repeat/delete operations  
- **Use descriptive language** when asking AI to perform task operations
- **Check task status** before attempting edits (only "pending" tasks can be edited)

---

**🎨 Start your AI animation creation journey!** ✨

*Last updated: July 31, 2025 - v2.1.1 with Enhanced Client-Side Validation & Fixed Parameter Mapping*