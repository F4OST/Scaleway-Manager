export interface ActionsDto {
  task: Task;
}

export interface Task {
  description: string;
  href_from: string;
  id: string;
  progress: string;
  status: string;
}
