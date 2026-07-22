export const GET_TASKS=`query {
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
        }`;
export const ADD_TASK=` mutation($input: AddTaskInput!){
          addTask(input: $input)
        }`;
export const GET_USERS=`query{
                    fetchUsers {
                        email,
                        role,
                        userId,
                        isActive,
                    }
        }`;
export const GET_DATES_DATA=`query{
            fetchDates {
                duedate
                id
                taskname
                tasks_taskId
                status
            }
        }`;
export const GET_TASKS_STATUSES=`query{
              fetchTaskStatuses {
                taskStatusCount
                count
              }
        }`;
export const GET_USER_ADMIN_STATUSES=`query{
            fetchUserAndAdminStatuses {
                email
                status
                totalTasks
            }
        }`;
export const GET_PRIORITY_COUNT=`
         query{
            fetchPriorityCount {
                label1
                label2
                value
            }
        }`;
export const GET_ONE_TASK=`query($taskId: Int!){
  getOneTask(taskId: $taskId) {
    admins_email
    tasks_description
    tasks_dueDate
    tasks_priority
    tasks_status
    tasks_taskId
    tasks_title
    users_email
    admins_userid
    users_userid
  }
        }`;
export const DELETE_TASK=`mutation($taskId: Int!){
                  deleteTask(taskId: $taskId)
        }`;
export const UPDATE_TASK=`mutation($input: UpdateTaskInput!) {
                updateTask(input: $input)
        }`;