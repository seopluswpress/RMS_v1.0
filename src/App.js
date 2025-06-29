import { BrowserRouter, Route, Routes } from "react-router-dom";

import MaintenancePage from "./pages/MaintenancePageTenant";


import EmailPage from "./pages/EmailPage";







import ChatEmptyPage from "./pages/ChatEmptyPage";
import ChatMessagePage from "./pages/ChatMessagePage";
import ChatProfilePage from "./pages/ChatProfilePage";


import ColorsPage from "./pages/ColorsPage";

import CompanyLayer from "./components/CompanyLayer";
import PropertyManager2Sidebar from "./components/PropertyManager/PropertyManager2Sidebar";
import CompanyPage from "./pages/CompanyPage";


import SuperAdminCombinedDashboard from './components/Superadmin/SuperAdminCombinedDashboard';
import PropertyManagerCombinedDashboard from "./components/PropertyManager/PropertyManagerCombinedDashboard";
import FaqPage from "./pages/FaqPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";



import ImageUploadPage from "./pages/ImageUploadPage";
import InvoiceAddPage from "./pages/InvoiceAddPage";
import InvoiceEditPage from "./pages/InvoiceEditPage";
import InvoiceListPage from "./pages/InvoiceListPage";
import InvoicePreviewPage from "./pages/InvoicePreviewPage";
import KanbanPage from "./pages/KanbanPage";
import LanguagePage from "./pages/LanguagePage";
import SignUp from './pages1/SignUp';




import NotificationAlertPage from "./pages/NotificationAlertPage";
import NotificationPage from "./pages/NotificationPage";

import PaymentGatewayPage from "./pages/PaymentGatewayPage";
import Paymentpage from './components/payment/PaymentPage'
import PaymentSuccess from './components/payment/PaymentSuccess'
import CheckoutForm from './components/payment/CheckoutForm'


import Payments1 from "./pages1/Payments1";


import SignIn from './pages1/SignIn';





import TermsConditionPage from "./pages/TermsConditionPage";

import ThemePage from "./pages/ThemePage";

import UsersGridPage from "./pages/UsersGridPage";
import UsersListPage from "./pages/UsersListPage";
import OwnersListPage from "./pages/OwnersListPage";
import ViewDetailsPage from "./pages/ViewDetailsPage";

import ViewProfilePage from "./pages/ViewProfilePage";


import RouteScrollToTop from "./helper/RouteScrollToTop";


import PaymentPage from "./components/payment/PaymentPage";


import TestimonialsPage from "./pages/TestimonialsPage";


import PropertyOwnerSidebar from "./components/PropertyOwner/PropertyOwnerSidebar";

import PropertyOwnerCombinedDashboard from './components/PropertyOwner/PropertyOwnerCombinedDashboard';
import TenantSidebar from "./components/Tenant/TenantSidebar";

import TenantCombinedDashboard from './components/Tenant/TenantCombinedDashboard';
import PropertyManagerSidebar from "./components/PropertyManager/PropertyManagerSidebar";

