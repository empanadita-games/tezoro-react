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
  const { unityProvider, isLoaded } = useUnityContext({
    loaderUrl: "build/sapotezos.loader.js",
    dataUrl: "build/sapotezos.data",
    frameworkUrl: "build/sapotezos.framework.js",
    codeUrl: "build/sapotezos.wasm",
  });
  const handleSync = useCallback(() => {
    !app.activeAccount ? app.sync() : console.log('synced') 
  }, [app]);

  useEffect(() => {
    addEventListener("TrySyncWallet", handleSync);
    return () => {
      removeEventListener("TrySyncWallet", handleSync);
    };
  }, [addEventListener, removeEventListener, handleSync]);
  
  return(
    <>
    <header>

        {app.address && app.address.substr(0, 5) + "..." + app.address.substr(-5)}
      {/* <Link to="/about">about</Link> */}
      <Link to="/">Sapotezos</Link>
      <button onClick={() => !app.activeAccount ? app.sync() : app.unsync()}> 
        {!app.activeAccount ? "sync" : "unsync"}
      </button>
      </header>  
      {/* <button onClick={()=>{app.sendTezos(1)}}>Send</button> */}
      <p/>
    <div>
       <Unity
      style={{  height: "auto",
      width: "60vw",
      aspectRatio: "4 / 3",
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
