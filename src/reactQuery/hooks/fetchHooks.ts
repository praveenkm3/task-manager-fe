import { useQuery, keepPreviousData, useMutation } from "@tanstack/react-query";
import {
  fetchTasks,
  addTask,
  fetchUsers,
  fetchDates,
  fetchTaskStatuses,
  fetchUserAndAdminStatuses,
  fetchPriorityCount
} from "../../api/fetchAPI";

export const useFetchTasks = (params: {
  page: number;
  records: number;
  filterColumn: string | undefined;
  filterValue: string | [] | undefined;
  filterOperator: string | undefined;
  sortColumnName: string | undefined;
  sortOrder: string | undefined;
}) => {
  const {
    page,
    records,
    filterColumn,
    filterValue,
    filterOperator,
    sortColumnName,
    sortOrder,
  } = params;

  return useQuery({
    queryKey: [
      "tasks",
      page,
      records,
      filterColumn,
      filterValue,
      filterOperator,
      sortColumnName,
      sortOrder,
    ],
    queryFn: async () => {
      return await fetchTasks({
        page,
        records,
        filterColumn: filterColumn ?? "",
        filterValue: filterValue ?? "",
        filterOperator: filterOperator ?? "",
        sortColumnName: sortColumnName ?? "",
        sortOrder: sortOrder ?? "",
      });
    },
    placeholderData: keepPreviousData,
    staleTime: 2 * 60 * 1000,
  });
};
export const useAddTask = () => {
  return useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      assigned_user_id: number;
      dueDate: string;
      priority: string;
    }) => {
      const { title, description, assigned_user_id, dueDate, priority } = data;
      const response = await addTask({
        title,
        description,
        assigned_user_id,
        dueDate,
        priority,
      });
      return response;
    },
  });
};
export const useFetchUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => await fetchUsers(),
    staleTime: 2 * 60 * 1000,
  });
};
export const useFetchDates = () => {
  return useQuery({
    queryKey: ["dates"],
    queryFn: async () => await fetchDates(),
    staleTime: 2 * 60 * 1000,
  });
};
export const useFetchTaskStatus = () => {
  return useQuery({
    queryKey: ["task-statuses"],
    queryFn: async () => await fetchTaskStatuses(),
    staleTime: 2 * 60 * 1000,
  });
};
export const useFetchUserAndAdminStatuses = () => {
  return useQuery({
    queryKey: ["user-admin-status"],
    queryFn: async () => await fetchUserAndAdminStatuses(),
    staleTime: 2 * 60 * 1000,
  });
};
export const useFetchPriorityCount = () => {
  return useQuery({
    queryKey: ["task-priority"],
    queryFn: async () => await fetchPriorityCount(),
    staleTime: 2 * 60 * 1000,
  });
};
