// Local Storage Service

class StorageService {
    constructor(storageKey = 'todos') {
        this.storageKey = storageKey;
        this.initializeStorage();
    }

    // Initialize storage with default structure if empty
    initializeStorage() {
        if (!this.get()) {
            const initialData = {
                tasks: [],
                lastId: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            this.save(initialData);
        }
    }

    // Get all data from storage
    get() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error reading from storage:', error);
            return null;
        }
    }

    // Save data to storage
    save(data) {
        try {
            data.updatedAt = new Date().toISOString();
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error writing to storage:', error);
            return false;
        }
    }

    // Add a new task
    addTask(task) {
        const data = this.get();
        const newTask = {
            id: ++data.lastId,
            text: task.text,
            priority: task.priority || 'medium',
            dueDate: task.dueDate || null,
            completed: false,
            createdAt: new Date().toISOString(),
            completedAt: null
        };
        
        data.tasks.push(newTask);
        this.save(data);
        return newTask;
    }

    // Get all tasks
    getTasks() {
        const data = this.get();
        return data ? data.tasks : [];
    }

    // Get task by ID
    getTaskById(id) {
        const tasks = this.getTasks();
        return tasks.find(task => task.id === id);
    }

    // Update task
    updateTask(id, updates) {
        const data = this.get();
        const task = data.tasks.find(t => t.id === id);
        
        if (task) {
            Object.assign(task, updates);
            
            // Set completion time if task is marked as completed
            if (updates.completed && !task.completedAt) {
                task.completedAt = new Date().toISOString();
            } else if (!updates.completed && task.completedAt) {
                task.completedAt = null;
            }
            
            this.save(data);
            return task;
        }
        return null;
    }

    // Delete task
    deleteTask(id) {
        const data = this.get();
        const index = data.tasks.findIndex(t => t.id === id);
        
        if (index !== -1) {
            const deletedTask = data.tasks.splice(index, 1);
            this.save(data);
            return true;
        }
        return false;
    }

    // Delete all completed tasks
    deleteCompletedTasks() {
        const data = this.get();
        const initialLength = data.tasks.length;
        data.tasks = data.tasks.filter(task => !task.completed);
        
        if (data.tasks.length < initialLength) {
            this.save(data);
            return initialLength - data.tasks.length;
        }
        return 0;
    }

    // Get filtered tasks
    getFilteredTasks(filter = 'all') {
        const tasks = this.getTasks();
        
        switch (filter) {
            case 'active':
                return tasks.filter(task => !task.completed);
            case 'completed':
                return tasks.filter(task => task.completed);
            case 'urgent':
                return tasks.filter(task => task.priority === 'high' && !task.completed);
            default:
                return tasks;
        }
    }

    // Get task counts
    getTaskCounts() {
        const tasks = this.getTasks();
        return {
            all: tasks.length,
            active: tasks.filter(t => !t.completed).length,
            completed: tasks.filter(t => t.completed).length,
            urgent: tasks.filter(t => t.priority === 'high' && !t.completed).length
        };
    }

    // Get completion statistics
    getStatistics() {
        const tasks = this.getTasks();
        const completed = tasks.filter(t => t.completed).length;
        const total = tasks.length;
        
        return {
            total,
            completed,
            active: total - completed,
            completionRate: total === 0 ? 0 : Math.round((completed / total) * 100)
        };
    }

    // Search tasks
    searchTasks(query) {
        const tasks = this.getTasks();
        const lowerQuery = query.toLowerCase();
        return tasks.filter(task => 
            task.text.toLowerCase().includes(lowerQuery)
        );
    }

    // Sort tasks
    sortTasks(tasks, sortBy = 'date-added') {
        const sorted = [...tasks];
        
        switch (sortBy) {
            case 'priority':
                const priorityOrder = { high: 0, medium: 1, low: 2 };
                return sorted.sort((a, b) => {
                    // Active tasks first
                    if (a.completed !== b.completed) {
                        return a.completed ? 1 : -1;
                    }
                    return priorityOrder[a.priority] - priorityOrder[b.priority];
                });
            
            case 'due-date':
                return sorted.sort((a, b) => {
                    // Active tasks first
                    if (a.completed !== b.completed) {
                        return a.completed ? 1 : -1;
                    }
                    // Tasks without due date go to the end
                    if (!a.dueDate) return 1;
                    if (!b.dueDate) return -1;
                    return new Date(a.dueDate) - new Date(b.dueDate);
                });
            
            case 'alphabetical':
                return sorted.sort((a, b) => {
                    // Active tasks first
                    if (a.completed !== b.completed) {
                        return a.completed ? 1 : -1;
                    }
                    return a.text.localeCompare(b.text);
                });
            
            default: // date-added
                return sorted.sort((a, b) => {
                    // Active tasks first
                    if (a.completed !== b.completed) {
                        return a.completed ? 1 : -1;
                    }
                    return new Date(b.createdAt) - new Date(a.createdAt);
                });
        }
    }

    // Export tasks to JSON
    exportTasks() {
        const data = this.get();
        return JSON.stringify(data, null, 2);
    }

    // Import tasks from JSON
    importTasks(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            
            // Validate structure
            if (!Array.isArray(data.tasks)) {
                throw new Error('Invalid tasks format');
            }
            
            // Set the new data
            data.updatedAt = new Date().toISOString();
            this.save(data);
            return true;
        } catch (error) {
            console.error('Error importing tasks:', error);
            return false;
        }
    }

    // Clear all data
    clearAll() {
        localStorage.removeItem(this.storageKey);
        this.initializeStorage();
    }

    // Get storage size info
    getStorageInfo() {
        const data = this.get();
        const jsonString = JSON.stringify(data);
        const bytes = new Blob([jsonString]).size;
        
        return {
            bytes,
            kilobytes: (bytes / 1024).toFixed(2),
            readable: bytes < 1024 
                ? `${bytes} B` 
                : `${(bytes / 1024).toFixed(2)} KB`
        };
    }
}

// Create singleton instance
const storage = new StorageService();
