import React from "react";
// Import components from various dashboards (AI, CRM, etc.)
import UnitCountOne from "../child/UnitCountOne"; // AI
import SalesStatisticOne from "../child/SalesStatisticOne"; // AI
import UnitCountTwo from "../child/UnitCountTwo"; // CRM
import RevenueGrowthOne from "../child/RevenueGrowthOne"; // CRM

const PropertyManagerCombinedDashboard = () => (
  <div>
   
    <UnitCountTwo />
   
    {/* Add more sections/components as needed */}
  </div>
);

export default PropertyManagerCombinedDashboard;
