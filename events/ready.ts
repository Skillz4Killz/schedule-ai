import { Event } from "@klasa/core";

const tasksToCreate = [{ name: "reminders", time: "*/1 * * * *" }];

export default class extends Event {
  run() {
    // Once the bot is loaded prepare the tasks
    tasksToCreate.forEach((data) => {
      // If this task already exists and is running we can just skip
      if (this.client.schedule.tasks.some((task) => task.taskName === data.name)) return;
      this.client.schedule.create(data.name, data.time);
    });
  }
}
