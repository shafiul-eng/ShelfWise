// Todo Application

class TodoApp {
    constructor() {
        this.storage = storage;
        this.currentFilter = 'all';
        this.currentSort = 'date-added';
        this.searchQuery = '';
        this.init();
    }

    init() {
        this.cacheElements();
        this.attachEventListeners();
        this.render();
    }

    cacheElements() {
        // Input elements
        this.todoInput = document.getElementById('todoInput');
        this.addBtn = document.getElementById('addBtn');
        this.prioritySelect = document.getElementById('prioritySelect');
        this.dueDateInput = document.getElementById('dueDateInput');

        // Filter/Sort elements
        this.searchInput = document.getElementById('searchInput');
        this.sortSelect = document.getElementById('sortSelect');
        this.categoryBtns = document.querySelectorAll('.category-btn');

        // Action buttons
        this.clearCompletedBtn = document.getElementById('clearCompletedBtn');
        this.exportBtn = document.getElementById('exportBtn');
        this.importBtn = document.getElementById('importBtn');
        this.importFile = document.getElementById('importFile');

        // Display elements
        this.tasksList = document.getElementById('tasksList');
        this.emptyState = document.getElementById('emptyState');
        this.toast = document.getElementById('toast');

        // Counter elements
        this.allCount = document.getElementById('allCount');
        this.activeCount = document.getElementById('activeCount');
        this.completedCount = document.getElementById('completedCount');
        this.urgentCount = document.getElementById('urgentCount');

        // Statistics elements
        this.totalTasks = document.getElementById('totalTasks');
        this.completedTasks = document.getElementById('completedTasks');
        this.completionRate = document.getElementById('completionRate');
    }

