import React from "react";
import PropertyManager2Sidebar from "../components/PropertyManager/PropertyManager2Sidebar";
import Maintenance from "../pages1/Maintenance";

const MaintainancePropertyManager = () => (
  <PropertyManager2Sidebar>
    <div style={{ padding: 40, textAlign: "center" }}>
      <Maintenance/>
    </div>
  </PropertyManager2Sidebar>
);

export default MaintainancePropertyManager;
