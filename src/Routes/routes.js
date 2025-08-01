import React from "react";
import { Navigate } from "react-router-dom";

//Dashboard
import Dashboard from "../Pages/Dashboard";

// Import Calender
import Calender from "../Pages/Calender";

// Import E-mail
import Inbox from "../Pages/E-mail/Inbox";
import ReadEmail from "../Pages/E-mail/ReadEmail";
import EmailCompose from "../Pages/E-mail/EmailCompose";

// Import Authentication pages
import Login from "../Pages/Authentication/Login";
import ForgetPasswordPage from "../Pages/Authentication/ForgetPassword";
import Logout from "../Pages/Authentication/Logout";
import Register from "../Pages/Authentication/Register";
import UserProfile from "../Pages/Authentication/user-profile";

// Import Authentication Inner Pages
import Login1 from "../Pages/AuthenticationPages/Login";
import Register1 from "../Pages/AuthenticationPages/Register";
import RecoverPassword from "../Pages/AuthenticationPages/RecoverPassword";
import LockScreen from "../Pages/AuthenticationPages/LockScreen";

// Import Utility Pages
import StarterPage from "../Pages/Utility/Starter-Page";
import Maintenance from "../Pages/Utility/Maintenance-Page";
import ComingSoon from "../Pages/Utility/ComingSoon-Page";
import TimeLine from "../Pages/Utility/TimeLine-Page";
import Pricing from "../Pages/Utility/Pricing-Page";
import Error404 from "../Pages/Utility/Error404-Page";
import Error500 from "../Pages/Utility/Error500-Page";

// Import UIElement Pages
import UiAlerts from "../Pages/UiElements/UiAlerts";
import UiBadge from "../Pages/UiElements/UiBadge";
import UiBreadcrumb from "../Pages/UiElements/UiBreadcrumb";
import UiButtons from "../Pages/UiElements/UiButtons";
import UiCards from "../Pages/UiElements/UiCards";
import UiCarousel from "../Pages/UiElements/UiCarousel";
import UiDropdown from "../Pages/UiElements/UiDropdowns";
import UiGrid from "../Pages/UiElements/UiGrid";
import UiImages from "../Pages/UiElements/UiImages";
import UiLightbox from "../Pages/UiElements/UiLightbox";
import UiModals from "../Pages/UiElements/UiModals";
import UiOffcanvas from "../Pages/UiElements/UiOffcanvas";
import UiRangeSlider from "../Pages/UiElements/UiRangeSlider";
import UiSessionTimeout from "../Pages/UiElements/UiSessionTimeout";
import UiPagination from "../Pages/UiElements/UiPagination";
import UiProgressBars from "../Pages/UiElements/UiProgressBars";
import UiPlaceholders from "../Pages/UiElements/UiPlaceholders";
import UiTabs from "../Pages/UiElements/UiTabs&Accordions";
import UiTypography from "../Pages/UiElements/UiTypography";
import UiToasts from "../Pages/UiElements/UiToasts";
import UiVideo from "../Pages/UiElements/UiVideo";
import UiPopovers from "../Pages/UiElements/UiPopovers&Tooltips";
import UiRating from "../Pages/UiElements/UiRating";

// Import Forms
import FormEditors from "../Pages/Forms/FormEditors";
import FormUpload from "../Pages/Forms/FormUpload";
import FormMask from "../Pages/Forms/FormMask";
import FormElements from "../Pages/Forms/FormElements";
import FormAdvanced from "../Pages/Forms/FormAdvanced";
import FormValidations from "../Pages/Forms/FormValidations";
import FormWizard from "../Pages/Forms/FormWizard";

// Import Tables
import BasicTable from "../Pages/Tables/BasicTable.js";
import ListJs from "../Pages/Tables/ListTables/ListTables";
import DataTable from "../Pages/Tables/DataTables/DataTables";

// Import Charts
import ApexCharts from "../Pages/Charts/ApexCharts";
import ChartJs from "../Pages/Charts/ChartjsCharts";
import Sparklinechart from "../Pages/Charts/SparklineCharts";
import FloatChart from "../Pages/Charts/FloatCharts";
import JknobCharts from "../Pages/Charts/JqueryKnobCharts";

// Import Icon Pages
import IconMaterialdesign from "../Pages/Icons/IconMaterialdesign";
import IconFontawesome from "../Pages/Icons/IconFontAwesome";
import IconDripicons from "../Pages/Icons/IconDrip";
import IconBoxicons from "../Pages/Icons/IconBoxicons";

// Import Map Pages
import VectorMaps from "../Pages/Maps/VectorMap";
import MapsGoogle from "../Pages/Maps/GoogleMap.js";

