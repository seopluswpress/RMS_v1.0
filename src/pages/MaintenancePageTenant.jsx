import React from "react";
import Tenant2Sidebar from "../components/Tenant/Tenant2Sidebar";
import Maintainance from '../pages1/Maintenance'

const MaintenancePageTenant = () => (
  <Tenant2Sidebar>
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1>Maintenance Page</h1>
      <p>This is a dummy page for Maintenance Page. Replace with real data as needed.</p>
    </div>
    <Maintainance/>
  </Tenant2Sidebar>
);

export default MaintenancePageTenant;
