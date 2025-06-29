import React from "react";
import Sa2Sidebar from "../components/Sa2Sidebar";
import Owner from '../pages1/Owners'

const OwnersListPage = () => (
  <Sa2Sidebar>
    <div style={{ padding: 40, textAlign: "center" }}>
      
      <Owner/>
    </div>
  </Sa2Sidebar>
);

export default OwnersListPage;
