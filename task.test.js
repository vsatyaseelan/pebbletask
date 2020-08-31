import Task from "./task.js";

test("Task Constructor ", () => {
    const task = new Task("1", "Groceries", "Buy 12 bottles of fresh milk", "Satyaseelan", "2021-10-10", "09:45", "status-toDo");
    expect(task.id).toBe("1");
    expect(task.title).toBe("Groceries");
    expect(task.description).toBe("Buy 12 bottles of fresh milk");
    expect(task.assignedTo).toBe("Satyaseelan");
    expect(task.date).toBe("2021-10-10");
    expect(task.time).toBe("09:45");
    expect(task.status).toBe("status-toDo");
});
