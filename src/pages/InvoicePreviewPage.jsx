import React from "react";
import InvoicePreviewLayer from "../components/InvoicePreviewLayer";
import Tenant2Sidebar from "../components/Tenant2Sidebar";

const InvoicePreviewPage = () => (
  <Tenant2Sidebar>
    <div className="p-6 max-w-5xl mx-auto">
      <InvoicePreviewLayer />
    </div>
  </Tenant2Sidebar>
);

export default InvoicePreviewPage;