export const TaskStatus = Object.freeze({
  Pending: 1,
  InProgress: 2,
  Completed: 3,
  Cancelled: 4,
});

export const TaskStatusOptions = [
  { value: "", label: "All statuses" },
  { value: TaskStatus.Pending, label: "Pending" },
  { value: TaskStatus.InProgress, label: "In Progress" },
  { value: TaskStatus.Completed, label: "Completed" },
  { value: TaskStatus.Cancelled, label: "Cancelled" },
];

const STATUS_BADGE_CLASS = {
  Pending: "at-status-badge at-status-badge--pending",
  "In Progress": "at-status-badge at-status-badge--inprogress",
  Completed: "at-status-badge at-status-badge--completed",
  Cancelled: "at-status-badge at-status-badge--cancelled",
};

export function getTaskStatusBadgeClass(status) {
  return STATUS_BADGE_CLASS[status] ?? "at-status-badge at-status-badge--cancelled";
}
