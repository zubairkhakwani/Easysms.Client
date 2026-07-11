import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  getMyTasks,
  updateTaskStatus,
} from "../../../../../services/Task/TaskService";
import { getUserRole, getRolePermissions } from "../../../../../services/Auth/AuthService";
import { Permissions } from "../../../../../data/Admin/Static";
import {
  TaskStatusOptions,
  getTaskStatusBadgeClass,
} from "../../../../../data/Admin/Task";
import { TaskActionDropdown } from "../../../../Helper/Task/TaskActionDropdown";
import TaskDetailsModal from "../../../../Helper/Task/TaskDetailsModal";
import { FormatterHelper } from "../../../../../helper/FormatterHelper";
import { errorToast, successTaost } from "../../../../../helper/Toaster";
import Paginations from "../../../../Shared/Pagination";
import "../ContactUs/ContactUs.css";
import "../Deposit/Deposits.css";
import "../User/UserManagement.css";
import "./Tasks.css";

const toDS = (d) => d.toISOString().slice(0, 10);
const today = new Date();
const defaultStartDate = toDS(
  new Date(today.getFullYear(), today.getMonth(), today.getDate() - 14),
);
const defaultEndDate = toDS(today);

function TaskPanelStatus({ isLoading, isEmpty }) {
  if (isLoading) {
    return (
      <div className="at-panel-status">
        <span className="btn-spinner" />
        <span>Loading tasks…</span>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="at-panel-status">
        <span className="at-empty-icon">☑</span>
        <span className="at-empty-title">No tasks found</span>
        <span className="at-empty-hint">
          Try adjusting your date range or status filter, then click Apply.
        </span>
      </div>
    );
  }

  return null;
}

export default function MyTasks() {
  const { refreshMyOpenTaskCount } = useOutletContext() ?? {};
  const isAdmin = getUserRole() === "Easyotps_Admin_99";
  const canUpdateTaskStatus = getRolePermissions().includes(
    Permissions.UpdateTaskStatus,
  );

  const [tasks, setTasks] = useState([]);
  const [count, setCount] = useState(0);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  async function fetchTasks(overrides = {}) {
    setIsLoading(true);
    try {
      const response = await getMyTasks({
        pageNumber: overrides.pageNo ?? pageNo,
        pageSize,
        startDate,
        endDate,
        status: status === "" ? undefined : Number(status),
      });

      if (response.isSuccess) {
        setTasks(response.data?.items ?? []);
        setCount(response.data?.count ?? 0);
      } else {
        errorToast(response.message);
      }
    } catch {
      errorToast("Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, [pageNo, pageSize]);

  async function handleStatusUpdate(id, nextStatus) {
    setUpdatingId(id);
    try {
      const response = await updateTaskStatus(id, nextStatus);
      if (response.isSuccess) {
        successTaost(response.message);
        await fetchTasks();
        refreshMyOpenTaskCount?.();
      } else {
        errorToast(response.message);
      }
    } catch {
      errorToast("Failed to update task");
    } finally {
      setUpdatingId(null);
    }
  }

  function handleReset() {
    setStartDate(defaultStartDate);
    setEndDate(defaultEndDate);
    setStatus("");
    setPageNo(0);
  }

  function handleApply() {
    setPageNo(0);
    fetchTasks({ pageNo: 0 });
  }

  const handleChangePage = (_event, newPage) => setPageNo(newPage);

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPageNo(0);
  };

  const isEmpty = !isLoading && tasks.length === 0;

  return (
    <div className="ph-page">
      <div className="ph-table-panel">
        <div className="ph-table-header">
          <span className="ph-table-title">My Tasks</span>
        </div>

        <div className="ph-filters">
          <div className="ph-filter-field">
            <label className="ph-filter-label">From</label>
            <input
              type="date"
              className="ph-filter-input"
              value={startDate}
              max={endDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="ph-filter-field">
            <label className="ph-filter-label">To</label>
            <input
              type="date"
              className="ph-filter-input"
              value={endDate}
              min={startDate}
              max={defaultEndDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="ph-filter-field">
            <label className="ph-filter-label">Status</label>
            <select
              className="ph-filter-input"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {TaskStatusOptions.map((opt) => (
                <option key={opt.label} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="ph-filter-actions">
            <button type="button" className="ph-reset-btn" onClick={handleReset}>
              Reset
            </button>
            <button
              type="button"
              className="ph-apply-btn"
              onClick={handleApply}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span
                    className="btn-spinner"
                    style={{
                      width: 13,
                      height: 13,
                      borderTopColor: "#000",
                      borderColor: "rgba(0,0,0,0.25)",
                    }}
                  />{" "}
                  Loading…
                </>
              ) : (
                "✦ Apply"
              )}
            </button>
          </div>
        </div>

        <TaskPanelStatus isLoading={isLoading} isEmpty={isEmpty} />

        {!isLoading && !isEmpty && (
          <>
            <div className="ph-table-wrap">
              <table className="ph-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Reference</th>
                    <th>Created</th>
                    <th>Completed</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task, index) => (
                    <tr key={task.id}>
                      <td>{pageNo * pageSize + index + 1}</td>
                      <td>{task.type}</td>
                      <td>
                        <span className={getTaskStatusBadgeClass(task.status)}>
                          {task.status}
                        </span>
                      </td>
                      <td>
                        <span className="at-ref-tag">
                          {task.referenceType} #{task.referenceId}
                        </span>
                      </td>
                      <td>{FormatterHelper.formatDateToLocal(task.createdAt)}</td>
                      <td>
                        {task.completedAt
                          ? FormatterHelper.formatDateToLocal(task.completedAt)
                          : "—"}
                      </td>
                      <td className="um-col-actions">
                        <TaskActionDropdown
                          task={task}
                          isAdmin={isAdmin}
                          canUpdateTaskStatus={canUpdateTaskStatus}
                          isUpdating={updatingId === task.id}
                          onViewInstructions={setSelectedTask}
                          onStart={handleStatusUpdate}
                          onComplete={handleStatusUpdate}
                          onCancel={handleStatusUpdate}
                          onReopen={handleStatusUpdate}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Paginations
              count={count}
              page={pageNo}
              rowsPerPage={pageSize}
              handleChangePage={handleChangePage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </>
        )}
      </div>

      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
}
