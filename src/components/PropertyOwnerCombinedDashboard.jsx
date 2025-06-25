import React from "react";
import UnitCountFour from "./child/UnitCountFour";
import UsersChart from "./child/UsersChart";
import IncomeVsExpense from "./child/IncomeVsExpense";
// ...other imports

const PropertyOwnerCombinedDashboard = () => (
  <div>
    <UnitCountFour />
    <div className="row mb-4">
      <IncomeVsExpense />
      <UsersChart />
    </div>
    {/* Add more sections/components as needed */}
  </div>
);

export default PropertyOwnerCombinedDashboard;