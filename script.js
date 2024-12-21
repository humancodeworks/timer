
const addTaskButton = document.getElementById("add-task-btn");
const taskNameInput = document.getElementById("task-name");
const taskTimeInput = document.getElementById("task-time");
const taskList = document.querySelector(".task-list");
const notificationArea = document.getElementById("notification-area");

let tasks = [];


addTaskButton.addEventListener("click", () => {
  const taskName = taskNameInput.value.trim();
  const taskTime = parseInt(taskTimeInput.value);

  if (!taskName || isNaN(taskTime) || taskTime <= 0) {
    alert("Please enter a valid task name and time.");
    return;
  }

 
  const task = {
    id: Date.now(),
    name: taskName,
    time: taskTime * 60, 
    timer: null,
    status: "active",
    notificationShown: false 
  };

  tasks.push(task);
  renderTasks();
  resetInputs();
});


function renderTasks() {
  taskList.innerHTML = ""; 
  tasks.forEach(task => {
    const taskItem = document.createElement("div");
    taskItem.classList.add("task-item");

    const taskName = document.createElement("span");
    taskName.textContent = task.name;

    const taskTime = document.createElement("span");
    taskTime.classList.add("task-time");
    taskTime.textContent = formatTime(task.time);

    const startButton = document.createElement("button");
    startButton.textContent = "Start Timer";
    startButton.addEventListener("click", () => startTaskTimer(task));

    const endButton = document.createElement("button");
    endButton.textContent = "End Task";
    endButton.addEventListener("click", () => endTask(task));

    taskItem.append(taskName, taskTime, startButton, endButton);
    taskList.appendChild(taskItem);
  });
}


function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${padZero(hours)}:${padZero(minutes)}:${padZero(secs)}`;
}


function padZero(num) {
  return num < 10 ? `0${num}` : num;
}


function startTaskTimer(task) {
  if (task.status !== "active") return; 

  task.status = "in-progress";
  task.timer = setInterval(() => {
    if (task.time <= 0) {
      clearInterval(task.timer);
      task.status = "completed";
      task.timer = null;
      if (!task.notificationShown) {
        showNotification(task.name);
        task.notificationShown = true;
      }
    } else {
      task.time--;
      renderTasks();
    }
  }, 1000);
}


function endTask(task) {
  if (task.timer) {
    clearInterval(task.timer);
    task.status = "completed";
    task.timer = null;
    task.time = 0; 
    if (!task.notificationShown) {
      showNotification(task.name);
      task.notificationShown = true;
    }
  }
  renderTasks();
}


function showNotification(taskName) {
  const notification = document.createElement("div");
  notification.classList.add("notification");
  notification.textContent = `Task "${taskName}" is complete!`;

  notificationArea.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 5000);
}


function resetInputs() {
  taskNameInput.value = "";
  taskTimeInput.value = "";
}
