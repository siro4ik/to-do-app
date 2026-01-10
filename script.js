document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todo-input');
    const addBtn = document.getElementById('add-btn');
    const todoList = document.getElementById('todo-list');
    const filterAll = document.getElementById('filter-all');
    const filterCompleted = document.getElementById('filter-completed');
    const filterIncomplete = document.getElementById('filter-incomplete');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    addBtn.addEventListener('click', () => {
        const taskText = todoInput.value.trim();
        if (taskText !== '') {
            addTask(taskText);
            todoInput.value = '';
        }
    });

    function addTask(text) {
        const task = {
            id: Date.now(),
            text,
            completed: false,
        };
        tasks.push(task);
        saveTasks();
        renderTasks();
    }

    function renderTasks(filter = 'all') {
        todoList.innerHTML = '';
        let filteredTasks = tasks;

        if (filter === 'completed') {
            filteredTasks = tasks.filter(task => task.completed);
        } else if (filter === 'incomplete') {
            filteredTasks = tasks.filter(task => !task.completed);
        }

        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `todo-item ${task.completed ? 'completed' : ''}`;
            li.dataset.id = task.id;
            li.innerHTML = `
                <span>${task.text}</span>
                <div class = "task-btn">
                    <button class="complete-btn">${task.completed ? '-' : '+'}</button>
                    <button class="delete-btn">Удалить</button>
                </div>
            `;
            todoList.appendChild(li);

            const completeBtn = li.querySelector('.complete-btn');
            completeBtn.addEventListener('click', () => {
                task.completed = !task.completed;
                saveTasks();
                renderTasks(filter);
            });


            const deleteBtn = li.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => {
                tasks = tasks.filter(t => t.id !== task.id);
                saveTasks();
                renderTasks(filter);
            });
        });
    }

    filterAll.addEventListener('click', () => {
        setActiveFilter(filterAll);
        renderTasks('all');
    });

    filterCompleted.addEventListener('click', () => {
        setActiveFilter(filterCompleted);
        renderTasks('completed');
    });

    filterIncomplete.addEventListener('click', () => {
        setActiveFilter(filterIncomplete);
        renderTasks('incomplete');
    });

    function setActiveFilter(activeButton) {
        document.querySelectorAll('.filters button').forEach(button => {
            button.classList.remove('active');
        });
        activeButton.classList.add('active');
    }

    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addBtn.click();
        }
    });

    renderTasks();
});