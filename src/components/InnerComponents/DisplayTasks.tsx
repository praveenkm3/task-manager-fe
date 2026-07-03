import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import { Chip, Typography, TextField, Box } from "@mui/material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { UseAuth } from "../../contexts/AuthContext";
import axios from "axios";
import { Link } from "react-router";
import highPriorityIcon from "../../../public/assets/highPriority.png"
import equalIcon from "../../../public/assets/equal.svg";
import down from "../../../public/assets/down.png";
 



const ILikeInput = (props) => {
  const { item, applyValue } = props; //data and setter function
  // console.log(item);
  return (
    <TextField
      label="Enter Filter Value"
      size="small"
      value={item.value || ""}
      onChange={(e) => {
        applyValue({ ...item, value: e.target.value });
      }}
    />
  );
};
const ilikeOperator = {
  label: "iLike",
  value: "ilike",
  getApplyFilterFn: () => null, //it's off default mui builtin sort
  InputComponent: ILikeInput,
};

export default function DisplayTasks() {
  const columns: GridColDef[] = [
    {
      field: "tasks_title",
      headerName: "Task Title",
      renderHeader() {
        return (
          <Typography sx={{ fontWeight: 700, fontSize: 15, color: "black" }}>
            Title
          </Typography>
        );
      },
      minWidth: 250,
      filterOperators: [ilikeOperator],
    },
    {
      field: "tasks_description",
      headerName: "Description",
      minWidth: 350,
      filterOperators: [ilikeOperator],
      renderHeader() {
        return (
          <Typography sx={{ fontWeight: 700, fontSize: 15, color: "black" }}>
            Description
          </Typography>
        );
      },
    },
    {
      field: "tasks_status",
      headerName: "Status",
      width: 150,
      filterOperators: [ilikeOperator],
      renderHeader() {
        return (
          <Typography sx={{ fontWeight: 700, fontSize: 15, color: "black" }}>
            Status
          </Typography>
        );
      },
      renderCell(params) {
        const tasks_status = params?.row?.tasks_status;
        return (
          <Chip
            sx={{
              fontWeight: 700,
              fontSize: "10px",
              borderRadius: 1,
              width: 100,
              bgcolor:
                tasks_status === "In Progress"
                  ? "#98baee34"
                  : tasks_status === "TO DO"
                  ? "#7a7b7e29"
                  : tasks_status === "Completed"
                  ? "#bed1b769"
                  : "#f9adad1d",

              color:
                tasks_status === "TO DO"
                  ? "#2a2929"
                  : tasks_status === "pending"
                  ? "#f66868"
                  : tasks_status === "In Progress"
                  ? "#1591DC"
                  : "green",
            }}
            label={tasks_status.toUpperCase()}
          />
        );
      },
    },
    {
      field: "admins_email",
      headerName: "Admin Email",
      minWidth: 150,
      filterOperators: [ilikeOperator],
      renderHeader() {
        return (
          <Typography sx={{ fontWeight: 700, fontSize: 15, color: "black" }}>
            Admin Email
          </Typography>
        );
      },
    },
    {
      field: "tasks_dueDate",
      headerName: "Due Date",
      minWidth: 100,
      filterOperators: [ilikeOperator],
      renderHeader() {
        return (
          <Typography sx={{ fontWeight: 700, fontSize: 15, color: "black" }}>
            Due Date
          </Typography>
        );
      },
      renderCell(params) {
        const date = params?.row.tasks_dueDate.split("T")[0];
        return date;
      },
    },
    {
      field: "tasks_priority",
      headerName: "Priority",
      minWidth: 220,
      filterOperators: [ilikeOperator],
      renderHeader() {
        return (
          <Typography sx={{ fontWeight: 700, fontSize: 15, color: "black" }}>
            Priority
          </Typography>
        );
      },
      renderCell(params) {
        const priority = params?.row?.tasks_priority;
        // console.log(priority);
        return (
          <>
            <Box sx={{display:"flex",gap:1,mt:2}}>
              <Box
              component="img"
              src={
                priority ==='High' ? highPriorityIcon :
                priority ==='Medium' ? equalIcon :
                down
              }
              alt="3D Home Icon"
              sx={{
                width: 20,
                height: 20,
                backgroundColor: 'transparent'
              }}
            />
            <Box>
              <Typography>{priority}</Typography>
            </Box>
            </Box>
          </>
        );
      },
    },
    {
      field: "tasks_taskId",
      headerName: "",
      minWidth: 100,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const taskId = params.row.tasks_taskId;
        return (
          <Link to={`/task/${taskId}`}>
            <RemoveRedEyeIcon sx={{ color: "#4d4a4a", height: 20 }} />
          </Link>
        );
      },
    },
  ];
  const { currentUser } = UseAuth();
  if (currentUser?.role === "admin") {
    columns[3] = {
      field: "users_email",
      headerName: "Assignee",
      minWidth: 220,
      renderHeader() {
        return (
          <Typography sx={{ fontWeight: 700, fontSize: 15, color: "black" }}>
            Assignee
          </Typography>
        );
      },
      filterOperators: [ilikeOperator],
    };
  }
  const [rows, setRows] = useState([]);
  const [records, setRecords] = useState(15);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  console.log(rows);
  //sort
  const [sortColumn, setSortColumn] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  //   useEffect(() => {
  //     async function getLength() {
  //       const response2 = await axios.get(
  //         `http://localhost:5000/user/fetch-tasks-length`,
  //         { withCredentials: true },
  //       );
  //       setTotal(response2.data?.length);
  //     }
  //     getLength();
  //   }, []);
  const [filterColumn, setFilterColumn] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [filterOperator, setFilterOperator] = useState("");
  //   useEffect(() => {
  //     async function runner() {
  //       const response = await axios.post(
  //         `http://localhost:5000/user/fetch-tasks`,
  //         {
  //           records: records,
  //           page: page,
  //           sortColumnName: sortColumn,
  //           sordOrder: sortOrder
  //         },
  //         { withCredentials: true },
  //       );
  //         setRows(response.data?.result);
  //         setTotal(response?.data?.length)
  //     }
  //     runner();
  //   }, [page,records,sortColumn, sortOrder]);

  function handleSortChange(event) {
    const colName = event[0]?.field;
    setSortColumn(colName);
    setSortOrder(event[0]?.sort);
  }
  function handlePageChange(event) {
    setRecords(event?.pageSize);
    setPage(event?.page + 1);
  }
  function handleFilterChange(event) {
    const { field = "", operator = "", value = "" } = event?.items[0];
    setFilterColumn(field);
    setFilterValue(value);
    setFilterOperator(operator);
    // console.log(event?.items[0]);
  }

  useEffect(() => {
    const timer = setTimeout(
      () => {
        async function runFilter() {
          try {
            const response = await axios.post(
              `http://localhost:5000/${currentUser?.role}/fetch-tasks`,
              {
                page: page,
                records: records,
                filterColumn: filterValue ? filterColumn : undefined,
                filterValue: filterValue || undefined,
                filterOperator: filterValue ? filterOperator : undefined,
                sortColumnName: sortColumn || undefined,
                sortOrder: sortOrder || undefined,
              },
              { withCredentials: true },
            );
            setRows(response.data?.result);
            setTotal(response?.data?.length);
          } catch (error) {
            console.log(error);
          }
        }
        runFilter();
      },
      filterValue ? 600 : 0,
    );
    return () => clearTimeout(timer);
  }, [
    page,
    records,
    filterColumn,
    filterValue,
    filterOperator,
    sortColumn,
    sortOrder,
    currentUser,
  ]);

  return (
    <>
      <DataGrid
        rows={rows}
        columns={columns}
        sortingMode="server"
        getRowId={(row) => row.tasks_taskId}
        key={rows}
        onSortModelChange={handleSortChange}
        onPaginationModelChange={handlePageChange}
        paginationModel={{ page: page - 1, pageSize: records }}
        paginationMode="server"
        pageSizeOptions={[1, 10, 15, 50, 100]}
        rowCount={total}
        filterMode="server"
        onFilterModelChange={handleFilterChange}
      />
    </>
  );
}