// Import Patients Pages
import PatientsMonitored from "../Pages/Patients/Monitored";
import PatientsNotMonitored from "../Pages/Patients/NotMonitored";
import PatientsGuardians from "../Pages/Patients/Guardians";
import PatientDetail from "../Pages/Patients/PatientDetail";

// Import Notifications Pages
import NotificationsMessages from "../Pages/Notifications/Messages";
import NotificationsClinicalInstructions from "../Pages/Notifications/ClinicalInstructions";
import NotificationsAdditionalScans from "../Pages/Notifications/AdditionalScans";
import NotificationsAppNotActivated from "../Pages/Notifications/AppNotActivated";

// Import ToDoList Page
import ToDoList from "../Pages/TodoList";
import QuickReplies from "../Pages/QuickReplies";

// Import MyAccount
import MyAccount from "../Pages/Account/MyAccount";
import Settings from "../Pages/Settings";
import ScanNotificationFrequency from "../Pages/Settings/ScanNotificationFrequency";
import EntitiesList from "../Pages/Settings/EntitiesList";
import Reminders from "../Pages/Settings/Reminders";
import PhotoUploadReminder from "../Pages/Settings/PhotoUploadReminder";
import NextStepReminder from "../Pages/Settings/NextStepReminder";
import GenericData from "../Pages/Settings/GenericData.js";
import ApplicationSettings from "../Pages/Settings/ApplicationSettings";
import TreatmentPlans from "../Pages/Settings/TreatmentPlans";
import VideoTtutorials from "../Pages/Settings/VideoTtutorials";
import DoctorsList from "../Pages/Doctors/DoctorsList";
import OrderDetail from "../Pages/Orders/OrderDetail";
import OrderList from "../Pages/Orders/OrderList";
import FAQs from "../Pages/Settings/FAQs";
import ContactUs from "../Pages/Settings/ContactUs";
import { Instructions, AlignerTips, ImpressionsGuide } from "../Pages/Settings";

function RedirectToMainPage() {
  return <Navigate to="/notifications/messages" />;
}

