function StatCard({ title, value, description, icon = "▦", trend }) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <div className="stat-card-icon">{icon}</div>

        {trend && <span className="stat-card-trend">{trend}</span>}
      </div>

      <div className="stat-card-content">
        <p>{title}</p>
        <h2>{value ?? 0}</h2>

        {description && <span>{description}</span>}
      </div>
    </div>
  );
}

export default StatCard;