    attachEventListeners() {
        // Add task
        this.addBtn.addEventListener('click', () => this.addTask());
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        // Filter by category
        this.categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => this.filterByCategory(btn.dataset.category));
        });

        // Search and sort
        this.searchInput.addEventListener('input', (e) => {
            this.searchQuery = e.target.value;
            this.render();
        });

        this.sortSelect.addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.render();
        });

        // Action buttons
        this.clearCompletedBtn.addEventListener('click', () => this.clearCompleted());
        this.exportBtn.addEventListener('click', () => this.exportTasks());
        this.importBtn.addEventListener('click', () => this.importFile.click());
        this.importFile.addEventListener('change', (e) => this.importTasks(e));
    }

    addTask() {
        const text = this.todoInput.value.trim();
        const priority = this.prioritySelect.value;
        const dueDate = this.dueDateInput.value;

        if (!text) {
            this.showToast('Please enter a task', 'warning');
            return;
        }

        this.storage.addTask({
            text,
            priority,
            dueDate: dueDate || null
        });

        this.todoInput.value = '';
        this.dueDateInput.value = '';
        this.prioritySelect.value = 'medium';
        this.showToast('Task added successfully', 'success');
        this.render();
    }

    deleteTask(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.storage.deleteTask(id);
            this.showToast('Task deleted', 'success');
            this.render();
        }
    }

    toggleTask(id) {
        const task = this.storage.getTaskById(id);
        this.storage.updateTask(id, { completed: !task.completed });
        this.showToast(
            task.completed ? 'Task marked as incomplete' : 'Task completed',
            'success'
        );
        this.render();
    }

    filterByCategory(category) {
        this.currentFilter = category;
        this.searchQuery = ''; // Clear search
        this.searchInput.value = '';
        this.sortSelect.value = 'date-added'; // Reset sort
        this.currentSort = 'date-added';

        // Update active button
        this.categoryBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });

        this.render();
    }

    clearCompleted() {
        const count = this.storage.deleteCompletedTasks();
        if (count > 0) {
            this.showToast(`${count} completed task(s) deleted`, 'success');
            this.render();
        } else {
            this.showToast('No completed tasks to clear', 'warning');
        }
    }

    exportTasks() {
        const data = this.storage.exportTasks();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `todos-${new Date().getTime()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        this.showToast('Tasks exported successfully', 'success');
    }

    importTasks(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            if (this.storage.importTasks(e.target.result)) {
                this.showToast('Tasks imported successfully', 'success');
                this.render();
            } else {
                this.showToast('Error importing tasks', 'error');
            }
        };
        reader.readAsText(file);
        this.importFile.value = ''; // Reset file input
    }

    render() {
        this.updateTasksList();
        this.updateCounts();
        this.updateStatistics();
    }

    updateTasksList() {
        let tasks = this.storage.getFilteredTasks(this.currentFilter);

        // Apply search
        if (this.searchQuery) {
            tasks = tasks.filter(task =>
                task.text.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        }

        // Apply sort
        tasks = this.storage.sortTasks(tasks, this.currentSort);

        // Clear list
        this.tasksList.innerHTML = '';

        if (tasks.length === 0) {
            this.emptyState.style.display = 'block';
            return;
        }

        this.emptyState.style.display = 'none';

        // Render tasks
        tasks.forEach(task => {
            const taskElement = this.createTaskElement(task);
            this.tasksList.appendChild(taskElement);
        });
    }

    createTaskElement(task) {
        const div = document.createElement('div');
        div.className = `task-item ${task.completed ? 'completed' : ''}`;
        div.dataset.taskId = task.id;

        const dueDateClass = this.getDueDateClass(task.dueDate, task.completed);
        const formattedDueDate = task.dueDate ? this.formatDueDate(task.dueDate) : '';

        div.innerHTML = `
            <input 
                type="checkbox" 
                class="task-checkbox" 
                ${task.completed ? 'checked' : ''}
                onchange="app.toggleTask(${task.id})"
            >
            <div class="task-content">
                <div class="task-text">${this.escapeHtml(task.text)}</div>
                <div class="task-meta">
                    <span class="task-priority ${task.priority}">
                        <i class="fas fa-flag"></i> ${this.capitalizeFirst(task.priority)}
                    </span>
                    ${task.dueDate ? `
                        <span class="task-duedate ${dueDateClass}">
                            <i class="fas fa-calendar"></i> ${formattedDueDate}
                        </span>
                    ` : ''}
                </div>
            </div>
            <div class="task-actions">
                <button class="task-btn edit" title="Edit" onclick="app.editTask(${task.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="task-btn delete" title="Delete" onclick="app.deleteTask(${task.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        return div;
    }

    getDueDateClass(dueDate, completed) {
        if (completed) return '';
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const due = new Date(dueDate);
        due.setHours(0, 0, 0, 0);
        
        if (due < today) return 'overdue';
        if (due.getTime() === today.getTime()) return 'today';
        return 'upcoming';
    }

    formatDueDate(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const due = new Date(date);
        due.setHours(0, 0, 0, 0);
        
        const daysDiff = Math.floor((due - today) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === 0) return 'Today';
        if (daysDiff === 1) return 'Tomorrow';
        if (daysDiff === -1) return 'Yesterday';
        if (daysDiff > -7 && daysDiff < 0) return `${Math.abs(daysDiff)} days ago`;
        if (daysDiff > 0 && daysDiff <= 7) return `In ${daysDiff} days`;
        
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    editTask(id) {
        const task = this.storage.getTaskById(id);
        if (!task) return;

        const newText = prompt('Edit task:', task.text);
        if (newText !== null && newText.trim()) {
            this.storage.updateTask(id, { text: newText.trim() });
            this.showToast('Task updated', 'success');
            this.render();
        }
    }

    updateCounts() {
        const counts = this.storage.getTaskCounts();
        this.allCount.textContent = counts.all;
        this.activeCount.textContent = counts.active;
        this.completedCount.textContent = counts.completed;
        this.urgentCount.textContent = counts.urgent;
    }

    updateStatistics() {
        const stats = this.storage.getStatistics();
        this.totalTasks.textContent = stats.total;
        this.completedTasks.textContent = stats.completed;
        this.completionRate.textContent = `${stats.completionRate}%`;
    }

    showToast(message, type = 'success') {
        this.toast.textContent = message;
        this.toast.className = `toast show ${type}`;
        
        setTimeout(() => {
            this.toast.classList.remove('show');
        }, 3000);
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize app when DOM is ready
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new TodoApp();
});
