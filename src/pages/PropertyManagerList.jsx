import React from "react";
import PropertyOwner2Sidebar from "../components/PropertyOwner/PropertyOwner2Sidebar";
import Manager from "../pages1/Managers"

const PropertyManagerList = () => (
  <PropertyOwner2Sidebar>
    <div style={{ padding: 40, textAlign: "center" }}>
      <Manager/>
    </div>
  </PropertyOwner2Sidebar>
);

export default PropertyManagerList;
