function Header({ title, subtitle, username, children }) {
  return (
    <header className="page-header">
      <div className="page-header-text">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>

      <div className="page-header-actions">
        {children}

        {username && (
          <div className="header-user">
            <div className="user-avatar">
              {username.charAt(0).toUpperCase()}
            </div>

            <span>{username}</span>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
