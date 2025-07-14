import React from "react";
import PropertyManager2Sidebar from "../components/PropertyManager/PropertyManager2Sidebar";
import PropertyList from "../pages1/PropertyList";

const PropertyListPropertyManager = () => (
  <PropertyManager2Sidebar>
    <div style={{ padding: 40, textAlign: "center" }}>
      <PropertyList/>
    </div>
  </PropertyManager2Sidebar>
);

export default PropertyListPropertyManager;
