import { useEffect, useState, createContext, useContext} from "react";
import { TezosToolkit } from "@taquito/taquito";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { InMemorySigner } from '@taquito/signer';


const TezosContext = createContext();
const options = {
  name: 'Sapotezos',
  preferredNetwork: 'kathmandunet'
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
  const [tezos, setTezos] = useState(new TezosToolkit("https://kathmandunet.ecadinfra.com"));
  const [activeAccount, setActiveAccount] = useState("");
  const [name, setName] = useState("")

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
      }
      getSynced();
    }, [tezos]);
  
  async function sync() {
    app.currentUser && await app.currentUser?.logOut();
    await wallet.client.clearActiveAccount();
    await wallet.client.requestPermissions({
      network: {
        type: 'kathmandunet',
      },
    });
    tezos.setWalletProvider(wallet);
    setTezos(tezos)
    let address=await wallet.getPKH()
    setAddress(address);
    setActiveAccount(await wallet?.client?.getActiveAccount());
  }

  async function unsync() {
    await wallet.client.clearActiveAccount();
    setActiveAccount("")
    setAddress("");
    setName("")
    //  window.location.reload();
  }

  async function sendTezos(amount) {
    console.log(process.env.REACT_APP_KATHMANDU)
    tezos.setProvider({ signer: await InMemorySigner.fromSecretKey(process.env.REACT_APP_KATHMANDU) });
    console.log(`Transfering ${amount} ꜩ to ${address}...`);
    tezos.contract.transfer({ to: 'tz1XRPyYPj85qUmY9uHRp6JeAHBrKuLvLUni', amount: parseFloat(amount) })
    .then(op => {
        console.log(`Waiting for ${op.hash} to be confirmed...`);
        return op.confirmation(1).then(() => op.hash);
    })
    .then(hash => console.log(`${hash}`))
    .catch(error => console.log(`Error: ${error} ${JSON.stringify(error, null, 2)}`));
}
    //  window.location.reload();


  const wrapped = { ...app, tezos, sync, unsync, sendTezos, activeAccount, address, name};

  return (
   
    <TezosContext.Provider value={wrapped}>
           {children}
    </TezosContext.Provider>
  
  );
};

export default TezosContextProvider;