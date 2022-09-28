import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { TezosContextProvider } from "./context/tezos-context";
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
  <BrowserRouter>
  <TezosContextProvider>
    <App />
  </TezosContextProvider>
  </BrowserRouter>,
  document.getElementById("root"),
);
