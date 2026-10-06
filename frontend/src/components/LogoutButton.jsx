function LogoutButton({ onLogout, className = "" }) {
  return (
    <button
      type="button"
      className={`logout-button ${className}`.trim()}
      onClick={onLogout}
    >
      Logout
    </button>
  );
}

export default LogoutButton;
