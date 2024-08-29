import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { createBrowserRouter, RouterProvider} from "react-router-dom";
import App from './App';
import ViewLogin from './pages/ViewLogin';
import HomeMaster from './pages/Home-page-master';
import Home from './pages/Principal';
import Login from './pages/Login';
import SidebarAdmin from './shared-components/Sidebar-admin';
import NewCompany from './pages/Create-company';
import TableCompany from './pages/Table-company';
import HomeAdmin from './pages/Home-page-admin';
import CreateAdministrator from './pages/Create-administrator';
import CreateCampaign from './pages/Create-campaign';
import CreateEmail from './pages/Create-email';
import CreateMailGroup from './pages/Create-mail-group';
import CreatePlan from './pages/Create-plan';
import TableCampaign from './pages/Table-campaign';
import TableClientMail from './pages/Table-client-mail';
import TableCompanie from './pages/Table-companie';
import TableMailGroup from './pages/Table-mail-group';
import TableSubscriber from './pages/Table-subscriber';
import MailList from './pages/Mail-list';
import AdministratorReport from './pages/Administrator-report';
import MasterReport from './pages/Master-report';
import MasterConfiguration from './pages/Master-configuration';
import PlanManagement from './pages/Plan-management';
import ViewPlan from './pages/View-plan';
import CreateClientMail from './pages/Create-client-mail';
import TableAdministrator from './pages/Table-administrator'

const router = createBrowserRouter([
  {
    path: "App", 
    element: (
      <App/>
  ),
  },
  {
    path: "/",
    element: <Home/>
  },
  {
    path: "ViewLogin",
    element: <ViewLogin/>,
  },
  {
    path: "Login",
    element: <Login/>
  },
  {
    path: "HomeMaster",
    element: <HomeMaster/>,
  },
  {
    path:"HomeAdmin",
    element:<HomeAdmin/>
  },
  {
    path: "CreateAdministrator",
    element: <CreateAdministrator/>
  },
  {
    path: "CreateCampaign",
    element: <CreateCampaign/>
  },
  {

    path: "SidebarAdmin",
    element: <SidebarAdmin/>
  },
  {
    path: "NewCompany",
    element: <NewCompany/>
  },
  {
    path: "TableCompany",
    element: <TableCompany/>
  },
  {
    path:"CreateEmail",
    element:<CreateEmail/>
  },
  {
    path:"CreateMailGroup",
    element:<CreateMailGroup/>
  },
  {
    path:"CreatePlan",
    element:<CreatePlan/>
  },
  {
    path:"CreateClientMail",
    element:<CreateClientMail/>
  },
  {
    path:"TableCampaign",
    element:<TableCampaign/>
  },
  {
    path:"TableClientMail",
    element:<TableClientMail/>
  },
  {
    path:"TableCompanie",
    element:<TableCompanie/>
  },
  {
    path:"TableMailGroup",
    element:<TableMailGroup/>
  },
  {
    path:"TableSubscriber",
    element:<TableSubscriber/>
  },
  {
    path:"TableAdministrator",
    element:<TableAdministrator/>
  },
  {
    path:"MailList",
    element:<MailList/>
  },
  {
    path:"AdministratorReport",
    element:<AdministratorReport/>
  },
  {
    path:"MasterReport",
    element:<MasterReport/>
  },
  {
    path:"MasterConfiguration",
    element:<MasterConfiguration/>
  },
  {
    path:"PlanManagement",
    element:<PlanManagement/>
  },
  {
    path:"ViewPlan",
    element:<ViewPlan/>
  }
  

]);


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <RouterProvider router={router} />
);


