import React from "react";
import InvoicePreviewLayer from "../InvoicePreviewLayer";
import PropertyOwner2Sidebar from "../PropertyOwner/PropertyOwner2Sidebar";

const PropInvoice = () => (
  <PropertyOwner2Sidebar>
    <div className="p-6 max-w-5xl mx-auto">
      <InvoicePreviewLayer />
    </div>
  </PropertyOwner2Sidebar>
);

export default PropInvoice;