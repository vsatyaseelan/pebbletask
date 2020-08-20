
const tasks=[];
let taskId = 0;

//taskDetails
const taskTitle = document.querySelector('#taskTitle');
const taskDescription = document.querySelector('#taskDescription');
const taskAssignedTo = document.querySelector('#taskAssignedTo');
const taskDueDate = document.querySelector('#taskDueDate');
const taskDueTime = document.querySelector('#taskDueTime');

//Status
const done = document.querySelector('#statusDone');
const review = document.querySelector('#statusReview');
const inProgress = document.querySelector('#statusInProgress');
const toDo = document.querySelector('#statusToDo');
const newToDo = document.querySelector("#newToDo");
const openNewTask = document.querySelector("#openForm");
const taskForm = document.querySelector("#taskForm");

const taskContainer = document.querySelector("#tasks");
const taskModalSaveButton = document.querySelector("#taskForm");

openNewTask.addEventListener("click", function(event){
  clearAllFieldValues();
  clearValidations();
  taskTitle.value = newToDo.value;
  if(taskTitle.value && taskTitle.value.length > 8){
    taskTitle.classList.add("is-valid");
  } else {
    taskTitle.classList.add("is-invalid");
  }
  newToDo.value = null;
});

function clearAllFieldValues(){
  taskTitle.value = null;
  taskDescription.value = null;
  taskAssignedTo.value = null;
  taskDueDate.value = null;
  taskDueTime.value = null;
  
  done.checked = false;
  review.checked = false;
  inProgress.checked = false;
  toDo.checked = false;
}
function clearValidations(){
  taskTitle.classList.remove("is-invalid", "is-valid");
  taskDescription.classList.remove("is-invalid", "is-valid");
  taskAssignedTo.classList.remove("is-invalid", "is-valid");
  taskDueDate.classList.remove("is-invalid", "is-valid");
}


taskModalSaveButton.addEventListener("submit",saveButtonClicked);

function addTask(title,description,assignedTo, date, time,status){
  taskId++;
  const task = {title,description,assignedTo, date, time, status, id:taskId};
  tasks.push(task);
  refreshPage();
  clearAllFieldValues();
  clearValidations();
  statusStats()
}

function saveButtonClicked(event){
  event.preventDefault();
  const title = taskTitle.value;
  const description = taskDescription.value;
  const assignedTo = taskAssignedTo.value;
  const date = taskDueDate.value;
  const time = taskDueTime.value;
  const status = selectedStatus();

  if(validationTaskForm(title,description,assignedTo, date, status)){
    if(!taskForm.classList.item(0)){
    addTask(title,description,assignedTo, date, time, status);
    } else {
    const id = taskForm.classList.item(0);
    const task = {title, description, assignedTo, date, time, status, id};
    editTask(task);
    taskForm.classList.remove(`${id}`);
    }
    $("#newTaskInput").modal("hide");
  }  else {
    alert("Please complete all fields.");
  }
}

const formCancel=document.querySelector("#cancelButton");
const formClose=document.querySelector("#close");
formCancel.addEventListener("click", function(event){
  const id = taskForm.classList.item(0);
  if (id){
  taskForm.classList.remove(`${id}`);
  }
});
formClose.addEventListener("click", function(event){
  const id = taskForm.classList.item(0);
  if (id){
  taskForm.classList.remove(`${id}`);
  }
});

// Status return

function selectedStatus(){

  if (done.checked){
    return done.value;
  } else if (review.checked) {
    return review.value;
  } else if (inProgress.checked) {
    return inProgress.value;
  } else if (toDo.checked) {
    return toDo.value;
  } else {
    return false;
  }
}

taskTitle.addEventListener("input", function(event){
  validation(notEmptyandLongerThan(8));
});
taskDescription.addEventListener("input", function(event){
  validation(notEmptyandLongerThan(15));
});
taskAssignedTo.addEventListener("input", function(event){
  validation(notEmptyandLongerThan(8));
});
taskDueDate.addEventListener("input", function(event){
  const today = todayConvertor();
  const dueDate = new Date(event.target.value);
  validation(today <= dueDate);
})

