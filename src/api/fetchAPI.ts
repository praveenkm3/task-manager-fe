import { api } from "./axios";

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
    query: `query {
                            tasks {
                                result {
                                    tasks_taskId
                                    tasks_title
                                    tasks_description 
                                    tasks_status 
                                    tasks_dueDate 
                                    users_email 
                                    admins_email 
                                    tasks_priority 
                                }
                                length
                            }
                        }`,
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
    query: `
        mutation($input: AddTaskInput!){
          addTask(input: $input)
        }`,
    variables: {
      input: data,
    },
  });
  return response.data;
};
export const fetchUsers = async () => {
  const response = await api.post("/graphql", {
    query: `
        query{
            fetchUsers {
                email,
                role,
                userId,
                isActive,
            }
        }
        `,
  });
  return response?.data?.data;
};
export const fetchDates = async () => {
  const response = await api.post("/graphql", {
    query: `
        query{
            fetchDates {
                duedate
                id
                taskname
                tasks_taskId
                status
            }
        }
        `
  });
  return response?.data?.data;
};
export const fetchTaskStatuses=async ()=>{
    const response=await api.post("/graphql",{
        query:`
        query{
              fetchTaskStatuses {
                taskStatusCount
                count
              }
            }
        `
    })
    return response?.data?.data;
}
export const fetchUserAndAdminStatuses=async ()=>{
    const response=await api.post("/graphql",{
        query: `
        query{
            fetchUserAndAdminStatuses {
                email
                status
                totalTasks
            }
        }`
    })
    return response?.data?.data;
}
export const fetchPriorityCount=async ()=>{
    const response=await api.post("/graphql",{
         query: `
         query{
            fetchPriorityCount {
                label1
                label2
                value
            }
        }`
    })
    return response?.data?.data;
}
