// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"task.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Task = function Task(id, title, description, assignedTo, date, time, status) {
  _classCallCheck(this, Task);

  this.id = id;
  this.title = title;
  this.description = description;
  this.assignedTo = assignedTo;
  this.date = date;
  this.time = time;
  this.status = status;
};

exports.default = Task;
},{}],"taskmanager.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _task = _interopRequireDefault(require("./task.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var TaskManager = /*#__PURE__*/function () {
  function TaskManager() {
    _classCallCheck(this, TaskManager);

    this.tasks = []; // Local Storage

    this.taskId = parseInt(localStorage.getItem('taskId')) || 1;
    localStorage.setItem('taskId', this.taskId);
  }

  _createClass(TaskManager, [{
    key: "addTask",
    value: function addTask(title, description, assignedTo, date, time, status) {
      // take all input fields parameters
      this.taskId++; // generated id = id + 1

      var task = new _task.default(this.taskId, title, description, assignedTo, date, time, status); // assign all values including id to task

      this.tasks.push(task); // push task to the tasks array
      // refreshPage(); // refresh the page (clears inner HTML and list the updated array)
      // clearAllFieldValues(); // clear all field value and assign null to fields and false to radio button value
      // clearValidations(); // removes all is-invalid and is-valid classes to the span elements
      // statusStats() // updates status counter
      // Add to local storage

      localStorage.setItem('taskId', this.taskId);
      var mynewtasks = JSON.parse(localStorage.getItem("mytasks")) || [];
      mynewtasks.push(task);
      localStorage.setItem("mytasks", JSON.stringify(mynewtasks));
    }
  }, {
    key: "editTask",
    value: function editTask(task) {
      this.tasks.splice(findTaskIndex(task), 1, task); // at position of the index, remove 1 item and add task

      refreshPage(); // clear innerHTML and add the updated array

      clearAllFieldValues(); // clear all field value and make modal empty

      clearValidations(); // clears all validation classes and span

      statusStats(); // update status counter button on HTML
    }
  }, {
    key: "deleteTask",
    value: function deleteTask(task) {
      var taskIndex = findTaskIndex(task);
      var id = this.tasks[taskIndex].id;
      this.tasks.splice(taskIndex, 1); // deletes one index from the tasks array that matched the taskIndex
      // Local Storage - Delete

      var mynewtasks = JSON.parse(localStorage.getItem("mytasks")); //alert(mynewtasks.length);

      for (var i = 0; i < mynewtasks.length; i++) {
        if (mynewtasks[i].id == id) {
          mynewtasks.splice(i, 1);
          localStorage.setItem("mytasks", JSON.stringify(mynewtasks));
          break;
        }
      }

      refreshPage(); // clear innerHTML and creates a list of all the items in the array

      statusStats(); // update status counter buttons
    }
  }]);

  return TaskManager;
}();

