import React from "react";
// Import components from various dashboards (AI, CRM, etc.)

import UnitCountEight from "../child/UnitCountEight"; // CRM
import RecentTransactionOne from "../child/RecentTransactionOne"; // CRM

const TenantCombinedDashboard = () => (
  <div>

    <UnitCountEight />
    <RecentTransactionOne />
  
   
    {/* Add more sections/components as needed */}
  </div>
);

export default TenantCombinedDashboard;
