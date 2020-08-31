import Task from "./task.js";

export default class TaskManager {
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
    }
  
    editTask(task){
      this.tasks.splice(0, 1, task);
    }
  
    deleteTask(task){
      this.tasks.splice(task,1); 
    };
  
      
    addTaskToPage(task){  // adds HTML element to the page

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
      }

    }


  