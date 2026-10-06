function LoadingSpinner({ message = "Loading...", fullPage = false }) {
  return (
    <div className={`loading-container ${fullPage ? "full-page" : ""}`}>
      <div className="loading-spinner" role="status" aria-label={message} />

      <p>{message}</p>
    </div>
  );
}

export default LoadingSpinner;
