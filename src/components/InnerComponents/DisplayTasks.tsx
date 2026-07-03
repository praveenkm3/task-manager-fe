import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import { Chip, TextField } from "@mui/material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { UseAuth } from "../../contexts/AuthContext";

import axios from "axios";
import { Link } from "react-router";
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
      minWidth: 350,
      filterOperators: [ilikeOperator],
    },
    {
      field: "tasks_description",
      headerName: "Description",
      minWidth: 450,
      filterOperators: [ilikeOperator]
    },
    {
      field: "tasks_status",
      headerName: "Status",
      width: 200,
      filterOperators: [ilikeOperator],
      renderCell(params) {
        const tasks_status = params.row.tasks_status;
        return (
          <Chip
            sx={{
              fontWeight: 700,
              fontSize: "13px",
              borderRadius: 10,
              width: 140,
              bgcolor:
                tasks_status === "In Progress"
                  ? "#ebedf0"
                  : tasks_status === "TO DO"
                  ? "#ebedf0"
                  : tasks_status === "Completed"
                  ? "#bed1b769"
                  : "#ebedf0",

              color:
                tasks_status === "TO DO"
                  ? "#4d4a4a"
                  : tasks_status === "pending"
                  ? "#fc9a9a"
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
      minWidth: 220,
      filterOperators: [ilikeOperator],
    },
    {
      field: "tasks_taskId",
      headerName: "View Task",
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
      filterOperators: [ilikeOperator],
    };
  }
  const [rows, setRows] = useState([]);
  const [records, setRecords] = useState(15);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
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
