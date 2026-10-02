import { useState, useEffect, useRef } from 'react';
import { getAllStudents, deleteStudent } from '../../api/student.api.js';
import AddStudentModal from '../../components/AddStudentModal.jsx';
import EditStudentModal from '../../components/EditStudentModal.jsx';
import ResetPasswordModal from '../../components/ResetPasswordModal.jsx';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const addModalRef = useRef(null);
  const editModalRef = useRef(null);
  const resetModalRef = useRef(null);

  const fetchStudents = async () => {
    try {
      const res = await getAllStudents();
      setStudents(res.data.data.students);
    } catch (err) {
      console.error('Failed to fetch students', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const openEditModal = (student) => {
    setSelectedStudent(student);
    editModalRef.current.showModal();
  };

  const openResetModal = (student) => {
    setSelectedStudent(student);
    resetModalRef.current.showModal();
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this student?')) return;
    try {
      await deleteStudent(id);
      fetchStudents();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete student');
    }
  };

  return (
    <div className="card bg-base-100 shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Students</h2>
        <button className="btn btn-primary btn-sm" onClick={() => addModalRef.current.showModal()}>
          + Add Student
        </button>
      </div>

      {loading ? (
        <span className="loading loading-spinner"></span>
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Class</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id}>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.className}</td>
                  <td className="flex gap-2">
                    <button className="btn btn-xs btn-outline" onClick={() => openEditModal(student)}>
                      Edit
                    </button>
                    <button className="btn btn-xs btn-outline" onClick={() => openResetModal(student)}>
                      Reset Password
                    </button>
                    <button className="btn btn-xs btn-error" onClick={() => handleDelete(student._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AddStudentModal ref={addModalRef} onStudentCreated={fetchStudents} />
      <EditStudentModal ref={editModalRef} student={selectedStudent} onUpdated={fetchStudents} />
      <ResetPasswordModal ref={resetModalRef} student={selectedStudent} onReset={fetchStudents} />
    </div>
  );
};

export default AdminStudents;