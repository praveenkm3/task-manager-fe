import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import { Chip, Typography, TextField, Box } from "@mui/material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { UseAuth } from "../../contexts/AuthContext";
import { Link } from "react-router";
import highPriorityIcon from "../../../public/assets/highPriority.png";
import equalIcon from "../../../public/assets/equal.svg";
import down from "../../../public/assets/down.png";
import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useFetchTasks } from "../../reactQuery/hooks/fetchHooks";
import Spinner from "./Spinner";

//graphQL
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

const BetweenInput = (props) => {
  const { item, applyValue } = props;
  const [startDate, setStartDate] = React.useState<Dayjs | null>(null);
  const [endDate, setEndDate] = React.useState<Dayjs | null>(null);

  const handleStartDateChange = (newValue: Dayjs | null) => {
    setStartDate(newValue);
    if (applyValue) {
      applyValue({ ...item, value: [newValue, endDate] });
    }
  };

  const handleEndDateChange = (newValue: Dayjs | null) => {
    setEndDate(newValue);
    if (applyValue) {
      applyValue({ ...item, value: [startDate, newValue] });
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <DatePicker
          label="Start Date"
          value={startDate}
          onChange={handleStartDateChange}
        />
        <DatePicker
          label="End Date"
          value={endDate}
          onChange={handleEndDateChange}
        />
      </Box>
    </LocalizationProvider>
  );
};

const betweenOperator = {
  label: "Between",
  value: "between",
  getApplyFilterFn: () => null, //it's off default mui builtin sort
  InputComponent: BetweenInput,
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
                  : tasks_status === "On Hold"
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
      minWidth: 130,
      type: "string",
      valueGetter: (value) =>
        value ? dayjs(value).format("YYYY-MM-DD") : null,
      filterOperators: [betweenOperator],
      renderHeader() {
        return (
          <Typography sx={{ fontWeight: 700, fontSize: 15, color: "black" }}>
            Due Date
          </Typography>
        );
      },
    },
    {
      field: "tasks_priority",
      headerName: "Priority",
      minWidth: 150,
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
            <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
              <Box
                component="img"
                src={
                  priority === "High"
                    ? highPriorityIcon
                    : priority === "Medium"
                    ? equalIcon
                    : down
                }
                alt="3D Home Icon"
                sx={{
                  width: 20,
                  height: 20,
                  backgroundColor: "transparent",
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
      minWidth: 50,
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
  const { currentUser } = UseAuth()!;
  if (currentUser?.role === "admin") {
    columns[3] = {
      field: "users_email",
      headerName: "Assignee",
      minWidth: 180,
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
  // const [rows, setRows] = useState([]);
  const [records, setRecords] = useState(15);
  // const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  //sort
  const [sortColumn, setSortColumn] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  //filter
  const [filterColumn, setFilterColumn] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [filterOperator, setFilterOperator] = useState("");
  const [debounceFilter, setDebounceFilter] = useState("");
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
    try {
      const { field = "", operator = "", value = "" } = event?.items[0] || {};
      setFilterColumn(field);
      setDebounceFilter(value);
      setFilterOperator(operator);
    } catch (error) {
      console.log(error);
    }
  }
  //filter debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilterValue(debounceFilter);
    }, 500);
    return () => clearTimeout(timer);
  }, [debounceFilter]);

  const { data, isLoading } = useFetchTasks({
    page: page,
    records: records,
    filterColumn: filterValue ? filterColumn : undefined,
    filterValue: Array.isArray(filterValue)
      ? filterValue[0] && filterValue[1]
        ? filterValue
        : undefined
      : filterValue || undefined,
    filterOperator: filterValue ? filterOperator : undefined,
    sortColumnName: sortColumn || undefined,
    sortOrder: sortOrder || undefined,
  });

  if (isLoading) {
    return <Spinner />;
  }
  //  console.log(data?.tasks?.result,data?.tasks?.length);
  return (
    <>
      <DataGrid
        rows={data?.tasks?.result || []}
        columns={columns}
        sortingMode="server"
        getRowId={(row) => row.tasks_taskId}
        onSortModelChange={handleSortChange}
        onPaginationModelChange={handlePageChange}
        paginationModel={{ page: page - 1, pageSize: records }}
        paginationMode="server"
        pageSizeOptions={[1, 15, 50, 100]}
        rowCount={data?.tasks?.length || 0}
        filterMode="server"
        onFilterModelChange={handleFilterChange}
        slotProps={{
          filterPanel: {
            disableAddFilterButton: true,
            filterFormProps: {
              operatorInputProps: {
                sx: { display: "none" },
              },
            },
          },
        }}
      />
    </>
  );
}
