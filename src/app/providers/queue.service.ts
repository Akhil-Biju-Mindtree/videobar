import { Injectable } from '@angular/core';
import { Logger } from '@core/logger/Logger';
@Injectable({
  providedIn: 'root',
})
export class QueueService {
  constructor(private loggerService: Logger) {}
  private currentTimer = null;
  private tasks = [];

  public addTask = (callback: Function, delay: any) => {
    this.tasks.push({ callback, delay });

    // If there's a scheduled task, bail out.
    if (this.currentTimer) {
      return;
    }

    // Otherwise, start kicking tires
    this.launchNextTask();
  }

  public launchNextTask = () => {
    // If there's a scheduled task, bail out.
    if (this.currentTimer) {
      return;
    }

    const nextTask = this.tasks.shift();

    // There's no more tasks, clean up.
    if (!nextTask) {
      return this.clear();
    }

    // Otherwise, schedule the next task.
    this.currentTimer = setTimeout(() => {
      nextTask.callback.call();

      this.currentTimer = null;

      // Call this function again to set up the next task.
      this.launchNextTask();
    },                             nextTask.delay);
  }

  public clear = () => {
    if (this.currentTimer) {
      clearTimeout(this.currentTimer);
    }

    // Timer clears only destroy the timer. It doesn't null references.
    this.currentTimer = null;

    // Fast way to clear the task queue
    this.tasks.length = 0;
  }
}
