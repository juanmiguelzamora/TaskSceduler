function signOut() {
    // Redirect the user back to the login page
    alert("are you sure to log out?")
    window.location.href = 'login.html'; // Change 'login.html' to your actual login page
  }


// addTask function
function addTask() {
    var taskInput = document.getElementById("taskInput");
    var dueDate = document.getElementById("dueDate");
    var taskList = document.getElementById("taskList");
    var prioritySelect = document.getElementById("prioritySelect");

    // Get the current date and time
    var now = new Date();

// Format the current date and time as required by the input type
    var currentDateTime = now.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:mm (e.g., "2024-04-20T08:00")

// Set the min attribute of the dueDate input field
    document.getElementById("dueDate").min = currentDateTime;



    if (taskInput.value === "" || dueDate.value === "") {
        alert("Please enter a task and due date.");
        return;
    }
      // Calculate the difference between due date and current date in milliseconds
      var currentDate = new Date();
      var dueDateString = dueDate.value;
      var dueDateObject = new Date(dueDateString);
      
      var timezoneOffset = 8 * 60 * 60 * 1000; // Convert minutes to milliseconds
      var adjustedDueDate = new Date(dueDateObject.getTime() + timezoneOffset);
  
  
      var timeDifference = adjustedDueDate - currentDate;
   
       // Define threshold for close to due date (e.g., 24 hours in milliseconds)
      var threshold = 24 * 60 * 60 * 1000; // 24 hours
      var adjustedDueDate = new Date(dueDateString);
      
      // Create a new list item
      var li = document.createElement("li");
  
      // Create a span element for the priority text
      var prioritySpan = document.createElement("span");
      prioritySpan.textContent = prioritySelect.value + " priority ";
      prioritySpan.classList.add("priority-text", prioritySelect.value.toLowerCase());// Add a class for styling
  
       // Create a text node for the task name and due date
      var taskTextNode = document.createTextNode(taskInput.value + " - Due Date: " + dueDate.value + "  ");
  
       // Append the text node and priority span to the list item
      li.appendChild(taskTextNode);
      li.appendChild(prioritySpan);
  
  
       // Check if the task is close to the due date
      if (timeDifference <= threshold && timeDifference > 0) {
          // Create a span element for the notification
          var notificationSpan = document.createElement("span");
          notificationSpan.textContent = "Due Soon!";
          notificationSpan.classList.add("notification-text");
   
       // Append the notification span to the list item
          li.appendChild(notificationSpan);
      }
   // var li = document.createElement("li");
   // li.textContent = taskInput.value + " - Due Date: " + dueDate.value + " - Priority " + prioritySelect.value;

    li.classList.add("priority-" + prioritySelect.value);

    var editInput = document.createElement("input");
    editInput.type = "text";
    editInput.style.display = "none";
    li.appendChild(editInput);

    var doneButton = document.createElement("button");
    doneButton.textContent = "Done";
    doneButton.className = "done-Button";
    doneButton.onclick = function() {
        if (li.classList.contains("completed")) {
            li.classList.remove("completed");
        } else {
            li.classList.add("completed");
        }
        updateTaskCount();
        saveTasks();
    };
    li.appendChild(doneButton);

    var deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-Button";
    deleteButton.onclick = function() {
        taskList.removeChild(li);
        updateTaskCount();
        saveTasks();
    };
    li.appendChild(deleteButton);

    taskList.appendChild(li);

    taskInput.value = "";
    dueDate.value = "";
    updateTaskCount();
    saveTasks();
}

// clearTasks function
function clearTasks() {
    var taskList = document.getElementById("taskList");
    taskList.innerHTML = "";
    updateTaskCount();
}

// editTask function
function editTask(event) {
    var target = event.target;
    if (target.tagName === "LI") {
        var editInput = target.querySelector("input[type=text]");
        var taskName = target.firstChild;
        editInput.value = taskName.textContent.split(" - ")[0];
        editInput.style.display = "inline";
        taskName.style.display = "none";
        editInput.onblur = function() {
            taskName.textContent = editInput.value + " - Due Date: " + taskName.textContent.split(" - ")[1];
            editInput.style.display = "none";
            taskName.style.display = "inline";
        };
    }
}

