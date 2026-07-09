# Todo List Application

A modern, feature-rich todo list application built with vanilla HTML, CSS, and JavaScript with full local storage functionality.

## Features

### Core Functionality
- ✅ **Add Tasks** - Create new tasks with text, priority level, and due dates
- ✏️ **Edit Tasks** - Modify task text inline
- ❌ **Delete Tasks** - Remove individual tasks
- ✔️ **Toggle Completion** - Mark tasks as complete/incomplete
- 🔍 **Search Tasks** - Find tasks by keywords
- 🏷️ **Filter Tasks** - View by category (All, Active, Completed, Urgent)
- 🔄 **Sort Tasks** - Sort by date added, priority, due date, or alphabetically

### Advanced Features
- 📁 **Local Storage** - All data saved automatically to browser storage
- 📦 **Export Tasks** - Download tasks as JSON file
- 📨 **Import Tasks** - Upload tasks from JSON file
- 🗑️ **Clear Completed** - Bulk delete completed tasks
- 📈 **Statistics** - View completion rate and task counts
- 🎯 **Priority Levels** - Low, Medium, High with color coding
- 📅 **Due Dates** - Set and track task due dates
- 📢 **Notifications** - Toast messages for actions

### User Experience
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- ⚡ **Instant Feedback** - Real-time updates without page reload
- 🎨 **Beautiful UI** - Modern gradient design with smooth animations
- ♿ **Accessible** - Semantic HTML and keyboard navigation
- 🌈 **Visual Feedback** - Color-coded priorities and status indicators
- 📱 **Mobile Optimized** - Touch-friendly interface

## How to Use

### Quick Start

1. Open `index.html` in your web browser
2. Start managing your tasks!

### Adding Tasks

1. Type your task in the input field
2. (Optional) Select a priority level
3. (Optional) Choose a due date
4. Click the **+** button or press **Enter**

### Managing Tasks

- **Complete Task**: Click the checkbox
- **Edit Task**: Click the edit button
- **Delete Task**: Click the delete button
- **Search**: Type in the search box to filter tasks
- **Sort**: Choose sort option from dropdown
- **Filter**: Click category buttons in the sidebar

## Features In Detail

### Priority Levels

- 🔵 **Low** - Non-urgent tasks
- 🟡 **Medium** - Standard priority (default)
- 🔴 **High** - Urgent tasks

### Due Dates

Tasks show relative due dates:
- **Today** - Due today
- **Tomorrow** - Due tomorrow
- **In X days** - Future dates
- **Overdue** - Past due dates (red text)

### Categories

- **All Tasks** - View all tasks
- **Active** - Show only incomplete tasks
- **Completed** - Show only completed tasks
- **Urgent** - Show high-priority incomplete tasks

### Statistics

The sidebar shows:
- **Total Tasks** - All tasks count
- **Completed** - Number of completed tasks
- **Completion Rate** - Percentage of completed tasks

### Import/Export

**Export Tasks**:
1. Click **Export Tasks** button
2. File downloads as `todos-{timestamp}.json`
3. Keep backup or share with others

**Import Tasks**:
1. Click **Import Tasks** button
2. Select a previously exported JSON file
3. Tasks are restored to your list

## Browser Support

- ✅ Chrome/Chromium (all versions)
- ✅ Firefox (all versions)
- ✅ Safari (all versions)
- ✅ Edge (all versions)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Keyboard Shortcuts

- **Enter** - Add task (from input field)

## Tips & Tricks

### Productivity Tips

1. **Use Priority Levels** - Mark urgent items as High priority
2. **Set Due Dates** - Stay on top of deadlines
3. **Regular Cleanup** - Clear completed tasks periodically
4. **Regular Backups** - Export tasks weekly

### Organization Tips

1. **Use Short Text** - Keep task descriptions concise
2. **Group Tasks** - Related tasks together
3. **Priority Management** - Not everything is urgent
4. **Weekly Reviews** - Review for better planning

## Privacy & Security

- ✅ **No Server**: Data stored only in your browser
- ✅ **No Tracking**: No analytics or tracking
- ✅ **Local Only**: Complete privacy and control

## Project Files

```
todo-app/
├── index.html          # HTML structure
├── style.css           # Styling and animations
├── storage.js          # Local storage service
├── app.js              # Main application logic
└── README.md           # This file
```

## License

MIT License - Free to use and modify

## Author

Created with ❤️ by shafiul-eng