const authProtectedRoutes = [
  //dashboard
  { path: "/dashboard", component: <Dashboard /> },

  // Settings Pages
  { path: "/settings", component: <Settings /> },
  { path: "/settings/application-settings", component: <ApplicationSettings /> },
  { path: "/settings/users", component: <Settings /> },
  { path: "/settings/doctors", component: <Settings /> },
  { path: "/settings/patients", component: <Settings /> },
  { path: "/settings/dropdown-settings/:id", component: <GenericData /> },
  { path: "/settings/scan-notification-frequency", component: <ScanNotificationFrequency /> },
  { path: "/settings/sms-templates", component: <Settings /> },
  { path: "/settings/email-templates", component: <Settings /> },
  { path: "/settings/dropdown-settings", component: <EntitiesList /> },
  { path: "/settings/reminders", component: <Reminders /> },
  { path: "/settings/photo-upload-reminder", component: <PhotoUploadReminder /> },
  { path: "/settings/next-step-reminder", component: <NextStepReminder /> },
  { path: "/settings/treatment-plans", component: <TreatmentPlans /> },
  { path: "/settings/video-tutorials", component: <VideoTtutorials /> },
  { path: "/settings/faqs", component: <FAQs /> },
  { path: "/settings/contact-us", component: <ContactUs /> },
  { path: "/settings/instructions", component: <Instructions /> },
  { path: "/settings/aligner-tips", component: <AlignerTips /> },
  { path: "/settings/impressions-guide", component: <ImpressionsGuide /> },

  // Calender
  { path: "/calendar", component: <Calender /> },

  // Profile
  { path: "/userprofile", component: <UserProfile /> },

  // E-mail
  { path: "/inbox", component: <Inbox /> },
  { path: "/read-email", component: <ReadEmail /> },
  { path: "/compose-email", component: <EmailCompose /> },

  // Utility Pages
  { path: "/pages-starter", component: <StarterPage /> },
  { path: "/pages-timeline", component: <TimeLine /> },
  { path: "/pages-faqs", component: <FAQs /> },
  { path: "/pages-pricing", component: <Pricing /> },

  // UiElements Pages
  { path: "/ui-alerts", component: <UiAlerts /> },
  { path: "/ui-badge", component: <UiBadge /> },
  { path: "/ui-breadcrumb", component: <UiBreadcrumb /> },
  { path: "/ui-buttons", component: <UiButtons /> },
  { path: "/ui-cards", component: <UiCards /> },
  { path: "/ui-carousel", component: <UiCarousel /> },
  { path: "/ui-dropdowns", component: <UiDropdown /> },
  { path: "/ui-grid", component: <UiGrid /> },
  { path: "/ui-images", component: <UiImages /> },
  { path: "/ui-lightbox", component: <UiLightbox /> },
  { path: "/ui-modals", component: <UiModals /> },
  { path: "/ui-offcanvas", component: <UiOffcanvas /> },
  { path: "/ui-rangeslider", component: <UiRangeSlider /> },
  { path: "/ui-sessiontimeout", component: <UiSessionTimeout /> },
  { path: "/ui-pagination", component: <UiPagination /> },
  { path: "/ui-progressbars", component: <UiProgressBars /> },
  { path: "/ui-placeholders", component: <UiPlaceholders /> },
  { path: "/ui-tabs-accordions", component: <UiTabs /> },
  { path: "/ui-typography", component: <UiTypography /> },
  { path: "/ui-toasts", component: <UiToasts /> },
  { path: "/ui-video", component: <UiVideo /> },
  { path: "/ui-popovers", component: <UiPopovers /> },
  { path: "/ui-rating", component: <UiRating /> },

  // Forms pages
  { path: "/form-elements", component: <FormElements /> },
  { path: "/form-validation", component: <FormValidations /> },
  { path: "/form-advanced", component: <FormAdvanced /> },
  { path: "/form-editor", component: <FormEditors /> },
  { path: "/form-uploads", component: <FormUpload /> },
  { path: "/form-wizard", component: <FormWizard /> },
  { path: "/form-mask", component: <FormMask /> },

  // Tables pages
  { path: "/tables-basic", component: <BasicTable /> },
  { path: "/tables-listjs", component: <ListJs /> },
  { path: "/table-datatables", component: <DataTable /> },

  // Charts Pages
  { path: "/chart-apexcharts", component: <ApexCharts /> },
  { path: "/chart-chartjscharts", component: <ChartJs /> },
  { path: "/chart-floatcharts", component: <FloatChart /> },
  { path: "/chart-jknobcharts", component: <JknobCharts /> },
  { path: "/chart-sparklinecharts", component: <Sparklinechart /> },

  // Icons Pages
  { path: "/icon-boxicon", component: <IconBoxicons /> },
  { path: "/icons-materialdesign", component: <IconMaterialdesign /> },
  { path: "/icons-fontawesome", component: <IconFontawesome /> },
  { path: "/icon-dripicons", component: <IconDripicons /> },

  // Maps Pages
  { path: "/maps-vector", component: <VectorMaps /> },
  { path: "/maps-google", component: <MapsGoogle /> },

  // Patients Pages
  { path: "/patients", component: <PatientsMonitored /> },
  { path: "/patients/not-monitored", component: <PatientsNotMonitored /> },
  { path: "/patients/guardians", component: <PatientsGuardians /> },
  { path: "/patients/:id/*", component: <PatientDetail /> },

  // Notifications Pages
  { path: "/notifications/messages", component: <NotificationsMessages /> },
  {
    path: "/notifications/clinical-instructions",
    component: <NotificationsClinicalInstructions />,
  },
  {
    path: "/notifications/additional-scans",
    component: <NotificationsAdditionalScans />,
  },
  {
    path: "/notifications/app-not-activated",
    component: <NotificationsAppNotActivated />,
  },

  // ToDoList Pages
  { path: "/todo/monitored", component: <ToDoList /> },
  { path: "/todo/not-monitored", component: <ToDoList /> },
  { path: "/todo/guardians", component: <ToDoList /> },
  { path: "/todo-list", component: <ToDoList /> },

  // Quick Replies Page
  { path: "/quick-replies", component: <QuickReplies /> },

  // MyAccount Page
  { path: "/my-account", component: <MyAccount /> },

  // Doctors Pages
  { path: "/doctors", component: <DoctorsList /> },

  // Orders Pages
  { path: "/orders", component: <OrderList /> },
  { path: "/orders/detail", component: <OrderDetail /> },

  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  {
    path: "/",
    exact: true,
    component: <Navigate to="/dashboard" />,
  },
];

const publicRoutes = [
  // Authentication Page
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login1 /> },
  { path: "/forgot-password", component: <ForgetPasswordPage /> },
  { path: "/register", component: <Register /> },

  // Authentication Inner Pages
  { path: "/auth-login", component: <Login1 /> },
  { path: "/auth-register", component: <Register1 /> },
  { path: "/auth-recoverpw", component: <RecoverPassword /> },
  { path: "/auth-lock-screen", component: <LockScreen /> },

  // Utility Pages
  { path: "/pages-404", component: <Error404 /> },
  { path: "/pages-500", component: <Error500 /> },
  { path: "/pages-maintenance", component: <Maintenance /> },
  { path: "/pages-comingsoon", component: <ComingSoon /> },
];

export { authProtectedRoutes, publicRoutes };