function todayConvertor(){
  const today = new Date();
  return today.setHours(0,0,0,0);
}


function validation(boolean){
  if(boolean){
    event.target.classList.remove("is-invalid");
    event.target.classList.add("is-valid");
  } else {
    event.target.classList.remove("is-valid");
    event.target.classList.add("is-invalid");
  }
};
function notEmptyandLongerThan (number){
  return event.target.value && event.target.value.length > number;
}
function validationTaskForm(title,description,assignedTo, date, status){
  const dueDate = new Date(date);
  const today = todayConvertor();
  if(title && title.length > 8){
    if(description && description.length > 15){
      if(assignedTo && assignedTo.length > 8){
        if(dueDate && today <= dueDate ){
            if(status){
              return true;
            }
        }
      }
    }
  }
  return false;
}

// Total Counter - All Task
const counterTotalTask = document.querySelector("#counterTotalTask");
const totalNumber = document.querySelector("#counterTotalTask > span");
counterTotalTask.addEventListener("click", getAllTask);
function getAllTask(){
  clearAll();
  tasks.forEach(task => addTaskToPage(task));
  totalNumber.innerHTML = `${tasks.length}`;
}

// Counter for Done
const counterDone = document.querySelector("#counterDone");
counterDone.addEventListener("click", function(){
  getTasksWithStatus("status-done");
});

// Counter for Review
const counterInReview = document.querySelector("#counterInReview");
counterInReview.addEventListener("click", function(){
  getTasksWithStatus("status-review");
});

// Counter for In Progress
const counterInProgress = document.querySelector("#counterInProgress");
counterInProgress.addEventListener("click", function(){
  getTasksWithStatus("status-inProgress");
});

// Counter for To Do
const counterToDo = document.querySelector("#counterToDo");
counterToDo.addEventListener("click", function(){
  getTasksWithStatus("status-toDo");
});


function getTasksWithStatus(status){
  clearAll();

  tasks.forEach(function (task){
    if (status === task.status){addTaskToPage(task)};
  });
}
const findTaskIndex = (task) => tasks.findIndex(taskInArray => (taskInArray.id == task.id));

function deleteTask(task){
  let taskIndex = findTaskIndex(task);
  tasks.splice(taskIndex,1);
  refreshPage();
  statusStats();
}
function statusStats(){
  totalNumber.innerHTML = `${tasks.length}`;
  counterDone.querySelector("span").innerHTML=`${tasks.filter(task => task.status === "status-done").length}`;
  counterInReview.querySelector("span").innerHTML=`${tasks.filter(task => task.status === "status-review").length}`;
  counterInProgress.querySelector("span").innerHTML=`${tasks.filter(task => task.status === "status-inProgress").length}`;
  counterToDo.querySelector("span").innerHTML=`${tasks.filter(task => task.status === "status-toDo").length}`;
}
function editTask(task){
  tasks.splice(findTaskIndex(task),1,task);
  refreshPage();
  clearAllFieldValues();
  clearValidations();
  statusStats();
}

function refreshPage(){
  clearAll();
  tasks.forEach(task => addTaskToPage(task));
}

function clearAll(){
  taskContainer.innerHTML = "";
}

