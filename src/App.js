import { BrowserRouter, Route, Routes } from "react-router-dom";

import MaintenancePage from "./pages/MaintenancePageTenant";


import EmailPage from "./pages/EmailPage";
import AddUserPage from "./pages/AddUserPage";
import AlertPage from "./pages/AlertPage";
import AssignRolePage from "./pages/AssignRolePage";


import CalendarMainPage from "./pages/CalendarMainPage";
import CardPage from "./pages/CardPage";

import ChatEmptyPage from "./pages/ChatEmptyPage";
import ChatMessagePage from "./pages/ChatMessagePage";
import ChatProfilePage from "./pages/ChatProfilePage";


import ColorsPage from "./pages/ColorsPage";
import ColumnChartPage from "./pages/ColumnChartPage";
import CompanyLayer from "./components/CompanyLayer";
import PropertyManager2Sidebar from "./components/PropertyManager2Sidebar";
import CompanyPage from "./pages/CompanyPage";
import CurrenciesPage from "./pages/CurrenciesPage";
import DropdownPage from "./pages/DropdownPage";
import ErrorPage from "./pages/ErrorPage";
import SuperAdminCombinedDashboard from "./components/SuperAdminCombinedDashboard";
import PropertyManagerCombinedDashboard from "./components/PropertyManagerCombinedDashboard";
import FaqPage from "./pages/FaqPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import FormLayoutPage from "./pages/FormLayoutPage";
import FormValidationPage from "./pages/FormValidationPage";
import FormPage from "./pages/FormPage";
import GalleryPage from "./pages/GalleryPage";
import ImageGeneratorPage from "./pages/ImageGeneratorPage";
import ImageUploadPage from "./pages/ImageUploadPage";
import InvoiceAddPage from "./pages/InvoiceAddPage";
import InvoiceEditPage from "./pages/InvoiceEditPage";
import InvoiceListPage from "./pages/InvoiceListPage";
import InvoicePreviewPage from "./pages/InvoicePreviewPage";
import KanbanPage from "./pages/KanbanPage";
import LanguagePage from "./pages/LanguagePage";
import SignUp from './pages1/SignUp';

import ListPage from "./pages/ListPage";
import MarketplaceDetailsPage from "./pages/MarketplaceDetailsPage";
import MarketplacePage from "./pages/MarketplacePage";
import NotificationAlertPage from "./pages/NotificationAlertPage";
import NotificationPage from "./pages/NotificationPage";
import PaginationPage from "./pages/PaginationPage";
import PaymentGatewayPage from "./pages/PaymentGatewayPage";
import Paymentpage from './components/payment/PaymentPage'
import PaymentSuccess from './components/payment/PaymentSuccess'
import CheckoutForm from './components/payment/CheckoutForm'

import PortfolioPage from "./pages/PortfolioPage";
import PricingPage from "./pages/PricingPage";
import ProgressPage from "./pages/ProgressPage";
import Payments1 from "./pages1/Payments1";

import RoleAccessPage from "./pages/RoleAccessPage";
import SignIn from './pages1/SignIn';
import StarRatingPage from "./pages/StarRatingPage";
import StarredPage from "./pages/StarredPage";
import SwitchPage from "./pages/SwitchPage";
import TableBasicPage from "./pages/TableBasicPage";
import TableDataPage from "./pages/TableDataPage";
import TabsPage from "./pages/TabsPage";

import TermsConditionPage from "./pages/TermsConditionPage";

import ThemePage from "./pages/ThemePage";

import UsersGridPage from "./pages/UsersGridPage";
import UsersListPage from "./pages/UsersListPage";
import OwnersListPage from "./pages/OwnersListPage";
import ViewDetailsPage from "./pages/ViewDetailsPage";

import ViewProfilePage from "./pages/ViewProfilePage";


import RouteScrollToTop from "./helper/RouteScrollToTop";


import PaymentPage from "./components/payment/PaymentPage";
import GalleryGridPage from "./pages/GalleryGridPage";
import GalleryMasonryPage from "./pages/GalleryMasonryPage";
import GalleryHoverPage from "./pages/GalleryHoverPage";

import TestimonialsPage from "./pages/TestimonialsPage";
import ComingSoonPage from "./pages/ComingSoonPage";
import AccessDeniedPage from "./pages/AccessDeniedPage";

import PropertyOwnerSidebar from "./components/PropertyOwnerSidebar";

import PropertyOwnerCombinedDashboard from './components/PropertyOwnerCombinedDashboard';
import TenantSidebar from "./components/TenantSidebar";

import TenantCombinedDashboard from './components/TenantCombinedDashboard';
import PropertyManagerSidebar from "./components/PropertyManagerSidebar";

