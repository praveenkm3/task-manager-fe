import { api } from "./axios";
import {
  GET_TASKS,
  ADD_TASK,
  GET_USERS,
  GET_DATES_DATA,
  GET_TASKS_STATUSES,
  GET_USER_ADMIN_STATUSES,
  GET_PRIORITY_COUNT,
  GET_ONE_TASK,
  DELETE_TASK,
  UPDATE_TASK,
} from "../Apollo/queries";
export const fetchTasks = async (body: {
  page: number;
  records: number;
  filterColumn: string;
  filterValue: [] | string;
  filterOperator: string;
  sortColumnName: string;
  sortOrder: string;
}) => {
  const response = await api.post("/graphql", {
    query: GET_TASKS,
    body: body,
  });

  return response?.data?.data;
};
export const addTask = async (data: {
  title: string;
  description: string;
  assigned_user_id: number;
  dueDate: string;
  priority: string;
}) => {
  const response = await api.post("/graphql", {
    query: ADD_TASK,
    variables: {
      input: data,
    },
  });
  return response.data;
};
export const fetchUsers = async () => {
  const response = await api.post("/graphql", {
    query: GET_USERS,
  });
  return response?.data?.data;
};
export const fetchDates = async () => {
  const response = await api.post("/graphql", {
    query: GET_DATES_DATA,
  });
  return response?.data?.data;
};
export const fetchTaskStatuses = async () => {
  const response = await api.post("/graphql", {
    query: GET_TASKS_STATUSES,
  });
  return response?.data?.data;
};
export const fetchUserAndAdminStatuses = async () => {
  const response = await api.post("/graphql", {
    query: GET_USER_ADMIN_STATUSES,
  });
  return response?.data?.data;
};
export const fetchPriorityCount = async () => {
  const response = await api.post("/graphql", {
    query: GET_PRIORITY_COUNT,
  });
  return response?.data?.data;
};
export const fetchOneTask = async (taskId: number) => {
  const response = await api.post("/graphql", {
    query: GET_ONE_TASK,
    variables: {
      taskId: taskId,
    },
  });
  return response?.data?.data;
};
export const deleteTask = async (taskId: number) => {
  const response = await api.post("/graphql", {
    query: DELETE_TASK,
    variables: {
      taskId,
    },
  });
  return response?.data?.data;
};
export const updateTask = async (data: {
  taskId: number;
  title: string;
  description: string;
  assigned_user_id: string;
  duedate: string;
  priority: string;
  status: string;
}) => {
  const response = await api.post("/graphql", {
    query: UPDATE_TASK,
    variables: {
      input: data,
    },
  });
  return response?.data?.data;
};