exports.default = TaskManager;
},{"./task.js":"task.js"}],"script.js":[function(require,module,exports) {
"use strict";

var _taskmanager = _interopRequireDefault(require("./taskmanager.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Input fields in the new task modal
var taskTitle = document.querySelector('#taskTitle');
var taskDescription = document.querySelector('#taskDescription');
var taskAssignedTo = document.querySelector('#taskAssignedTo');
var taskDueDate = document.querySelector('#taskDueDate');
var taskDueTime = document.querySelector('#taskDueTime'); //Status radio button

var done = document.querySelector('#statusDone'); // Done

var review = document.querySelector('#statusReview'); // Review

var inProgress = document.querySelector('#statusInProgress'); // In Progress

var toDo = document.querySelector('#statusToDo'); // To Do

var newToDo = document.querySelector("#newToDo"); // input box for new task

var openNewTask = document.querySelector("#openForm"); // add task button to open new task form

var taskForm = document.querySelector("#taskForm"); // new task form

var taskContainer = document.querySelector("#tasks"); // container to display tasks

var taskModalForm = document.querySelector("#taskForm"); // new task form
// class Task {
//   constructor(id, title, description, assignedTo, date, time, status) {
//       this.id = id;
//       this.title = title;
//       this.description = description;
//       this.assignedTo = assignedTo;
//       this.date = date;
//       this.time = time;
//       this.status = status;
//   }
// }
// export default class TaskManager {
//   constructor() {
//     this.tasks=[];
//     // Local Storage
//     this.taskId = parseInt(localStorage.getItem('taskId')) || 1;
//     localStorage.setItem('taskId',this.taskId);
//   }
//   addTask(title, description, assignedTo, date, time, status){ // take all input fields parameters
//     this.taskId++; // generated id = id + 1
//     const task = new Task(this.taskId, title, description, assignedTo, date, time, status); // assign all values including id to task
//     this.tasks.push(task); // push task to the tasks array
//     // refreshPage(); // refresh the page (clears inner HTML and list the updated array)
//     // clearAllFieldValues(); // clear all field value and assign null to fields and false to radio button value
//     // clearValidations(); // removes all is-invalid and is-valid classes to the span elements
//     // statusStats() // updates status counter
//     // Add to local storage
//     localStorage.setItem('taskId', this.taskId);
//     let mynewtasks = JSON.parse(localStorage.getItem("mytasks")) || [];
//     mynewtasks.push(task);
//     localStorage.setItem("mytasks", JSON.stringify(mynewtasks));
//   }
//   editTask(task){
//     this.tasks.splice(findTaskIndex(task),1,task); // at position of the index, remove 1 item and add task
//     refreshPage(); // clear innerHTML and add the updated array
//     clearAllFieldValues(); // clear all field value and make modal empty
//     clearValidations(); // clears all validation classes and span
//     statusStats(); // update status counter button on HTML
//   }
//   deleteTask(task){
//     let taskIndex = findTaskIndex(task);
//     let id = this.tasks[taskIndex].id;
//     this.tasks.splice(taskIndex,1); // deletes one index from the tasks array that matched the taskIndex
//     // Local Storage - Delete
//     let mynewtasks = JSON.parse(localStorage.getItem("mytasks"));
//     //alert(mynewtasks.length);
//     for (let i = 0; i < mynewtasks.length; i++) {
//              if (mynewtasks[i].id == id) {
//              mynewtasks.splice(i, 1);
//              localStorage.setItem("mytasks",JSON.stringify(mynewtasks));
//              break;
//         }
//     }
//     refreshPage(); // clear innerHTML and creates a list of all the items in the array
//     statusStats(); // update status counter buttons
//   }
// }

var taskManager = new _taskmanager.default(taskContainer); // created an instance of class Task Manager
// New Task Input Box On Page Load

openNewTask.addEventListener("click", function (event) {
  // add button clicked
  clearAllFieldValues(); // all fields are cleared to null and radio button false

  clearValidations(); // validation span cleared from the form

  taskTitle.value = newToDo.value; // value from input box passed to new task title

  if (taskTitle.value && taskTitle.value.length > 8) {
    taskTitle.classList.add("is-valid"); // if task title is more than 8 characters, is-valid class assigned
  } else {
    taskTitle.classList.add("is-invalid"); // else task title is-invalid is assigned
  }

  newToDo.value = null; //input box becomes null
});

function clearAllFieldValues() {
  // clears all fields value and assigned false (fresh)
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

function clearValidations() {
  // removes both is-invalid and is-valid class from all the fields
  taskTitle.classList.remove("is-invalid", "is-valid");
  taskDescription.classList.remove("is-invalid", "is-valid");
  taskAssignedTo.classList.remove("is-invalid", "is-valid");
  taskDueDate.classList.remove("is-invalid", "is-valid");
}

taskModalForm.addEventListener("submit", saveButtonClicked); // on clicking submit button on the new task form, saveButtonClicked function called

function saveButtonClicked(event) {
  event.preventDefault(); // prevent default action for the submit button to trigger

  var title = taskTitle.value; // assign values from input box to the array

  var description = taskDescription.value;
  var assignedTo = taskAssignedTo.value;
  var date = taskDueDate.value;
  var time = taskDueTime.value;
  var status = selectedStatus(); // returns value for the radio button depending on the selection

  if (validationTaskForm(title, description, assignedTo, date, status)) {
    // check all parameters passed to this function
    if (!taskForm.classList.item(0)) {
      // if index does not match, go to add task
      taskManager.addTask(title, description, assignedTo, date, time, status); // add task function

      refreshPage(); // refresh the page (clears inner HTML and list the updated array)

      clearAllFieldValues(); // clear all field value and assign null to fields and false to radio button value

      clearValidations(); // removes all is-invalid and is-valid classes to the span elements

      statusStats(); // updates status counter
    } else {
      var id = taskForm.classList.item(0); // assigns array position 0 to the id (id=0)

      var task = {
        id: id,
        title: title,
        description: description,
        assignedTo: assignedTo,
        date: date,
        time: time,
        status: status
      };
      taskManager.editTask(task); // if index match, go to edit task

      refreshPage(); // refresh the page (clears inner HTML and list the updated array)

      clearAllFieldValues(); // clear all field value and assign null to fields and false to radio button value

      clearValidations(); // removes all is-invalid and is-valid classes to the span elements

      statusStats(); // updates status counter
      // Local Storage Update Task

      var mynewtasks = JSON.parse(localStorage.getItem("mytasks")); // alert(mynewtasks.length);

      for (var i = 0; i < mynewtasks.length; i++) {
        // alert(mynewtasks[i].id);
        // alert(id);
        if (mynewtasks[i].id == id) {
          // alert("Inside For Loop");
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

      taskForm.classList.remove("".concat(id)); // removed the class id from the task form
    }

    $("#newTaskInput").modal("hide"); // new task modal hidden
  } else {
    alert("Please complete all fields."); // else alert to complete all fields
  }

  refreshPage(); // clear innerHTML and creates a list of all the items in the array

  statusStats(); // update status counter buttons
}

var formCancel = document.querySelector("#cancelButton"); // assign modal cancel button to the variable

var formClose = document.querySelector("#close"); // assign modal close button to the variable

formCancel.addEventListener("click", function (event) {
  var id = taskForm.classList.item(0); // assign array index to the modal

  if (id) {
    taskForm.classList.remove("".concat(id)); // remove the id class from the modal
  }
});
formClose.addEventListener("click", function (event) {
  var id = taskForm.classList.item(0); // assign array index to the modal

  if (id) {
    taskForm.classList.remove("".concat(id)); // remove the id class from the modal
  }
}); // Status return

function selectedStatus() {
  if (done.checked) {
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
} //  Validation on input for boolean and assign class accordingly (is-invalid // is-valid)
// checks if the title is more than 8 characters


taskTitle.addEventListener("input", function (event) {
  validation(notEmptyLongerThan(8));
}); // checks if the task description is more than 15 characters

taskDescription.addEventListener("input", function (event) {
  validation(notEmptyLongerThan(15));
}); // checks if the assigned to is more than 8 characters

taskAssignedTo.addEventListener("input", function (event) {
  validation(notEmptyLongerThan(8));
}); // checks if the due date is in the future

taskDueDate.addEventListener("input", function (event) {
  var today = todayConvertor(); // get today's date

  var dueDate = new Date(event.target.value); // get due date

  validation(today <= dueDate); // returns value of boolean and assign class
}); // returns today's date with hours

function todayConvertor() {
  var today = new Date(); // get today's date 

  return today.setHours(0, 0, 0, 0); // get current time
} // validations boolean and remove/add class to element accordingly


function validation(boolean) {
  if (boolean) {
    event.target.classList.remove("is-invalid"); // remove class from element

    event.target.classList.add("is-valid"); // add class to element
  } else {
    event.target.classList.remove("is-valid"); // remove class from element

    event.target.classList.add("is-invalid"); // add class to elements
  }
}

; //validation to check if value and length of characters are more than the (number)

function notEmptyLongerThan(number) {
  return event.target.value && event.target.value.length > number;
}

function validationTaskForm(title, description, assignedTo, date, status) {
  var dueDate = new Date(date); // assign today's date by default to calendar picker

  var today = todayConvertor(); // assign current time by default

  if (title && title.length > 8) {
    // if title length is more than 8 characters
    if (description && description.length > 15) {
      // if description is more than 15 characters
      if (assignedTo && assignedTo.length > 8) {
        // if assignedTo is more than 8 characters
        if (dueDate && today <= dueDate) {
          // **
          if (status) {
            // if status is true
            return true; // validationTaskForm returns true
          }
        }
      }
    }
  }

  return false; // else return false
} // Total Counter - All Task


var counterTotalTask = document.querySelector("#counterTotalTask"); // assign All Tasks button to counterTotalTask

var totalNumber = document.querySelector("#counterTotalTask > span"); // assign span inside All Task Counter to totalNumber

counterTotalTask.addEventListener("click", getAllTask); // onclick of All Tasks button

function getAllTask() {
  clearAll(); // clears innerHTML 

  taskManager.tasks.forEach(function (task) {
    return addTaskToPage(task);
  }); // displays each task from the array

  totalNumber.innerHTML = "".concat(taskManager.tasks.length); // All Tasks total number is the length of the array
} // Counter for Done


var counterDone = document.querySelector("#counterDone"); // assign Done button to counterDone variable

counterDone.addEventListener("click", function () {
  // onclick Done button
  filterTaskStatus("Done"); // clears innerHTML, display all tasks with status === done
}); // Counter for Review

var counterInReview = document.querySelector("#counterInReview"); // assign In Review button to counterInReview variable

counterInReview.addEventListener("click", function () {
  // onclick In Review button
  filterTaskStatus("In Review"); // clears innerHTML, display all tasks with status === review
}); // Counter for In Progress

var counterInProgress = document.querySelector("#counterInProgress"); // assign In Progress button to counterInProgress variable

counterInProgress.addEventListener("click", function () {
  // onclick In Progress button
  filterTaskStatus("In Progress"); // clears innerHTML, display all tasks with status === inProgress
}); // Counter for To Do

var counterToDo = document.querySelector("#counterToDo"); // assign To Do button to counterToDo variable

counterToDo.addEventListener("click", function () {
  // onclick To Do button
  filterTaskStatus("To Do"); // clears innerHTML, display all tasks with status === To Do
});

function filterTaskStatus(status) {
  clearAll(); // clears innerHTML

  taskManager.tasks.forEach(function (task) {
    // display all task when passed parameter matches the status in the array
    if (status === task.status) {
      addTaskToPage(task);
    }

    ;
  });
}

var findTaskIndex = function findTaskIndex(task) {
  return (// finding index of a task
    taskManager.tasks.findIndex(function (taskInArray) {
      return taskInArray.id == task.id;
    })
  );
}; // returns the first index that matches the parameter


function statusStats() {
  totalNumber.innerHTML = "".concat(taskManager.tasks.length); // gets total tasks in the array

  counterDone.querySelector("span").innerHTML = "".concat(taskManager.tasks.filter(function (task) {
    return task.status === "Done";
  }).length); // done status counter

  counterInReview.querySelector("span").innerHTML = "".concat(taskManager.tasks.filter(function (task) {
    return task.status === "In Review";
  }).length); // in review status counter

  counterInProgress.querySelector("span").innerHTML = "".concat(taskManager.tasks.filter(function (task) {
    return task.status === "In Progress";
  }).length); // in progress status counter

  counterToDo.querySelector("span").innerHTML = "".concat(taskManager.tasks.filter(function (task) {
    return task.status === "To Do";
  }).length); // to do status counter
}

function refreshPage() {
  clearAll(); // clear innerHTML

  var mynewtasks = JSON.parse(window.localStorage.getItem('mytasks')) || taskManager.tasks;
  mynewtasks.forEach(function (task) {
    return addTaskToPage(task);
  }); // list all current tasks from array
}

function clearAll() {
  taskContainer.innerHTML = ""; // clears innerHTML
}

function addTaskToPage(task) {
  // adds HTML element to the page
  // assign all the HTML Element code to html
  var html = "\n  <div class=\"task\" id=\"task".concat(task.id, "\">\n    <div class=\"row\">\n      <div class=\"taskTitle col-lg-4 order-1 col-sm\">\n          <p class=\"text-left d-inline\">\n            <span class=\"h6 font-weight-bold\">").concat(task.title, "</span> \n          \n            <a href=\"#task").concat(task.id, "Description\" class=\"text-primary ml-1 pl-0 small\" data-toggle=\"collapse\" data-target=\"#task").concat(task.id, "Description\"><i class=\"fas fa-plus-circle fa-lg iconFloat\"></i></a>\n          </p>\n      </div>\n      \n      <div class=\"col-lg-8 order-2\">\n        <ul class=\"row taskSummary\">\n          <li class=\"order-3 col-sm col-md\">\n            <span class=\"spanDateTime\">").concat(task.date, "</span>\n          </li>\n          <li class=\"order-4 col-sm col-md\">\n            <span>").concat(task.time, "</span>\n          </li>\n        \n          <li class=\"order-5 col-sm col-md\">\n            <span class=\"badge badgeColor").concat(task.status, "\">").concat(task.status, "</span>\n          </li>\n        \n          <li class=\"order-6 col-sm col-md\">\n          ").concat(task.assignedTo, "\n          </li>\n        \n          <li class=\"order-7 col-sm col-md\">\n            <form class=\"removeBin\" action=\"\" method=\"post\">\n              <a href=\"#newTaskInput\" id=\"editTaskButton\" role=button class=\"d-inline btn btn-link ml-0 pl-0 mb-0 pb-0\" data-toggle=\"modal\" title=\"Edit Task\" data-target=\"#newTaskInput\">\n              <i class=\"fas fa-pen-square text-dark iconFloat fa-lg\"></i></a>\n              <input type=\"checkbox\" class=\"ml-2 pl-0 border border-info\">\n              <button type=\"button\" class=\"ml-3 pl-0 btn btn-link removeBin\" id=\"deleteSingleTask\" data-toggle=\"\" data-placement=\"top\" title=\"Delete This Task\"><i class=\"fas fa-trash-alt fa-lg iconFloat iconDelete \"></i>\n              </button>\n              </form>\n          </li>\n        </ul>\n      </div>\n    </div>\n    <div id=\"task").concat(task.id, "Description\" class=\"collapse order-2 order-lg-2 order-md-2 order-sm-2\">\n          ").concat(task.description, "\n    </div>\n    <hr>\n  </div>");
  var taskElement = document.createRange().createContextualFragment(html); // passing html fragment to the page

  var editTaskOnPage = taskElement.querySelector("#editTaskButton"); // assign Edit Task button to a variable

  editTaskOnPage.addEventListener("click", function () {
    // onclick of edit task button
    clearAllFieldValues(); // clear all field values from modal form

    clearValidations(); // clear all validation spans

    taskForm.classList.add(task.id); // task form class added with the task id index

    taskTitle.value = task.title; // task title assigned to taskTitle.value

    taskDescription.value = task.description; // task description assigned to taskAssigned.value

    taskAssignedTo.value = task.assignedTo; // task assignedTo assigned to taskAssignedTo.value

    taskDueDate.value = task.date; // task date assigned to taskDueDate.value

    taskDueTime.value = task.time; // task time assigned to taskDueTime.value

    switch (task.status) {
      // checks if the task status matches with the case, if not default is selected
      case 'Done':
        done.checked = true;
        break;

      case 'In Review':
        review.checked = true;
        break;

      case 'In Progress':
        inProgress.checked = true;
        break;

      default:
        toDo.checked = true;
      // by default, To Do is selected 
    }
  });
  var deleteTaskOnPage = taskElement.querySelector('#deleteSingleTask'); // deletes single task on the page

  deleteTaskOnPage.addEventListener("click", function () {
    // onclick of the delete single task icon
    taskManager.deleteTask(task); // deletes the task of the given index

    deleteTaskOnPage.closest("div.task").remove(); // removes closed div in the task class
  });
  var checkbox = taskElement.querySelector('.removeBin > input[type="checkbox"]'); // assign checkbox in the removeBin class to checkbox variable

  var clearSelected = document.querySelector("#clearSelected"); // assign Clear Selected button to clearSelected

  clearSelected.addEventListener('click', checkboxClicked); // onclick of clear selected button, executed checkboxClicked function

  function checkboxClicked(event) {
    // executed on Clear Selectd button onclick
    if (checkbox.checked) {
      // if the checkbox is checked
      taskManager.deleteTask(task); // deletes the task of the given index

      checkbox.closest("div.task").remove(); // removes the closes div in the task class

      clearSelected.removeEventListener('click', checkboxClicked); // removes previously registered event listener
    }
  }

  taskContainer.append(taskElement); // append taskElement to the taskContainer in the HTML page
}

$(function () {
  $('[data-toggle="tooltip"]').tooltip();
}); // Day and Date

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

var nth = function nth(n) {
  // displays *st, *nd, *rd, *th depending on the date
  if (n > 3 && n < 21) return 'th';

  switch (n % 10) {
    case 1:
      return "st";

    case 2:
      return "nd";

    case 3:
      return "rd";

    default:
      return "th";
  }
};

var todayDate = d.getDate();
var year = d.getFullYear();
var todayFullDate = todayDate + nth(todayDate) + " " + todayMonth + " " + year + " - Happy " + day + "!";
document.querySelector("#todayDate").innerHTML = todayFullDate;
refreshPage();
},{"./taskmanager.js":"taskmanager.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "63053" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","script.js"], null)
//# sourceMappingURL=/script.75da7f30.js.map