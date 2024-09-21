import { createThirdwebClient } from "thirdweb";
import React, { useState, useRef } from "react";
import { hedara, oasis, arbitrum } from "./Networks";
import { gnosis } from "thirdweb/chains";
import { ChainOptions } from "thirdweb/chains";
import ConnectButton from "./ConnectButton";
import { ChatBar } from './ChatArea';
  
export default function Wallet(props: any) {
    const { onConfirm, chain, setChain } = props;
    const [address, setAddress] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const connectButtonRef = useRef<HTMLDivElement>(null);
    const client = createThirdwebClient({ clientId: "4c2cbd9f2ef180383d51b5d796769ea9" });
    const handleChainChange = (chain: ChainOptions) => {
        // @ts-ignore
        setChain(chain);
        setTimeout(() => {
            console.log(connectButtonRef.current);
            // @ts-ignore
            connectButtonRef.current?.firstChild?.click()
        }, 333);
    };
    return <>
        <button onClick={() => {handleChainChange(gnosis)}}>gnosis</button>
        <button onClick={() => {handleChainChange(hedara)}}>hedara</button>
        <button onClick={() => {handleChainChange(oasis)}}>oasis</button>
        <button onClick={() => {handleChainChange(arbitrum)}}>arbitrum</button>
        <ConnectButton
            ref={connectButtonRef}
            client={client}
            chain={chain}
            connectModal={{
                title: "Sign in to MyApp",
                titleIcon: "https://example.com/logo.png",
                size: "compact",
            }}
            
            auth={{
            isLoggedIn: async (address: any) => {
                console.log("checking if logged in!");
                setAddress(address);
                return isLoggedIn;
            },
            doLogin: async (params: any) => {
                console.log("logging in!");
                onConfirm();
                setIsLoggedIn(true);
                setAddress(params.payload.address);
                return params
            },
            getLoginPayload: async ({ address }: any) => {return {address}},
            doLogout: async () => {
                console.log("logging out!");
                setIsLoggedIn(false);
            }
            }}        
        />
    </>;
}