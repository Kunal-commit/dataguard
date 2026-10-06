function EmptyState({
  icon = "▤",
  title = "Nothing here yet",
  description = "Get started by adding your first item.",
  buttonText,
  onClick,
}) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>

      <h3>{title}</h3>
      <p>{description}</p>

      {buttonText && onClick && (
        <button type="button" className="primary-button" onClick={onClick}>
          {buttonText}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
