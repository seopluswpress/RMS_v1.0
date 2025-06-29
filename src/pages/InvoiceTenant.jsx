import React from "react";
import Tenant2Sidebar from "../components/Tenant/Tenant2Sidebar";
import Invoices from '../pages1/Invoices'

const InvoiceTenant = () => (
  <Tenant2Sidebar>
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1> Invoice List</h1>
    </div>
    <Invoices/>
  </Tenant2Sidebar>
);

export default InvoiceTenant;
