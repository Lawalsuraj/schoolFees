const AdminOverview = () => {
  return (
    <div className="stats shadow w-full">
      <div className="stat">
        <div className="stat-title">Total Students</div>
        <div className="stat-value">—</div>
      </div>
      <div className="stat">
        <div className="stat-title">Total Collected</div>
        <div className="stat-value">—</div>
      </div>
      <div className="stat">
        <div className="stat-title">Outstanding</div>
        <div className="stat-value">—</div>
      </div>
    </div>
  );
};

export default AdminOverview;