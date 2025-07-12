import React from "react";
import { useNavigate } from "react-router-dom";

const LogoutButton = ({ className = "", style = {} }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove tokens or user data from localStorage/sessionStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("access");
    // Add any other cleanup logic here
    navigate("/", { replace: true });
  };

  const [hovered, setHovered] = React.useState(false);

  return (
    <button
      className={`btn w-100 mt-3 ${className}`}
      style={{
        backgroundColor: hovered ? '#ffe5e5' : '#fff',
        color: '#dc3545',
        border: '2px solid #dc3545',
        fontWeight: 600,
        transition: 'background 0.2s',
        ...style
      }}
      onClick={handleLogout}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={{ marginRight: 8 }}>
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" /></svg>
      </span>
      Logout
    </button>
  );
};

export default LogoutButton;
