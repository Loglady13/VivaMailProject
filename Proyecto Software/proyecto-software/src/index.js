import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from './App';
import Login from './components/Login';
import Home from './components/Home';

const router = createBrowserRouter([
  {
    path: "Login",
    element: <Login/>,
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

]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

