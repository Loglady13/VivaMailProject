import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { createBrowserRouter, RouterProvider} from "react-router-dom";
import App from './App';
import ViewLogin from './pages/ViewLogin';
import Home from './pages/Home-page-master';
import Nav from './shared-components/Nav';
import Principal from './pages/Principal';
import Login from './pages/Login';

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
    path: "Nav",
    element: <Nav/>
  },
  {
    path: "/",
    element: <Principal/>
  }

]);


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <RouterProvider router={router} />
);


