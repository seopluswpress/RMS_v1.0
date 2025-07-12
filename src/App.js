import React from 'react';
import { ProfileProvider } from './context/ProfileContext';
import { BrowserRouter, Route, Routes } from "react-router-dom";

import MaintenancePage from "./pages/MaintenancePageTenant";


import EmailPage from "./pages/EmailPage";
import ViewProfilewologo from "./components/ViewProfilewologo";
import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import TenantScreening from "./pages1/TenantScreening";
import TenantScreeningForm from "./pages1/TenantScreeningForm";
import TenantScreeningApprove from "./pages1/TenantScreeningApprove";
import TenantScreeningList from "./pages1/TenantScreeningList";





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
import SubscriptionPage from "./pages/SubscriptionPage";
import SignUp from './pages1/SignUp';




import NotificationAlertPage from "./pages/NotificationAlertPage";
import NotificationPage from "./pages/NotificationPage";

import PaymentGatewayPage from "./pages/PaymentGatewayPage";
import Paymentpage from './components/payment/PaymentPage'
import PaymentSuccess from './components/payment/PaymentSuccess'
import CheckoutForm from './components/payment/CheckoutForm'


import Payments1 from "./pages1/Payments1";








import TermsConditionPage from "./pages/TermsConditionPage";

import ThemePage from "./pages/ThemePage";

import UsersGridPage from "./pages/UsersGridPage";
import UsersListPage from "./pages/UsersListPage";
import OwnersListPage from "./pages/OwnersListPage";
import ViewDetailsPage from "./pages/ViewDetailsPage";

import ViewProfilePage from "./pages/ViewProfilePage";
import ViewProfileLayer from "./components/ViewProfileLayer";


import RouteScrollToTop from "./helper/RouteScrollToTop";
import PropInvoice from "./components/PropertyOwner/PropInvoice";

import PaymentPage from "./components/payment/PaymentPage";



import Settings1 from "./components/Settings1";
import PaymentGatewayLayer from "./components/PaymentGatewayLayer";


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
import CalendarMainLayer from "./components/CalendarMainLayer";
import SubscriptionPackages from "./pages/SubscriptionPackages";
import NotificationLayer from "./components/NotificationLayer";
import NotificationAlertLayer from "./components/NotificationAlertLayer";
import Settings2 from "./components/Settings2";
import UserDashboardRouter from "./pages1/UserDashboardRouter";
import { Navigate } from "react-router-dom";
import LoginPage from "./pages1/LoginPage";
import ErrorLayer from './components/ErrorLayer';
import CalendarMainPage from "./pages/CalendarMainPage";




