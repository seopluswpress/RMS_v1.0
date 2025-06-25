import React from "react";
import Tenant2Sidebar from "../components/Tenant2Sidebar";
import Payments from '../pages1/Payments'

const PaymentsTenants = () => (
  <Tenant2Sidebar>
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1> Payment List</h1>
    </div>
    <Payments/>
  </Tenant2Sidebar>
);

export default PaymentsTenants;