function addTaskToPage(task){

  const html = `

  <div class="task" id="task${task.id}">
    <div class="row">
      <div class="taskTitle col-lg-6 order-1 order-lg-1 order-md-1 order-sm-1">
        
          <p class="text-left d-inline"><span class="h6 font-weight-bold">${task.title}</span> 
          <a href="#task${task.id}Description" class="text-secondary icon ml-0 pl-0 small" data-toggle="collapse" data-target="#task${task.id}Description"><i class="fas fa-plus-circle"></i></a></p>
      </div>
      <div class="col-lg-6 order-2 order-lg-2 order-md-2 order-sm-2">
        
      <ul class="row taskSummary justify-content-around">
        
        <li class="order-3 order-lg-3 order-md-3 order-sm-3 text-sm-right">
          ${task.date} - ${task.time}
        </li>
          
        <li class="order-4 order-lg-4 order-md-4 order-sm-4 text-left">
            <i class="icon fas fa-tag ${task.status}" data-toggle="tooltip" data-placement="top" title="Status"></i>
          </li>
        
          <li class="order-5 order-lg-5 order-md-5 order-sm-5 text-right">
          ${task.assignedTo}
          </li>
        
          <li class="order-6 order-lg-6 order-md-6 order-sm-6 text-right">
          <form class="bin" action="" method="post">
          <a href="#newTaskInput" id="editTaskButton" role=button class="d-inline btn btn-link col-2 ml-0 pl-0 mb-0 pb-0" data-toggle="modal" data-target="#newTaskInput">
          <i class="fas fa-pen-square"></i></a>
              <input type="checkbox" class="ml-3 pl-0 border border-info">
              <button type="button" class="ml-3 pl-0 btn btn-link bin" id="deleteSingleTask"><i class="icon fas fa-trash-alt"></i></button>
              </form>
          </li>

        </ul>
      </div>
    </div>
    <div id="task${task.id}Description" class="collapse order-2 order-lg-2 order-md-2 order-sm-2">
          ${task.description}
    </div>
    <hr>
  </div>`;
  
 const taskElement = document.createRange().createContextualFragment(html);
 const editTaskOnPage = taskElement.querySelector("#editTaskButton");
  editTaskOnPage.addEventListener("click", function(){
    clearAllFieldValues();
    clearValidations();
    taskForm.classList.add(task.id);
    taskTitle.value=task.title;
    taskDescription.value = task.description;
    taskAssignedTo.value = task.assignedTo;
    taskDueDate.value = task.date;
    taskDueTime.value =task.time;
    
    switch (task.status) {
      case 'status-done':
      done.checked = true;
      break;
      case 'status-review':
      review.checked  = true;
      break;
      case 'status-inProgress':
      inProgress.checked  = true;
      break;
      default:
      toDo.checked  = true;
    }
  });

  const deleteTaskOnPage = taskElement.querySelector('#deleteSingleTask');
  deleteTaskOnPage.addEventListener("click", function(){
    deleteTask(task);
    deleteTaskOnPage.closest("div.task").remove();
  });

  const checkbox = taskElement.querySelector('.bin > input[type="checkbox"]');
  const clearSelected = document.querySelector("#clearSelected");
  clearSelected.addEventListener('click', checkboxClicked);

  function checkboxClicked (event){
       if (checkbox.checked){
         deleteTask(task);
          checkbox.closest("div.task").remove();
          clearSelected.removeEventListener('click', checkboxClicked);
           }
         }
         
  taskContainer.append(taskElement);
  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  });
}

var d = new Date();

var weekday = new Array(7);
weekday[0] = "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";
var day = weekday[d.getDay()];

var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var todayMonth = months[d.getMonth()];

const nth = function(n) {
  if (n > 3 && n < 21) return 'th';
  switch (n % 10) {
    case 1:  return "st";
    case 2:  return "nd";
    case 3:  return "rd";
    default: return "th";
  }
}

var todayDate = d.getDate();
var year = d.getFullYear();
var todayFullDate = todayDate + nth(d.getMonth()) + " " + todayMonth + " " + year + " - Happy " + day + "!";
document.querySelector("#todayDate").innerHTML = todayFullDate;

addTask("Scrum Meeting",
`Daily Scrum Meeting with the Development Team`,
"Dominic Leightonfield",
"2020-08-31",
"05:15",
"status-done");

addTask("Task Planning",
`Task Planning Meeting with the Planning Team`,
"Alvin Anderson",
"2020-09-06",
"02:05",
"status-review");

addTask("UX/UI Design Final",
`Final meeting for UX/UI Design`,
"Billy Cunningham",
"2020-09-15",
"07:30",
"status-inProgress");

addTask("End of Sprint Meeting",
`Meeting Team and Product Owner`,
"Wendy Jane",
"2020-10-07",
"09:45",
"status-toDo");