import SuperAdminSidebar from "./components/Superadmin/SuperAdminSidebar";
import MaintenancePageTenant from "./pages/MaintenancePageTenant";
import PropertyList from "./pages/PropertyListPropertyOwner";
import TenantsList from "./pages/TenantsList";
import OwnersList from "./pages/OwnersListPage";
import LeasePropertyOwner from "./pages/LeasePropertyOwner";
import InvoicePropertyOwner from "./pages/InvoicePropertyOwner";
import MaintainancePropertyOwner from "./pages/MaintainancePropertyOwner";
import PropertyManagerList from "./pages/PropertyManagerList";
import PropertyListPropertyOwner from "./pages/PropertyListPropertyOwner";
import PropertyListPropertyManager from "./pages/PropertyListPropertyManager";
import MaintainancePropertyManager from "./pages/MaintainancePropertyManager";
import InvoiceTenant from "./pages/InvoiceTenant";
import Tenant2Sidebar from "./components/Tenant/Tenant2Sidebar";
import Sa2Sidebar from "./components/Superadmin/Sa2Sidebar";
import PropertyOwner2Sidebar from "./components/PropertyOwner/PropertyOwner2Sidebar";
import PaymentsTenants from "./pages/PaymentsTenants";
function App() {
  return (
    <BrowserRouter>
      <RouteScrollToTop />
      <Routes>
        <Route exact path='/signup' element={<SignUp />} />
        <Route exact path='/signin' element={<SignIn />} />
        <Route exact path='/tenant-dashboard' element={<TenantSidebar />} />
        <Route exact path='/super-admin-dashboard' element={<SuperAdminSidebar><SuperAdminCombinedDashboard /></SuperAdminSidebar>} />
        <Route exact path='/propertyowner-dashboard' element={<PropertyOwnerSidebar />} />
        <Route exact path='/propertymanager-dashboard' element={<PropertyManagerSidebar />} />

        <Route exact path='/MaintenancePageTenant' element={<MaintenancePageTenant />} />
        <Route exact path='/lease-list' element={<LeasePropertyOwner />} />
        <Route exact path='/property-list-property-owner' element={<PropertyListPropertyOwner />} />
        <Route exact path='/invoice-list-property-owner' element={<InvoicePropertyOwner />} />
        <Route exact path='/invoice-list-tenant' element={<InvoiceTenant />} />
        <Route exact path='/MaintainancePagePropertyOwner' element={<MaintainancePropertyOwner />} />
        <Route exact path='/MaintainancePagePropertyManager' element={<MaintainancePropertyManager />} />
        <Route exact path='/property-manager-list' element={<PropertyManagerList />} />
        <Route exact path='/property-list-property-manager' element={<PropertyListPropertyManager />} />
        <Route exact path='/payment-list-tenant' element={<PaymentsTenants />} />
      
       

        {/* SL */}
        
        
    
       
        
    
        <Route exact path='/payments1' element={<Payments1/>} />
        <Route exact path='/owners-list' element={<OwnersListPage/>} />
    
        
     
        <Route exact path='/chat-empty' element={<ChatEmptyPage />} />
        <Route exact path='/chat-message' element={<ChatMessagePage />} />
        <Route exact path='/chat-profile' element={<ChatProfilePage />} />
        
        <Route path="/pay/:invoiceId/" element={<Paymentpage/>} />
        <Route path="/payment-success/:invoiceId" element={<PaymentSuccess />} />
        <Route exact path='/colors' element={<ColorsPage />} />
        
        <Route exact path='/company' element={<CompanyPage />} />
        
        <Route exact path='/propertymanagercompanylayer' element={
  <PropertyManager2Sidebar>
    <CompanyLayer />
  </PropertyManager2Sidebar>
} />
<Route exact path='/tenantcompanylayer' element={
  <Tenant2Sidebar>
    <CompanyLayer />
  </Tenant2Sidebar>
} />
<Route exact path='/superadmincompanylayer' element={
  <Sa2Sidebar>
    <CompanyLayer />
  </Sa2Sidebar>
} />
<Route exact path='/propertyownercompanylayer' element={
  <PropertyOwner2Sidebar>
    <CompanyLayer />
  </PropertyOwner2Sidebar>
} />
        
        <Route exact path='/email' element={<EmailPage />} />
        <Route exact path='/faq' element={<FaqPage />} />
        <Route exact path='/forgot-password' element={<ForgotPasswordPage />} />
        
        
        

    
        
       

        <Route exact path='/testimonials' element={<TestimonialsPage />} />
    
      
        <Route exact path='/maintenance' element={<MaintenancePage />} />
        

        
        <Route exact path='/image-upload' element={<ImageUploadPage />} />
        <Route exact path='/invoice-add' element={<InvoiceAddPage />} />
        <Route exact path='/invoice-edit' element={<InvoiceEditPage />} />
        <Route exact path='/invoice-list' element={<InvoiceListPage />} />
        <Route path="/invoice-preview/:invoiceId" element={<InvoicePreviewPage />} />
        <Route exact path='/kanban' element={<KanbanPage />} />
        <Route exact path='/languages' element={<LanguagePage />} />
        
        
       
        
        <Route
          exact
          path='/notification-alert'
          element={<NotificationAlertPage />}
        />
        <Route exact path='/notification' element={<NotificationPage />} />
        
        <Route exact path='/payment-gateway' element={<PaymentGatewayPage />} />
      
        
        
      
     

        <Route path='/superadmin' element={<SuperAdminSidebar />}>
        <Route index element={<SuperAdminCombinedDashboard />} />
        </Route>
        <Route path='/propertyowner' element={<PropertyOwnerSidebar />} >
          <Route index element={<PropertyOwnerCombinedDashboard />} />
        </Route>
        <Route path='/tenant' element={<TenantSidebar />} >
          <Route index element={<TenantCombinedDashboard />} />
        </Route> 
        <Route path='/propertymanager' element={<PropertyManagerSidebar />} >
          <Route index element={<PropertyManagerCombinedDashboard />} />
        </Route> 
    
    
        
        
        
        
        
        
        <Route exact path='/terms-condition' element={<TermsConditionPage />} />
        
       
        <Route exact path='/theme-settings' element={<ThemePage />} />
        
        
        <Route exact path='/users-grid' element={<UsersGridPage />} />
        <Route exact path='/users-list' element={<UsersListPage />} />
        <Route exact path='/owners-list' element={<OwnersListPage />} />
        <Route exact path='/maintenance' element={<MaintenancePage />} />
        <Route exact path='/property-list' element={<PropertyList />} />
        <Route exact path='/tenant-list' element={<TenantsList />} />
        
<Route exact path='/owner-list' element={<OwnersListPage />} />
        <Route exact path='/view-details' element={<ViewDetailsPage />} />
        
        
        <Route exact path='/view-profile' element={<ViewProfilePage />} />
       
        
       
      

        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
