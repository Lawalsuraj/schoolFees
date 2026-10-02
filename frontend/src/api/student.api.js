import api from './axios.js';

export const getAllStudents = () => api.get('/students');
export const createStudent = (data) => api.post('/students', data);

export const updateStudent = (id, data) => api.patch(`/students/${id}`, data);

export const resetStudentPassword = (id, newPassword) =>
  api.patch(`/students/${id}/reset-password`, { newPassword });

export const deleteStudent = (id) => api.delete(`/students/${id}`);
