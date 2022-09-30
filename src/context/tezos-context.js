import { useEffect, useState, createContext, useContext} from "react";
import { TezosToolkit } from "@taquito/taquito";
import { BeaconWallet } from "@taquito/beacon-wallet";

const axios = require('axios')

const TezosContext = createContext();
const options = {
  name: 'Sapotezos',
  preferredNetwork: 'ghostnet'
 };
  
const wallet = new BeaconWallet(options);

export const useTezosContext = () => {

  const app = useContext(TezosContext);
  if (!app) {
    throw new Error(
      `!app`
    );
  }
  return app;
};

export const TezosContextProvider = ({ children }) => {
  
  const [app, setApp] = useState("");
  const [address, setAddress] = useState("");
  const [tezos, setTezos] = useState(new TezosToolkit("https://ghostnet.tezos.marigold.dev/"));
  const [activeAccount, setActiveAccount] = useState("");
 

  useEffect(() => {
     const getSynced = async () => {
        if (await wallet?.client?.getActiveAccount()) { 
          setActiveAccount(await wallet?.client?.getActiveAccount());
          const address =  await wallet.getPKH();
          setAddress(address);
          tezos.setWalletProvider(wallet);
          setTezos(tezos)
      }
    };
      getSynced();
    }, [tezos]);
  
  async function sync() {
    await wallet.client.clearActiveAccount();
    await wallet.client.requestPermissions({
      network: {
        type: 'ghostnet',
      },
    });

    tezos.setWalletProvider(wallet);
    setTezos(tezos)
    let address=await wallet.getPKH()
    setAddress(address);
    setActiveAccount(await wallet?.client?.getActiveAccount());
    setApp(app)
  }

  async function unsync() {
    await wallet.client.clearActiveAccount();
    setActiveAccount("")
    setAddress("");

    //  window.location.reload();
  }
  async function sendTezos(amount) {
    const res = await axios.post(
      `${process.env.REACT_APP_SIGNER_URL}/send`,
      {amount:amount,
        address:'tz1XRPyYPj85qUmY9uHRp6JeAHBrKuLvLUni'}
    )
  console.log(res)
    return res.data.hash
  }



  const wrapped = { ...app, tezos, sync, unsync, sendTezos, activeAccount, address};

  return (
   
    <TezosContext.Provider value={wrapped}>
           {children}
    </TezosContext.Provider>
  
  );
};

export default TezosContextProvider;