// saveTasks function
function saveTasks() {
    var taskList = document.getElementById("taskList");
    var tasks = taskList.innerHTML;
    localStorage.setItem("tasks", tasks);
}


function loadTasks() {
    var taskList = document.getElementById("taskList");
    taskList.innerHTML = localStorage.getItem("tasks");
    updateTaskCount();

    var doneButtons = document.querySelectorAll("#taskList li button:nth-child(2)");
    doneButtons.forEach(function(button) {
        button.onclick = function() {
            var li = button.parentElement;
            if (li.classList.contains("completed")) {
                li.classList.remove("completed");
            } else {
                li.classList.add("completed");
            }
            updateTaskCount();
            saveTasks();
        };
    });

    var deleteButtons = document.querySelectorAll("#taskList li button:nth-child(3)");
    deleteButtons.forEach(function(button) {
        button.onclick = function() {
            var li = button.parentElement;
            taskList.removeChild(li);
            updateTaskCount();
            saveTasks();
        };
    });

}

// filterTasks function
function filterTasks(status) {
    var taskList = document.getElementById("taskList");
    var tasks = taskList.children;

    for (var i = 0; i < tasks.length; i++) {
        var task = tasks[i];
        if (status === "pending" && task.classList.contains("completed")) {
            task.style.display = "none";
        } else if (status === "completed" && !task.classList.contains("completed")) {
            task.style.display = "none";
        } else {
            task.style.display = "block";
        }
    }
}

// updateTaskCount function
// updateTaskCount function
function updateTaskCount() {
    var taskList = document.getElementById("taskList");
    var tasks = taskList.children;
    var totalTasks = tasks.length;
    var completedTasks = document.querySelectorAll(".completed").length;
    var pendingTasks = totalTasks - completedTasks;
    
    // Calculate the number of missing tasks
    var now = new Date(); // Current date and time
    var missingTasks = Array.from(tasks).filter(task => {
        // Parse due date from task text content
        var dueDateString = task.textContent.split(" - Due Date: ")[1];
        var dueDate = new Date(dueDateString);
        // Check if the task is not completed and its due date is in the past
        return !task.classList.contains('completed') && dueDate < now;
    }).length;

    var taskCountElement = document.getElementById("taskCount");
    taskCountElement.textContent = "Total Tasks: " + totalTasks + ", Completed: " + completedTasks + ", Pending: " + pendingTasks + ", Missing: " + missingTasks;

    // Show notification if there are missing tasks
    if (missingTasks > 0) {
        showNotification("Missing Tasks", "You have " + missingTasks + " tasks that are overdue.");
    }
}

// add animation to the Add Task button
document.getElementById("addTaskBtn").addEventListener("click", function() {
    var addButton = document.getElementById("addTaskBtn");
    addButton.style.animation = "buttonAnimation 0.5s ease";
    addButton.addEventListener("animationend", function() {
        addButton.style.animation = "none";
    });
});

window.onload = function() {
    loadTasks();
}

// toggleMenu function
function toggleMenu() {
    var menu = document.querySelector('.slide-menu');
    menu.style.left = menu.style.left === '-250px' ? '0' : '-250px';
}

// missingBtn function
function missingBtn() {
    // Filter tasks to find the missing ones
    var missingTasks = tasks.filter(task => !task.completed && new Date(task.dueDate) < new Date());

    // Display only missing tasks
    displayTasks(missingTasks);

    // Highlight the "Missing" button
    document.getElementById('missingBtn').classList.add('active');
    document.getElementById('pendingBtn').classList.remove('active');
    document.getElementById('completeBtn').classList.remove('active');
}
function showNotification(title, body) {
    // Check if the browser supports notifications
    if (!("Notification" in window)) {
        console.log("This browser does not support desktop notification");
    }

    // Check if the user has granted permission to show notifications
    else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        var notification = new Notification(title, { body: body });
    }

    // Otherwise, ask the user for permission
    else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(function (permission) {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                var notification = new Notification(title, { body: body });
            }
        });
    }
}
