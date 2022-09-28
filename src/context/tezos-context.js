import { useEffect, useState, createContext, useContext} from "react";
import { TezosToolkit } from "@taquito/taquito";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { InMemorySigner } from '@taquito/signer';


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
          tezos.setProvider({ signer: await InMemorySigner.fromSecretKey(process.env.REACT_APP_KATHMANDU) });
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
    console.log(`Transfering ${amount} ꜩ to ${address}...`);
    tezos.contract.transfer({ to: 'tz1XRPyYPj85qUmY9uHRp6JeAHBrKuLvLUni', amount: parseFloat(amount) })
    .then(op => {
        console.log(`Waiting for ${op.hash} to be confirmed...`);
        return op.confirmation(1).then(() => op.hash);
    })
    .then(hash => console.log(`${hash}`))
    .catch(error => console.log(`Error: ${error} ${JSON.stringify(error, null, 2)}`));
}


  const wrapped = { ...app, tezos, sync, unsync, sendTezos, activeAccount, address};

  return (
   
    <TezosContext.Provider value={wrapped}>
           {children}
    </TezosContext.Provider>
  
  );
};

export default TezosContextProvider;