import path from "path";
import fs from "fs";
import TaskManager from "./taskmanager.js";

const html = fs.readFileSync(path.resolve(__dirname, "./index.html"), "utf8");


beforeEach(() =>{ //sets up the DOM
    localStorage.clear();
    document.documentElement.innerHTML = html.toString();
});

test("Add Task", () => {
    const tm = new TaskManager();
    tm.addTask("1", "Groceries", "Buy 12 bottles of fresh milk", "Satyaseelan", "2021-10-10", "09:45", "status-toDo");
    expect(tm.tasks.length).toBe(1);
});

test("Delete Task", () => {
    const tm = new TaskManager();
    tm.addTask("1", "Groceries", "Buy 12 bottles of fresh milk", "Satyaseelan", "2021-10-10", "09:45", "status-toDo");
    tm.deleteTask(0);
    expect(tm.tasks.length).toBe(0); 
  });

test("Update Task", () => {
    const tm = new TaskManager();
    const beforeEdit = tm.addTask("1", "Groceries", "Buy 12 bottles of fresh milk", "Satyaseelan", "2021-10-10", "09:45", "status-toDo");  
    const afterEdit = tm.editTask("1", "Stationery", "Buy Pen, Paper & Scissors", "Satya and Nina", "2021-11-15", "11:45", "status-InProgress");  
    expect(beforeEdit).toBe(afterEdit);
});

test("HTML Append To Page ", () => {
  const taskContainer = document.querySelector("#tasks"); // container to display tasks
  const tm = new TaskManager(taskContainer);
  const task = ("1", "Groceries", "Buy 12 bottles of fresh milk", "Satyaseelan", "2021-10-10", "09:45", "status-toDo"); 
  tm.addTaskToPage(task);
  expect(taskContainer.getAttribute('id')).toContain('tasks');
});