import React from "react";
// Import components from various dashboards (AI, CRM, etc.)
import UnitCountOne from "./child/UnitCountOne"; // AI
import SalesStatisticOne from "./child/SalesStatisticOne"; // AI
// CRM

const SuperAdminCombinedDashboard = () => (
  <div className="px-4 md:px-8 py-4 w-full">
    
    <UnitCountOne />
    <SalesStatisticOne />
   
  </div>
);

export default SuperAdminCombinedDashboard;
