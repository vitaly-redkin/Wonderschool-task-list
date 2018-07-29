/**
 * Test cases for the TaskManager class.
 */

import * as TaskManager from '../TaskManager';
import { TaskBare } from '../TaskBare';
import { Task } from '../Task';
import * as DataSamples from '../DataSamples';

describe("Task list is properly prepared", () => {
  const source: TaskBare[] = DataSamples.normalSample;
  const tasks: Task[] = TaskManager.prepareTaskList(source);

  it("No tasks lost in preparation", () => {
    expect(tasks.length).toBe(source.length);
  });

  it("Task other tasks do not list in dependencyIds has no dependents", () => {
    const task: Task = TaskManager.getTaskById(tasks, 7);
    expect(task.dependentIds.length).toBe(0);
  });

  it("Task four other task list in dependencyIds has four dependents", () => {
    const task: Task = TaskManager.getTaskById(tasks, 1);
    expect(task.dependentIds.length).toBe(4);
  });
 
  it("Initially all tasks with dependencies are locked", () => {
    const tasksWithDependencies: Task[] = tasks.reduce(
      (result: Task[], task: Task) => (
        task.dependencyIds.length > 0 ? result.concat(task) : result),
      []);
    const lockedTasks: Task[] = tasks.reduce(
      (result: Task[], task: Task) => (
        task.isLocked ? result.concat(task) : result),
      []);
    expect(lockedTasks.length).toBe(tasksWithDependencies.length);
  });
});

describe("Orphan depencies removed", () => {
  const source: TaskBare[] = DataSamples.sampleWithOrphan;
  const tasks: Task[] = TaskManager.prepareTaskList(source);

  it("Task with orphan dependency has no dependencyIds", () => {
    const task: Task = TaskManager.getTaskById(tasks, 7);
    expect(task.dependentIds.length).toBe(0);
  });
});

describe("Task completed change properly handled - one level up", () => {
  const source: TaskBare[] = DataSamples.normalSample;
  const tasks: Task[] = TaskManager.prepareTaskList(source);

  it("When task listed as the only dependency in other tasks is completed these tasks are unlocked", () => {
    const task: Task = TaskManager.getTaskById(tasks, 1);
    const updatedTasks: Task[] = TaskManager.setTaskCompletionState(tasks, task, true);
    const dependentTasks: Task[] = task.dependentIds.reduce(
      (result: Task[], dependentId: number) => 
        result.concat(TaskManager.getTaskById(updatedTasks, dependentId)),
      []);
    const unlockedDependentTasks: Task[] = dependentTasks.filter(
      (item: Task) => !item.isLocked);  
    expect(unlockedDependentTasks.length).toBe(dependentTasks.length);
  });
});

describe("Task completed change properly handled - recursively", () => {
  const source: TaskBare[] = DataSamples.normalSample;
  const tasks: Task[] = TaskManager.prepareTaskList(source);

  it("Task 6 depends on 2, 3, 4 which depends on 1. When 1, 2, 4, 6 are completed 6 should be unlocked", () => {
    let updatedTasks: Task[] = tasks;
    const task1: Task = TaskManager.getTaskById(updatedTasks, 1);
    updatedTasks = TaskManager.setTaskCompletionState(tasks, task1, true);
    const task2: Task = TaskManager.getTaskById(updatedTasks, 2);
    updatedTasks = TaskManager.setTaskCompletionState(updatedTasks, task2, true);
    const task3: Task = TaskManager.getTaskById(updatedTasks, 3);
    updatedTasks = TaskManager.setTaskCompletionState(updatedTasks, task3, true);
    const task4: Task = TaskManager.getTaskById(updatedTasks, 4);
    updatedTasks = TaskManager.setTaskCompletionState(updatedTasks, task4, true);
    const task6: Task = TaskManager.getTaskById(updatedTasks, 4);
    expect(task2.isLocked).toBeFalsy();
    expect(task3.isLocked).toBeFalsy();
    expect(task4.isLocked).toBeFalsy();
    expect(task6.isLocked).toBeFalsy();
  });
});


describe("Task completed change properly handled - recursively when task is uncompleted", () => {
  const source: TaskBare[] = DataSamples.normalSample.map(
    (item: TaskBare) => { return {...item, completedAt: new Date()}; });
  const tasks: Task[] = TaskManager.prepareTaskList(source);

  it("Initially all tasks are unlocked since all tasks are initially completed", () => {
    const unlockedTasks: Task[] = tasks.reduce(
      (result: Task[], task: Task) => (
        !task.isLocked ? result.concat(task) : result),
      []);
    expect(unlockedTasks.length).toBe(tasks.length);
  });

  it("Task 6 depends on 2, 4, 3 which all depends on 1. When 1 is incompleted, 2, 3, 4 and 6 should be locked", () => {
    let updatedTasks: Task[] = tasks;
    const task1: Task = TaskManager.getTaskById(updatedTasks, 1);
    updatedTasks = TaskManager.setTaskCompletionState(tasks, task1, false);
    const task2: Task = TaskManager.getTaskById(updatedTasks, 2);
    const task3: Task = TaskManager.getTaskById(updatedTasks, 3);
    const task4: Task = TaskManager.getTaskById(updatedTasks, 4);
    const task6: Task = TaskManager.getTaskById(updatedTasks, 4);
    expect(task2.isLocked).toBeTruthy();
    expect(task3.isLocked).toBeTruthy();
    expect(task4.isLocked).toBeTruthy();
    expect(task6.isLocked).toBeTruthy();
  });
});