import SuperAdminSidebar from "./components/SuperAdminSidebar";
import MaintenancePageTenant from "./pages/MaintenancePageTenant";
import PropertyList from "./pages/PropertyListPropertyOwner";
import TenantsList from "./pages/TenantsList";
import LeasePropertyOwner from "./pages/LeasePropertyOwner";
import InvoicePropertyOwner from "./pages/InvoicePropertyOwner";
import MaintainancePropertyOwner from "./pages/MaintainancePropertyOwner";
import PropertyManagerList from "./pages/PropertyManagerList";
import PropertyListPropertyOwner from "./pages/PropertyListPropertyOwner";
import PropertyListPropertyManager from "./pages/PropertyListPropertyManager";
import MaintainancePropertyManager from "./pages/MaintainancePropertyManager";
import InvoiceTenant from "./pages/InvoiceTenant";
import Tenant2Sidebar from "./components/Tenant2Sidebar";
import Sa2Sidebar from "./components/Sa2Sidebar";
import PropertyOwner2Sidebar from "./components/PropertyOwner2Sidebar";
import PaymentsTenants from "./pages/PaymentsTenants";
function App() {
  return (
    <BrowserRouter>
      <RouteScrollToTop />
      <Routes>
        <Route exact path='/signup' element={<SignUp />} />
        <Route exact path='/signin' element={<SignIn />} />
        <Route exact path='/tenant-dashboard' element={<TenantSidebar />} />
        <Route exact path='/super-admin-dashboard' element={<SuperAdminSidebar />} />
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
        <Route exact path='/add-user' element={<AddUserPage />} />
        <Route exact path='/alert' element={<AlertPage />} />
        <Route exact path='/assign-role' element={<AssignRolePage />} />
       
        
    
        <Route exact path='/payments1' element={<Payments1/>} />
        <Route exact path='/calendar' element={<CalendarMainPage />} />
        <Route exact path='/card' element={<CardPage />} />
     
        <Route exact path='/chat-empty' element={<ChatEmptyPage />} />
        <Route exact path='/chat-message' element={<ChatMessagePage />} />
        <Route exact path='/chat-profile' element={<ChatProfilePage />} />
        
        <Route path="/pay/:invoiceId/" element={<Paymentpage/>} />
        <Route path="/payment-success/:invoiceId" element={<PaymentSuccess />} />
        <Route exact path='/colors' element={<ColorsPage />} />
        <Route exact path='/column-chart' element={<ColumnChartPage />} />
        <Route exact path='/company' element={<CompanyPage />} />
        <Route exact path='/currencies' element={<CurrenciesPage />} />
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
        <Route exact path='/dropdown' element={<DropdownPage />} />
        <Route exact path='/email' element={<EmailPage />} />
        <Route exact path='/faq' element={<FaqPage />} />
        <Route exact path='/forgot-password' element={<ForgotPasswordPage />} />
        <Route exact path='/form-layout' element={<FormLayoutPage />} />
        <Route exact path='/form-validation' element={<FormValidationPage />} />
        <Route exact path='/form' element={<FormPage />} />

        <Route exact path='/gallery' element={<GalleryPage />} />
        <Route exact path='/gallery-grid' element={<GalleryGridPage />} />
        <Route exact path='/gallery-masonry' element={<GalleryMasonryPage />} />
        <Route exact path='/gallery-hover' element={<GalleryHoverPage />} />

        
       

        <Route exact path='/testimonials' element={<TestimonialsPage />} />
        <Route exact path='/coming-soon' element={<ComingSoonPage />} />
        <Route exact path='/access-denied' element={<AccessDeniedPage />} />
        <Route exact path='/maintenance' element={<MaintenancePage />} />
        

        <Route exact path='/image-generator' element={<ImageGeneratorPage />} />
        <Route exact path='/image-upload' element={<ImageUploadPage />} />
        <Route exact path='/invoice-add' element={<InvoiceAddPage />} />
        <Route exact path='/invoice-edit' element={<InvoiceEditPage />} />
        <Route exact path='/invoice-list' element={<InvoiceListPage />} />
        <Route path="/invoice-preview/:invoiceId" element={<InvoicePreviewPage />} />
        <Route exact path='/kanban' element={<KanbanPage />} />
        <Route exact path='/languages' element={<LanguagePage />} />
        
        <Route exact path='/list' element={<ListPage />} />
        <Route
          exact
          path='/marketplace-details'
          element={<MarketplaceDetailsPage />}
        />
        <Route exact path='/marketplace' element={<MarketplacePage />} />
        <Route
          exact
          path='/notification-alert'
          element={<NotificationAlertPage />}
        />
        <Route exact path='/notification' element={<NotificationPage />} />
        <Route exact path='/pagination' element={<PaginationPage />} />
        <Route exact path='/payment-gateway' element={<PaymentGatewayPage />} />
      
        <Route exact path='/portfolio' element={<PortfolioPage />} />
        <Route exact path='/pricing' element={<PricingPage />} />
        <Route exact path='/progress' element={<ProgressPage />} />
     

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
        <Route exact path='/role-access' element={<RoleAccessPage />} />
        <Route exact path='/star-rating' element={<StarRatingPage />} />
        <Route exact path='/starred' element={<StarredPage />} />
        <Route exact path='/switch' element={<SwitchPage />} />
        <Route exact path='/table-basic' element={<TableBasicPage />} />
        <Route exact path='/table-data' element={<TableDataPage />} />
        <Route exact path='/tabs' element={<TabsPage />} />
        
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
       
        
       
      

        <Route exact path='*' element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
