# 🐸 Tezoro 🐸


![Foto_de_perfil](https://user-images.githubusercontent.com/40881833/193447541-f75be454-ed80-466e-9c92-e7f2a17a1a4d.png)



Tezoro is a retro platformer game where newcomers and regular users alike can learn about Tezos, create their first wallet on the testnet, receive testnet tezos in a minigame and buy their first NFT.

Video demo:
https://youtu.be/kDJOZg93aMk

---


# Characters



* Tezoro \
 \
A wizard frog that can make tezos rain with his powers. He is all about creating community and teaching newcomers by doing.
* The player (you) \
 \
You are the protagonist in this story. This is the beginning of your journey with Tezos. Learn to create a wallet with kukai in the safety of the testnet. \
It doesn’t matter if you’re new to tezos or a veteran,


---


# Objetives:



* Teach new users how to create a wallet
* Teach general users about the testnet
* Teach the meaning of approving a site to connect to your wallet
* Teach the user about about transactions (soon)
* Teach the user how to mint an NFT (soon)


---


# Controls:



* **Movement: Arrows/WASD**
* **Jump: Spacebar**
* **Mobile controls (soon)**
![image](https://user-images.githubusercontent.com/40881833/193447842-2ecf8805-9814-4c2f-8233-0ef01f68f0c6.png)


---

# Linked Repos

https://github.com/empanadita-games/tezoro-unity  
https://github.com/empanadita-games/tezoro-react  
https://github.com/empanadita-games/tezoro-signer  

---

# Technical Notes about the Unity -> Blockchain interactions  

1. We first built a game in Unity, with WebGL as the target platform. We imported .jslib files into the plugins folder and made methods to call them, in order to interact with the react code. This was done following this documentation:    

https://react-unity-webgl.dev/docs/api/event-system    

Unity -> React  
Send a sync request.  

Gamecontroller.cs (C# code)  

    [DllImport("__Internal")]  
    private static extern void TrySyncWallet ();  
        public void CallTrySyncWallet () {  
        #if UNITY_WEBGL == true && UNITY_EDITOR == false  
            TrySyncWallet ();  
        #endif  
        }  

this in turn calls the following method:  

React.jslib (C code)  

  TrySyncWallet: function() {  
    window.dispatchReactUnityEvent("TrySyncWallet");  
  },  
  
 And this method calls the react method with the same name.  

React -> Unity  
  
Get sync confirmaiton  

React then takes care of calling the wallet sync.  

2. We deployed a remote signer server to airdrop testnet tezos to the player. This server is called via a JSon WebRequest from inside Unity's native C# code.  

Unity -> RemoteSigner Server  

3. Finally, we made another call from Unity to React to prompt the airdrop of a random NFT hat.  

Unity -> React  

All the Unity/blockchain code can be found in the "/Assets/Scripts/GameController.cs" and "/Plugins/WebGL/React.jslib" files.  

---


# Gameplay:


# Phase 1: 
Woods
Create a testnet wallet

A call is made from Unity to React using a jslib plugin. React prompts beacon to connect a wallet.
The player is instructed to login with kukai+gmail for ease of use, but they also learn about the more secure 24 words method.

![image](https://user-images.githubusercontent.com/40881833/193447861-bb5610e7-9b00-4667-911e-d0103633527b.png)
![image](https://user-images.githubusercontent.com/40881833/193447791-8a003628-a5cc-4d45-9a49-a58b9c8f4813.png)
![image](https://user-images.githubusercontent.com/40881833/193447814-3d5d5418-3766-4ff7-92ef-2a2ecc6f6727.png)
![image](https://user-images.githubusercontent.com/40881833/193447871-224e3dc8-32ab-449a-8345-4c5f535f249b.png)


# Phase 2
## Woods
Get Testnet Tezos

The wizard frog makes the sky rain tezos.
The player collects tezos in a mini-game and then gets them airdropped to their testnet wallet using a remote server signer which is called from Unity with a webrequest using json.

![image](https://user-images.githubusercontent.com/40881833/193447896-01e20c10-81a9-4a76-a397-60aca6b7e04f.png)
![image](https://user-images.githubusercontent.com/40881833/193447915-16a3551a-dcb7-4d2d-9013-561e573c4c60.png)


# Phase 3 
## Tezoro City

![image](https://user-images.githubusercontent.com/40881833/193447941-c4484fbb-4606-4d17-9b03-c371d7f26e31.png)

Acquire an NFT

The player visits a hat shop called FXHAT and gets airdropped a random hat to his ghostnet wallet, as a memento of his adventure.

# Phase 4
## Ciudad Tezoro
Goodbye y and how to create a wallet in mainnet (soon)

The player learns how to create a real wallet with the experience he gained here. (soon)

Empanadita games <br/>

Art & Music - @toronja_gb <br/>
Game Design - @2box_tez <br/>
Unity Programmer - @srezu_tz <br/>
Blockchain Programmer - @tezosmiami <br/>
