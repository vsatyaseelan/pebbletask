
const tasks=[];
let taskId = 0;

// Input fields in the new task modal
const taskTitle = document.querySelector('#taskTitle');
const taskDescription = document.querySelector('#taskDescription');
const taskAssignedTo = document.querySelector('#taskAssignedTo');
const taskDueDate = document.querySelector('#taskDueDate');
const taskDueTime = document.querySelector('#taskDueTime');

//Status radio button
const done = document.querySelector('#statusDone'); // Done
const review = document.querySelector('#statusReview'); // Review
const inProgress = document.querySelector('#statusInProgress'); // In Progress
const toDo = document.querySelector('#statusToDo'); // To Do

const newToDo = document.querySelector("#newToDo"); // input box for new task
const openNewTask = document.querySelector("#openForm"); // add task button to open new task form
const taskForm = document.querySelector("#taskForm"); // new task form

const taskContainer = document.querySelector("#tasks"); // container to display tasks
const taskModalForm = document.querySelector("#taskForm"); // new task form


// New Task Input Box
openNewTask.addEventListener("click", function(event){ // add button clicked
  clearAllFieldValues(); // all fields are cleared to null and radio button false
  clearValidations(); // validation span cleared from the form
  taskTitle.value = newToDo.value; // value from input box passed to new task title
  if(taskTitle.value && taskTitle.value.length > 8){
    taskTitle.classList.add("is-valid"); // if task title is more than 8 characters, is-valid class assigned
  } else {
    taskTitle.classList.add("is-invalid"); // else task title is-invalid is assigned
  }
  newToDo.value = null; //input box becomes null
});

function clearAllFieldValues(){ // clears all fields value and assigned false (fresh)
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

function clearValidations(){ // removes both is-invalid and is-valid class from all the fields
  taskTitle.classList.remove("is-invalid", "is-valid");
  taskDescription.classList.remove("is-invalid", "is-valid");
  taskAssignedTo.classList.remove("is-invalid", "is-valid");
  taskDueDate.classList.remove("is-invalid", "is-valid");
}


taskModalForm.addEventListener("submit", saveButtonClicked); // on clicking submit button on the new task form, saveButtonClicked function called

function saveButtonClicked(event){
  event.preventDefault(); // prevent default action for the submit button to trigger
  const title = taskTitle.value; // assign values from input box to the array
  const description = taskDescription.value;
  const assignedTo = taskAssignedTo.value;
  const date = taskDueDate.value;
  const time = taskDueTime.value;
  const status = selectedStatus(); // returns value for the radio button depending on the selection

  if(validationTaskForm(title, description, assignedTo, date, status)){ // check all parameters passed to this function
    if(!taskForm.classList.item(0)){ // if index does not match, go to add task
    addTask(title,description,assignedTo, date, time, status); // add task function
    } else {
    const id = taskForm.classList.item(0); // assigns array position 0 to the id (id=0)
    const task = {title, description, assignedTo, date, time, status, id};
    editTask(task); // if index match, go to edit task
    taskForm.classList.remove(`${id}`); // removed the class if from the task form
    }
    $("#newTaskInput").modal("hide"); // new task modal hidden
  }  else {
    alert("Please complete all fields."); // else alert to complete all fields
  }
}

// Add task function
function addTask(title,description,assignedTo, date, time,status){ // take all input fields parameters
  taskId++; // generated id = id + 1
  const task = {title,description,assignedTo, date, time, status, id:taskId}; // assign all values including id to task
  tasks.push(task); // push task to the tasks array
  refreshPage(); // refresh the page (clears inner HTML and list the updated array)
  clearAllFieldValues(); // clear all field value and assign null to fields and false to radio button value
  clearValidations(); // removes all is-invalid and is-valid classes to the span elements
  statusStats() // updates status counter
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
  validation(notEmptyLongerThan(8));
});
taskDescription.addEventListener("input", function(event){
  validation(notEmptyLongerThan(15));
});
taskAssignedTo.addEventListener("input", function(event){
  validation(notEmptyLongerThan(8));
});
taskDueDate.addEventListener("input", function(event){
  const today = todayConvertor();
  const dueDate = new Date(event.target.value);
  validation(today <= dueDate);
})

// returns today's date with hours
function todayConvertor(){
  const today = new Date(); // get today's date 
  return today.setHours(0,0,0,0); // get current time
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

function notEmptyLongerThan (number){
  return event.target.value && event.target.value.length > number;
}

function validationTaskForm(title, description, assignedTo, date, status){
  const dueDate = new Date(date); // assign today's date by default to calendar picker
  const today = todayConvertor(); // assign current time by default
  if(title && title.length > 8){  // if title length is more than 8 characters
    if(description && description.length > 15){ // if description is more than 15 characters
      if(assignedTo && assignedTo.length > 8){ // if assignedTo is more than 8 characters
        if(dueDate && today <= dueDate ){ // **
          if(status){ // if status is true
            return true; // validationTaskForm returns true
          }  
        }
      }
    }
  }
  return false; // else return false
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
  totalNumber.innerHTML = `${tasks.length}`; // gets total tasks in the array
  counterDone.querySelector("span").innerHTML=`${tasks.filter(task => task.status === "status-done").length}`; // done status counter
  counterInReview.querySelector("span").innerHTML=`${tasks.filter(task => task.status === "status-review").length}`; // in review status counter
  counterInProgress.querySelector("span").innerHTML=`${tasks.filter(task => task.status === "status-inProgress").length}`; // in progress status counter
  counterToDo.querySelector("span").innerHTML=`${tasks.filter(task => task.status === "status-toDo").length}`; // to do status counter
}

function editTask(task){
  tasks.splice(findTaskIndex(task),1,task);
  refreshPage();
  clearAllFieldValues();
  clearValidations();
  statusStats();
}

function refreshPage(){
  clearAll();  // clear innerHTML
  tasks.forEach(task => addTaskToPage(task)); // list all current tasks from array
}

function clearAll(){
  taskContainer.innerHTML = ""; // clears innerHTML
}

function addTaskToPage(task){  // adds HTML element to the page

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