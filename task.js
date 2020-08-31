export default class Task {
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