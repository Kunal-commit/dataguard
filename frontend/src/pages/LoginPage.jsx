function LoginPage({
  isRegistering,
  setIsRegistering,
  username,
  setUsername,
  email,
  setEmail,
  password,
  setPassword,
  message,
  loading,
  onSubmit,
}) {
  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="brand-large">
          <div className="brand-logo">D</div>
          <span>DataGuard</span>
        </div>

        <div className="auth-hero">
          <span className="eyebrow">DATA QUALITY PLATFORM</span>

          <h1>
            Make your data
            <br />
            <span>trustworthy.</span>
          </h1>

          <p>
            Upload, profile and validate your datasets with a simple, powerful
            data quality platform.
          </p>

          <div className="feature-list">
            <div>
              <span>✓</span> CSV dataset profiling
            </div>
            <div>
              <span>✓</span> Configurable validation rules
            </div>
            <div>
              <span>✓</span> Detailed quality reports
            </div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-mobile-logo">
            <div className="brand-logo">D</div>
            <span>DataGuard</span>
          </div>

          <div className="auth-heading">
            <h2>{isRegistering ? "Create your account" : "Welcome back"}</h2>

            <p>
              {isRegistering
                ? "Start managing your data quality."
                : "Sign in to continue to DataGuard."}
            </p>
          </div>

          <form className="auth-form" onSubmit={onSubmit}>
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            {isRegistering && (
              <>
                <label>Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </>
            )}

            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {message && <div className="auth-message">{message}</div>}

            <button
              type="submit"
              className="primary-button full-button"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : isRegistering
                  ? "Create Account"
                  : "Sign In"}
            </button>
          </form>

          <div className="auth-switch">
            {isRegistering ? (
              <>
                Already have an account?{" "}
                <button type="button" onClick={() => setIsRegistering(false)}>
                  Sign in
                </button>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <button type="button" onClick={() => setIsRegistering(true)}>
                  Create account
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
