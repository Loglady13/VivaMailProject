import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { createBrowserRouter, RouterProvider} from "react-router-dom";
import App from './App';
import ViewLogin from './pages/ViewLogin';
import Home from './pages/Home-page-master';
import Principal from './pages/Principal';
import Login from './pages/Login';
import SidebarMaster from './shared-components/Sidebar-master';
import SidebarAdmin from './shared-components/Sidebar-admin';
import NewCompany from './pages/Create-company';
import ViewCompany from './pages/View-companies';

const router = createBrowserRouter([
  {
    path: "ViewLogin",
    element: <ViewLogin/>,
  },
  {
    path: "Login",
    element: <Login/>
  },
  {
    path: "App", 
    element: (
      <App/>
  ),
  },
  {
    path: "Home",
    element: <Home/>,
  },
  {
    path: "SidebarMaster",
    element: <SidebarMaster/>
  },
  {
    path: "/",
    element: <Principal/>
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
    path: "ViewCompany",
    element: <ViewCompany/>
  }

]);


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <RouterProvider router={router} />
);


