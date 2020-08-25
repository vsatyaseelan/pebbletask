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

class Task {
  constructor(id, title, description, assignedTo, date, time, status) {
      this.id = id;
      this.title = title;
      this.description = description;
      this.assignedTo = assignedTo;
      this.date = date;
      this.time = time;
      this.status = status;
  }
}

class TaskManager {
  constructor() {
    this.tasks=[];

    // Local Storage
    this.taskId = parseInt(localStorage.getItem('taskId')) || 1;
    localStorage.setItem('taskId',this.taskId);
  }

  addTask(title, description, assignedTo, date, time, status){ // take all input fields parameters
    this.taskId++; // generated id = id + 1
    const task = new Task(this.taskId, title, description, assignedTo, date, time, status); // assign all values including id to task
    this.tasks.push(task); // push task to the tasks array
    refreshPage(); // refresh the page (clears inner HTML and list the updated array)
    clearAllFieldValues(); // clear all field value and assign null to fields and false to radio button value
    clearValidations(); // removes all is-invalid and is-valid classes to the span elements
    statusStats() // updates status counter

    // Add to local storage
    localStorage.setItem('taskId', this.taskId);
    let mynewtasks = JSON.parse(localStorage.getItem("mytasks")) || [];
    mynewtasks.push(task);
    localStorage.setItem("mytasks", JSON.stringify(mynewtasks));
  }

  editTask(task){
    this.tasks.splice(findTaskIndex(task),1,task); // at position of the index, remove 1 item and add task
    refreshPage(); // clear innerHTML and add the updated array
    clearAllFieldValues(); // clear all field value and make modal empty
    clearValidations(); // clears all validation classes and span
    statusStats(); // update status counter button on HTML
  }

  deleteTask(task){
    let taskIndex = findTaskIndex(task);
    let id = this.tasks[taskIndex].id;
    alert(id);
    this.tasks.splice(taskIndex,1); // deletes one index from the tasks array that matched the taskIndex
    
    // Local Storage - Delete
    let mynewtasks = JSON.parse(localStorage.getItem("mytasks"));
    //alert(mynewtasks.length);
    for (let i = 0; i < mynewtasks.length; i++) {
      alert(mynewtasks.length);
      alert(id);
             alert(mynewtasks[i].id);
        if (mynewtasks[i].id == id) {
             // delete from local storage
            //  alert(taskIndex);
            //  alert(mynewtasks[i].id);
             mynewtasks.splice(i, 1);
             localStorage.setItem("mytasks",JSON.stringify(mynewtasks));
             break;
        }
    }

    refreshPage(); // clear innerHTML and creates a list of all the items in the array
    statusStats(); // update status counter buttons
  }

  
}

const taskManager = new TaskManager(taskContainer);                       // created an instance of class Task Manager

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
  toDo.checked = true;
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
    taskManager.addTask(title, description, assignedTo, date, time, status); // add task function
    } else {
    const id = taskForm.classList.item(0); // assigns array position 0 to the id (id=0)
    const task = {id, title, description, assignedTo, date, time, status};
    taskManager.editTask(task); // if index match, go to edit task

    // Local Storage Update Task
  
    let mynewtasks = JSON.parse(localStorage.getItem("mytasks"));
    alert(mynewtasks.length);
    for (let i = 0; i < mynewtasks.length; i++) {
      alert(mynewtasks[i].id);
      alert(id);
      if (mynewtasks[i].id == id) {
        alert("Inside For Loop");
        mynewtasks[i].title = title;
    mynewtasks[i].description = description;
    mynewtasks[i].assignedTo = assignedTo;
    mynewtasks[i].date = date;
    mynewtasks[i].time = time;
    mynewtasks[i].status = status;
    localStorage.setItem("mytasks", JSON.stringify(mynewtasks));
    break;
      }
    }

    taskForm.classList.remove(`${id}`); // removed the class id from the task form
    }
    $("#newTaskInput").modal("hide"); // new task modal hidden
  }  else {
    alert("Please complete all fields."); // else alert to complete all fields
  }
  refreshPage(); // clear innerHTML and creates a list of all the items in the array
    statusStats(); // update status counter buttons
}

const formCancel=document.querySelector("#cancelButton"); // assign modal cancel button to the variable
const formClose=document.querySelector("#close"); // assign modal close button to the variable

formCancel.addEventListener("click", function(event){
  const id = taskForm.classList.item(0); // assign array index to the modal
  if (id){
  taskForm.classList.remove(`${id}`); // remove the id class from the modal
  }
});

formClose.addEventListener("click", function(event){
  const id = taskForm.classList.item(0); // assign array index to the modal
  if (id){
  taskForm.classList.remove(`${id}`); // remove the id class from the modal
  }
});

// Status return
function selectedStatus(){

  if (done.checked){
    return done.value; // returns values of "Done"
  } else if (review.checked) {
    return review.value; // returns value of "In Review"
  } else if (inProgress.checked) {
    return inProgress.value; // returns value of "status-InProgress"
  } else if (toDo.checked) {
    return toDo.value; // returns value of "Done"
  } else {
    return false;
  }
}

