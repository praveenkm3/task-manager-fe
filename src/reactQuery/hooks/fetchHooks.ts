import { useQuery, keepPreviousData, useMutation } from "@tanstack/react-query";
import {
  fetchTasks,
  addTask,
  fetchUsers,
  fetchDates,
  fetchTaskStatuses,
  fetchUserAndAdminStatuses,
  fetchPriorityCount,
  fetchOneTask,
  deleteTask,
  updateTask,
} from "../../api/fetchAPI";
import queryClient from "../query";

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
    onSuccess:()=>{
      queryClient.invalidateQueries({
        queryKey:['tasks']
      })
      queryClient.invalidateQueries({
        queryKey:["dates"]
      })
      queryClient.invalidateQueries({
        queryKey:["task-statuses"]
      })
      queryClient.invalidateQueries({
        queryKey:["user-admin-status"]
      })
      queryClient.invalidateQueries({
        queryKey:["task-priority"]
      })
    }
  });
};
export const useFetchUsers = (enabled: boolean) => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => await fetchUsers(),
    staleTime: 2 * 60 * 1000,
    enabled: enabled,
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
export const useFetchOneTask = (taskId: number) => {
  return useQuery({
    queryKey: ["one-task", taskId],
    queryFn: async () => {
      return await fetchOneTask(taskId);
    },
  });
};
export const useDeleteTask = () => {
  return useMutation({
    mutationFn: async (taskId: number) => {
      return await deleteTask(taskId);
    },
    onSuccess:()=>{
      queryClient.invalidateQueries({
                queryKey:['tasks']
        })
        queryClient.invalidateQueries({
          queryKey:["dates"]
        })
        queryClient.invalidateQueries({
          queryKey:["task-statuses"]
        })
        queryClient.invalidateQueries({
          queryKey:["user-admin-status"]
        })
        queryClient.invalidateQueries({
          queryKey:["task-priority"]
        })
    }
  });
};
export const useUpdateTask = () => {
  return useMutation({
    mutationFn: async (data: {
      taskId: number;
      title: string;
      description: string;
      assigned_user_id: string;
      duedate: string;
      priority: string;
      status: string;
    }) => {
      return updateTask(data);
    },
    onSuccess:()=>{
      queryClient.invalidateQueries({
        queryKey:['tasks']
        })
      queryClient.invalidateQueries({
        queryKey:["dates"]
      })
      queryClient.invalidateQueries({
        queryKey:["task-statuses"]
      })
      queryClient.invalidateQueries({
        queryKey:["user-admin-status"]
      })
      queryClient.invalidateQueries({
        queryKey:["task-priority"]
      })
    }
  });
};
