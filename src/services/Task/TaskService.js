import httpClient from "../Base/HttpClient";

export const getMyTasks = async (params) => {
  const response = await httpClient.get("/api/tasks/my", { params });
  return response.data;
};

export const getAllTasks = async (params) => {
  const response = await httpClient.get("/api/tasks/all", { params });
  return response.data;
};

export const getMyOpenTaskCount = async () => {
  const response = await httpClient.get("/api/tasks/my/open-count");
  return response.data;
};

export const getTaskAssignees = async () => {
  const response = await httpClient.get("/api/tasks/assignees");
  return response.data;
};

export const updateTaskStatus = async (id, status) => {
  const response = await httpClient.post(`/api/tasks/${id}/update-status`, {
    status,
  });
  return response.data;
};