//  Validation on input for boolean and assign class accordingly (is-invalid // is-valid)

// checks if the title is more than 8 characters
taskTitle.addEventListener("input", function(event){ 
  validation(notEmptyLongerThan(8));
});

// checks if the task description is more than 15 characters
taskDescription.addEventListener("input", function(event){
  validation(notEmptyLongerThan(15));
});

// checks if the assigned to is more than 8 characters
taskAssignedTo.addEventListener("input", function(event){
  validation(notEmptyLongerThan(8));
});

// checks if the due date is in the future
taskDueDate.addEventListener("input", function(event){
  const today = todayConvertor(); // get today's date
  const dueDate = new Date(event.target.value); // get due date
  validation(today <= dueDate); // returns value of boolean and assign class
})

// returns today's date with hours
function todayConvertor(){
  const today = new Date(); // get today's date 
  return today.setHours(0,0,0,0); // get current time
}

// validations boolean and remove/add class to element accordingly
function validation(boolean){
  if(boolean){
    event.target.classList.remove("is-invalid"); // remove class from element
    event.target.classList.add("is-valid"); // add class to element
  } else {
    event.target.classList.remove("is-valid"); // remove class from element
    event.target.classList.add("is-invalid"); // add class to elements
  }
};

//validation to check if value and length of characters are more than the (number)
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
const counterTotalTask = document.querySelector("#counterTotalTask"); // assign All Tasks button to counterTotalTask
const totalNumber = document.querySelector("#counterTotalTask > span"); // assign span inside All Task Counter to totalNumber
counterTotalTask.addEventListener("click", getAllTask); // onclick of All Tasks button
function getAllTask(){
  clearAll(); // clears innerHTML 
  taskManager.tasks.forEach(task => addTaskToPage(task)); // displays each task from the array
  totalNumber.innerHTML = `${taskManager.tasks.length}`; // All Tasks total number is the length of the array
}

// Counter for Done
const counterDone = document.querySelector("#counterDone"); // assign Done button to counterDone variable
counterDone.addEventListener("click", function(){ // onclick Done button
  filterTaskStatus("Done"); // clears innerHTML, display all tasks with status === done
});

// Counter for Review
const counterInReview = document.querySelector("#counterInReview"); // assign In Review button to counterInReview variable
counterInReview.addEventListener("click", function(){ // onclick In Review button
  filterTaskStatus("In Review"); // clears innerHTML, display all tasks with status === review
});

// Counter for In Progress
const counterInProgress = document.querySelector("#counterInProgress"); // assign In Progress button to counterInProgress variable
counterInProgress.addEventListener("click", function(){ // onclick In Progress button
  filterTaskStatus("In Progress"); // clears innerHTML, display all tasks with status === inProgress
});

// Counter for To Do
const counterToDo = document.querySelector("#counterToDo"); // assign To Do button to counterToDo variable
counterToDo.addEventListener("click", function(){ // onclick To Do button
  filterTaskStatus("To Do"); // clears innerHTML, display all tasks with status === To Do
});


function filterTaskStatus(status){
  clearAll(); // clears innerHTML
  taskManager.tasks.forEach(function (task){ // display all task when passed parameter matches the status in the array
    if (status === task.status){addTaskToPage(task)};
  });
}

const findTaskIndex = (task) => // finding index of a task
  taskManager.tasks.findIndex(taskInArray => (taskInArray.id == task.id)); // returns the first index that matches the parameter

function statusStats(){
  totalNumber.innerHTML = `${taskManager.tasks.length}`; // gets total tasks in the array
  counterDone.querySelector("span").innerHTML=`${taskManager.tasks.filter(task => task.status === "Done").length}`; // done status counter
  counterInReview.querySelector("span").innerHTML=`${taskManager.tasks.filter(task => task.status === "In Review").length}`; // in review status counter
  counterInProgress.querySelector("span").innerHTML=`${taskManager.tasks.filter(task => task.status === "In Progress").length}`; // in progress status counter
  counterToDo.querySelector("span").innerHTML=`${taskManager.tasks.filter(task => task.status === "To Do").length}`; // to do status counter
}

function refreshPage(){
  clearAll();  // clear innerHTML
  let mynewtasks = JSON.parse(window.localStorage.getItem('mytasks')) || taskManager.tasks;
  mynewtasks.forEach(task => addTaskToPage(task)); // list all current tasks from array


}

function clearAll(){
  taskContainer.innerHTML = ""; // clears innerHTML
}

