import React from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";


// Sidebars (optional import if you want to show them)
import SuperAdminSidebar from "../components/Superadmin/Sa2Sidebar";
import PropertyOwnerSidebar from "../components/PropertyOwner/PropertyOwner2Sidebar";
import PropertyManagerSidebar from "../components/PropertyManager/PropertyManager2Sidebar";
import TenantSidebar from "../components/Tenant/Tenant2Sidebar";
import SuperAdminCombinedDashboard from "../components/Superadmin/SuperAdminCombinedDashboard";
import PropertyOwnerCombinedDashboard from "../components/PropertyOwner/PropertyOwnerCombinedDashboard";
import PropertyManagerCombinedDashboard from "../components/PropertyManager/PropertyManagerCombinedDashboard";
import TenantCombinedDashboard from "../components/Tenant/TenantCombinedDashboard";
export default function UserDashboardRouter() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/");
  };
  const access = localStorage.getItem("access");
  let userType = null;
  if (access) {
    try {
      const payload = jwtDecode(access);
      userType = payload.type;
    } catch (e) {
      userType = null;
    }
  }

  const LogoutButton = (
    <button
      onClick={handleLogout}
      style={{
        position: "fixed",
        top: 16,
        right: 24,
        zIndex: 1000,
        background: "#e53e3e",
        color: "white",
        border: "none",
        borderRadius: "8px",
        padding: "8px 20px",
        fontWeight: "bold",
        cursor: "pointer",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
      }}
    >
      Logout
    </button>
  );

  switch (userType) {
    case "superadmin":
      return (
        <SuperAdminSidebar>
          <SuperAdminCombinedDashboard />
        </SuperAdminSidebar>
      );
    case "property_owner":
      return (
        <PropertyOwnerSidebar>
          <PropertyOwnerCombinedDashboard />
        </PropertyOwnerSidebar>
      );
    case "property_manager":
      return (
        <PropertyManagerSidebar>
          <PropertyManagerCombinedDashboard />
        </PropertyManagerSidebar>
      );
    case "tenant":
      return (
        <TenantSidebar>
          <TenantCombinedDashboard />
        </TenantSidebar>
      );
    default:
      return <div>User type not recognized or not logged in.</div>;
  }
}
