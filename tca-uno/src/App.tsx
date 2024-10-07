import React from 'react';
import logo from './logo.svg';
import './App.css';
import {
  createHashRouter,
  RouterProvider,
} from "react-router-dom";

import { Home } from "./Home";
import { Setup } from "./Setup";
import { Play } from "./Play";

const myRouter = createHashRouter(
  [
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/setup",
      element: <Setup />,
    },
    {
      path: "/play",
      element: <Play />,
    },    
  ]
);

const App = () => {
  return (
    <div
      className="App p-3"
    >
      <RouterProvider 
        router={myRouter}
      />
    </div>
  );
}

export default App;