function addTaskToPage(task){  // adds HTML element to the page

  // assign all the HTML Element code to html
  const html = `

  <div class="task" id="task${task.id}">
    <div class="row">

      <div class="taskTitle col-lg-4 order-1 col-sm">
          <p class="text-left d-inline">
            <span class="h6 font-weight-bold">${task.title}</span> 
          
            <a href="#task${task.id}Description" class="text-primary ml-1 pl-0 small" data-toggle="collapse" data-target="#task${task.id}Description"><i class="fas fa-plus-circle fa-lg iconFloat"></i></a>
          </p>
      </div>
      
      <div class="col-lg-8 order-2">
        <ul class="row taskSummary">

          <li class="order-3 col-sm col-md">
            <span class="spanDateTime">${task.date}</span>
          </li>

          <li class="order-4 col-sm col-md">
            <span>${task.time}</span>
          </li>
        
          <li class="order-5 col-sm col-md">
            <span class="badge badgeColor${task.status}">${task.status}</span>
          </li>
        
          <li class="order-6 col-sm col-md">
          ${task.assignedTo}
          </li>
        
          <li class="order-7 col-sm col-md">
            <form class="removeBin" action="" method="post">
              <a href="#newTaskInput" id="editTaskButton" role=button class="d-inline btn btn-link ml-0 pl-0 mb-0 pb-0" data-toggle="modal" title="Edit Task" data-target="#newTaskInput">
              <i class="fas fa-pen-square text-dark iconFloat fa-lg"></i></a>

              <input type="checkbox" class="ml-2 pl-0 border border-info">
              
              <button type="button" class="ml-3 pl-0 btn btn-link removeBin" id="deleteSingleTask" data-toggle="" data-placement="top" title="Delete This Task"><i class="fas fa-trash-alt fa-lg iconFloat iconDelete "></i>
              </button>
             
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
  
 const taskElement = document.createRange().createContextualFragment(html); // passing html fragment to the page
 
 const editTaskOnPage = taskElement.querySelector("#editTaskButton"); // assign Edit Task button to a variable
  editTaskOnPage.addEventListener("click", function(){ // onclick of edit task button
    clearAllFieldValues(); // clear all field values from modal form
    clearValidations(); // clear all validation spans
    taskForm.classList.add(task.id); // task form class added with the task id index
    taskTitle.value = task.title; // task title assigned to taskTitle.value
    taskDescription.value = task.description; // task description assigned to taskAssigned.value
    taskAssignedTo.value = task.assignedTo; // task assignedTo assigned to taskAssignedTo.value
    taskDueDate.value = task.date; // task date assigned to taskDueDate.value
    taskDueTime.value = task.time; // task time assigned to taskDueTime.value
    
    switch (task.status) { // checks if the task status matches with the case, if not default is selected
      case 'Done': done.checked = true;
      break;
      case 'In Review': review.checked  = true;
      break;
      case 'In Progress': inProgress.checked  = true;
      break;
      default: toDo.checked  = true; // by default, To Do is selected 
    }

  });

  const deleteTaskOnPage = taskElement.querySelector('#deleteSingleTask'); // deletes single task on the page
  deleteTaskOnPage.addEventListener("click", function(){ // onclick of the delete single task icon
    taskManager.deleteTask(task); // deletes the task of the given index
    deleteTaskOnPage.closest("div.task").remove(); // removes closed div in the task class
  });

  const checkbox = taskElement.querySelector('.removeBin > input[type="checkbox"]'); // assign checkbox in the removeBin class to checkbox variable
  const clearSelected = document.querySelector("#clearSelected"); // assign Clear Selected button to clearSelected
  clearSelected.addEventListener('click', checkboxClicked); // onclick of clear selected button, executed checkboxClicked function

  function checkboxClicked (event){ // executed on Clear Selectd button onclick
       if (checkbox.checked){ // if the checkbox is checked
        taskManager.deleteTask(task); // deletes the task of the given index
          checkbox.closest("div.task").remove(); // removes the closes div in the task class
          clearSelected.removeEventListener('click', checkboxClicked); // removes previously registered event listener
           }
         }
         
  taskContainer.append(taskElement); // append taskElement to the taskContainer in the HTML page
  
}

$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

// Day and Date
var d = new Date(); // get the system date and store in variable

var weekday = new Array(7); // store 7 days of a week in an array
weekday[0] = "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";
var day = weekday[d.getDay()]; // get current day

var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]; // store months in an array
var todayMonth = months[d.getMonth()]; // get current month

const nth = function(n) { // displays *st, *nd, *rd, *th depending on the date
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
var todayFullDate = todayDate + nth(todayDate) + " " + todayMonth + " " + year + " - Happy " + day + "!";
document.querySelector("#todayDate").innerHTML = todayFullDate;


refreshPage();
// Sample data for testing

// taskManager.addTask("Scrum Meeting",
// `Daily Scrum Meeting with the Development Team`,
// "Dominic Jr",
// "2020-08-31",
// "05:15",
// "Done");

// taskManager.addTask("Task Planning",
// `Task Planning Meeting with the Planning Team`,
// "Alvin Anderson",
// "2020-09-06",
// "02:05",
// "In Review");

// taskManager.addTask("UX/UI Design Final",
// `Final meeting for UX/UI Design`,
// "Billy Jean",
// "2020-09-15",
// "07:30",
// "In Progress");

// taskManager.addTask("End of Sprint Meeting",
// `Meeting Team and Product Owner`,
// "Wendy Jane",
// "2020-10-07",
// "09:45",
// "To Do");