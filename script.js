// パスワード設定（ここでパスワードを変更できます）
const correctPassword = "1972";

// DOMロード時にパスワード入力のチェック
document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('authenticated') === 'true') {
        showTodoSection();
    }
});

// パスワード認証のイベント
document.getElementById('password-submit').addEventListener('click', function() {
    const enteredPassword = document.getElementById('password-input').value;

    if (enteredPassword === correctPassword) {
        // 認証成功
        localStorage.setItem('authenticated', 'true');
        showTodoSection();
    } else {
        // 認証失敗
        document.getElementById('password-error').style.display = 'block';
    }
});

// To-Doリストセクションを表示し、パスワードセクションを隠す
function showTodoSection() {
    document.getElementById('password-section').style.display = 'none';
    document.getElementById('todo-section').style.display = 'block';
}

// --- 以下、既存のタスク管理機能 ---
document.getElementById('add-task').addEventListener('click', function() {
    const taskName = document.getElementById('new-task').value;
    const taskDeadline = document.getElementById('task-deadline').value;
    const taskPriority = document.getElementById('task-priority').value;
    const taskCategory = document.getElementById('task-category').value;

    if (taskName.trim() !== "") {
        const task = {
            name: taskName,
            deadline: taskDeadline,
            priority: taskPriority,
            category: taskCategory,
            completed: false
        };

        addTaskToDOM(task);
        saveTaskToStorage(task);
        
        document.getElementById('new-task').value = '';
        document.getElementById('task-deadline').value = '';
    }
});

document.getElementById('search-task').addEventListener('input', function() {
    const searchQuery = this.value.toLowerCase();
    filterTasks(searchQuery);
});

document.getElementById('filter-category').addEventListener('change', function() {
    const selectedCategory = this.value;
    displayTasksByCategory(selectedCategory);
});

document.getElementById('clear-tasks').addEventListener('click', function() {
    localStorage.removeItem('tasks');
    document.getElementById('task-list').innerHTML = '';
});

function addTaskToDOM(task) {
    const taskList = document.getElementById('task-list');

    const li = document.createElement('li');
    const taskContent = document.createElement('span');
    taskContent.textContent = `${task.name} (Deadline: ${task.deadline}, Priority: ${task.priority}, Category: ${task.category})`;
    
    const completeButton = document.createElement('button');
    completeButton.textContent = 'Complete';
    completeButton.className = 'complete';
    completeButton.addEventListener('click', function() {
        li.classList.toggle('task-completed');
        task.completed = !task.completed;
        updateTaskInStorage(task);
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete';
    deleteButton.addEventListener('click', function() {
        li.remove();
        removeTaskFromStorage(task);
    });

    li.appendChild(taskContent);
    li.appendChild(completeButton);
    li.appendChild(deleteButton);
    taskList.appendChild(li);

    if (task.completed) {
        li.classList.add('task-completed');
    }
}

function saveTaskToStorage(task) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasksFromStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(addTaskToDOM);
}

function removeTaskFromStorage(taskToRemove) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.name !== taskToRemove.name);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateTaskInStorage(updatedTask) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.map(task => task.name === updatedTask.name ? updatedTask : task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function filterTasks(query) {
    const tasks = document.querySelectorAll('#task-list li');
    tasks.forEach(function(task) {
        const taskText = task.textContent.toLowerCase();
        if (taskText.includes(query)) {
            task.style.display = 'flex';
        } else {
            task.style.display = 'none';
        }
    });
}

function displayTasksByCategory(category) {
    const tasks = document.querySelectorAll('#task-list li');
    tasks.forEach(function(task) {
        const taskText = task.textContent.toLowerCase();
        if (category === 'all' || taskText.includes(`category: ${category}`)) {
            task.style.display = 'flex';
        } else {
            task.style.display = 'none';
        }
    });
}
