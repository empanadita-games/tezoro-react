import React, { useEffect, useCallback } from "react";
import { useTezosContext } from "./context/tezos-context";
import { Unity, useUnityContext } from "react-unity-webgl";
import { Link, Routes, Route } from "react-router-dom";

// import { About } from './pages/About'
import { Home } from './pages/Home'
import "./styles/styles.css";

function App() {

  const  app = useTezosContext();
  const { addEventListener, removeEventListener } = useUnityContext();
  const { unityProvider, sendMessage, isLoaded } = useUnityContext({
    loaderUrl: "build/sapotezos.loader.js",
    dataUrl: "build/sapotezos.data",
    frameworkUrl: "build/sapotezos.framework.js",
    codeUrl: "build/sapotezos.wasm",
  });

  const handleSync = useCallback(async () => {
    let address=''
    !app.activeAccount ?  (address = await app.sync())
     : address = app.address
    address && sendMessage("GameController", "SetWallet", address );
  }, [app, sendMessage]);

  const handleSendTez = useCallback(async (amount,address) => {
    console.log(address)
    app.activeAccount && await app.sendTezos(amount)
  }, [app, sendMessage]);

  const handleGetHat = useCallback(async () => {
    console.log('get that random')
  }, [app, sendMessage]);

  useEffect(() => {
    addEventListener("ReactGetTezos", handleSendTez);
    addEventListener("TrySyncWallet", handleSync);
    addEventListener("BuyHat", handleGetHat);
    return () => {
      removeEventListener("ReactGetTezos", handleSendTez);
      removeEventListener("TrySyncWallet", handleSync);
    };
  }, [addEventListener, removeEventListener, handleSync, handleSendTez]);
  return(
    <>
    <header>

        {/* {app.address && app.address.substr(0, 5) + "..." + app.address.substr(-5)} */}
      {/* <Link to="/about">about</Link> */}
      <Link to="/">Sapotezos</Link>
      <button onClick={() => !app.activeAccount ? app.sync() : app.unsync()}> 
        {!app.activeAccount ? "wallet not syned" : `${app.address.substr(0, 5) + "..." + app.address.substr(-5)}: unsync` }
      </button>
      </header>
      <button onClick={()=>{app.sendTezos(1)}}>Send</button>
      <p/>
    <div style={{border:'5px solid black', padding: '11px', width: '63vw'}}>
       <Unity
      style={{  
        height: "auto",
        width: "63vw",
        aspectRatio: "16 / 9",
        visibility: isLoaded ? "visible" : "hidden" }}
        unityProvider={unityProvider}
    /> 
    </div>

    
     <div>
     <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/about" element={<About />} /> */}
      </Routes>
    </div>
    
    </>
    )
}

export default App;