function App() {
  const PrivateRoute = ({ children }) => {
    const isLoggedIn = !!localStorage.getItem("access");
    return isLoggedIn ? children : <Navigate to="/" />;
  };
  return (
    <ProfileProvider>
      <BrowserRouter>
        <RouteScrollToTop />
        <Routes>
      <Route exact path='/' element={<LoginPage />} />
        <Route exact path='/signup' element={<SignUp />} />
        
        
        
        
        

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
        
        
    
       
        
        <Route path="/dashboard" element={<PrivateRoute><UserDashboardRouter /></PrivateRoute>} />
        <Route exact path='/payments1' element={<Payments1/>} />
        <Route exact path='/calendar-main' element={<CalendarMainPage />} />

        <Route exact path='/owners-list' element={<OwnersListPage/>} />
    
        
     
        <Route exact path='/chat-empty' element={<ChatEmptyPage />} />
        <Route exact path='/chat-message' element={<ChatMessagePage />} />
        <Route exact path='/chat-profile' element={<ChatProfilePage />} />
        
        <Route path="/pay/:invoiceId/" element={<Paymentpage/>} />
        <Route path="/payment-success/:invoiceId" element={<Tenant2Sidebar><PaymentSuccess /></Tenant2Sidebar>} />
        <Route exact path='/colors' element={<ColorsPage />} />
        
        <Route exact path='/company' element={<CompanyPage />} />
        
        <Route exact path='/propertymanagercompanylayer' element={
  <PropertyManager2Sidebar>
    <Settings2 basePath="/propertymanager" />
  </PropertyManager2Sidebar>
} />
<Route exact path='/tenantcompanylayer' element={
  <Tenant2Sidebar>
    <Settings2 basePath="/tenant" />
  </Tenant2Sidebar>
} />
<Route exact path='/superadmincompanylayer' element={
  <Sa2Sidebar>
    <Settings1 basePath="/superadmin" />
  </Sa2Sidebar>
} />
<Route exact path='/propertyownercompanylayer' element={
  <PropertyOwner2Sidebar>
    <Settings1 basePath="/propertyowner" />
  </PropertyOwner2Sidebar>
} />
<Route exact path='/propertyowner/notification' element={
  <PropertyOwner2Sidebar>
    <NotificationLayer />
  </PropertyOwner2Sidebar>
} />

<Route exact path='/tenant/notification-alert' element={
  <Tenant2Sidebar>
    <NotificationAlertLayer />
  </Tenant2Sidebar>
} />
<Route exact path='/propertymanager/notification-alert' element={
  <PropertyManager2Sidebar>
    <NotificationAlertLayer />
  </PropertyManager2Sidebar>
} />
<Route exact path='/superadmin/notification' element={
  <Sa2Sidebar>
    <NotificationLayer />
  </Sa2Sidebar>
} />
<Route exact path='/superadmin/payment-gateway' element={
  <Sa2Sidebar>
    <PaymentGatewayLayer />
  </Sa2Sidebar>
} />
<Route exact path='/tenant/payment-gateway' element={
  <Tenant2Sidebar>
    <PaymentGatewayLayer />
  </Tenant2Sidebar>
} />
<Route exact path='/propertymanager/payment-gateway' element={
  <PropertyManager2Sidebar>
    <PaymentGatewayLayer />
  </PropertyManager2Sidebar>
} />
<Route exact path='/propertyowner/payment-gateway' element={
  <PropertyOwner2Sidebar>
    <PaymentGatewayLayer />
  </PropertyOwner2Sidebar>
} />
<Route exact path='/view-profile-superadmin' element={<Sa2Sidebar><ViewProfilewologo /></Sa2Sidebar>} />
<Route exact path='/view-profile-tenant' element={<Tenant2Sidebar><ViewProfilewologo /></Tenant2Sidebar>} />
<Route exact path='/view-profile-propertyowner' element={<PropertyOwner2Sidebar><ViewProfileLayer /></PropertyOwner2Sidebar>} />
<Route exact path='/view-profile-propertymanager' element={<PropertyManager2Sidebar><ViewProfilewologo /></PropertyManager2Sidebar>} />
        
        <Route exact path='/email' element={<EmailPage />} />
        <Route exact path='/faq' element={<FaqPage />} />
        <Route exact path='/forgot-password' element={<ForgotPasswordPage />} />
        
        
        <Route exact path="/screening/form/:token" element={<TenantScreeningForm />} />
<Route exact path='/tenant-screening' element={<TenantScreening />} />
<Route exact path='/tenant-screening/list' element={<TenantScreeningList />} />
<Route exact path='/tenant-screening/approve/:id' element={<TenantScreeningApprove />} />

    
        
       

        
    
      
        <Route exact path='/maintenance' element={<MaintenancePage />} />
        

        
        <Route exact path='/image-upload' element={<ImageUploadPage />} />
        <Route exact path='/invoice-add' element={<InvoiceAddPage />} />
        <Route exact path='/invoice-edit' element={<InvoiceEditPage />} />
        <Route exact path='/invoice-list' element={<InvoiceListPage />} />
        <Route path="/invoice-preview/:invoiceId" element={<InvoicePreviewPage />} />
        <Route path="/prop-invoice/:invoiceId" element={<PropInvoice />} />
        <Route exact path='/kanban' element={<KanbanPage />} />
        <Route exact path='/languages' element={<LanguagePage />} />
        
        
       
        
        <Route
          exact
          path='/notification-alert'
          element={<NotificationAlertPage />}
        />
        <Route exact path='/notification' element={
          <Sa2Sidebar>
            <NotificationLayer />
          </Sa2Sidebar>
        } />
        
        <Route exact path='/payment-gateway' element={
          <Sa2Sidebar>
            <PaymentGatewayLayer />
          </Sa2Sidebar>
        } />
        
      
        
        
      
     

        
        <Route exact path='/superadmin-calender-main' element={
  <Sa2Sidebar>
    <CalendarMainLayer />
  </Sa2Sidebar>
} />
<Route exact path='/propertyowner-calender-main' element={
  <PropertyOwner2Sidebar>
    <CalendarMainLayer />
  </PropertyOwner2Sidebar>
} />
<Route exact path='/propertymanager-calendar-main' element={
  <PropertyManager2Sidebar>
    <CalendarMainLayer />
  </PropertyManager2Sidebar>
} />
<Route exact path='/tenant-calendar-main' element={
  <Tenant2Sidebar>
    <CalendarMainLayer/>
  </Tenant2Sidebar>
}/>

    
    
        
        
        
        
        
        <Route path='/superadmin' element={<ErrorLayer />} ></Route>
        <Route path='/propertyowner' element={<ErrorLayer />} ></Route>
        <Route path='/tenant' element={<ErrorLayer />} ></Route> 
        <Route path='/propertymanager' element={<ErrorLayer />} ></Route>
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
        <Route exact path='/subscription-packages' element={<SubscriptionPackages />} />
        <Route path="/subscription/success" element={<SubscriptionSuccess />} />
       
        
       
      

        
        <Route exact path='/subscription' element={<SubscriptionPage />} />
      </Routes>
      </BrowserRouter>
    </ProfileProvider>
  );
}

export default App;
