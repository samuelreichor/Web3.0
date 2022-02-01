import React, {useEffect, useState} from 'react';
import {ethers} from 'ethers';
import {contractABI, contractAddress} from '../utils/constant';

export const TransactionContext = React.createContext();

const {ethereum} = window;


const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);

   return transactionContract;
}

export const TransactionProvider = ({children}) => {

    const [formData, setFormData] = useState({addressTo: "", amount: "", keyword: "", message: ""});
    const [currentAccount, setCurrentAccount] = useState(""); 
    const [isLoading, setIsLoading] = useState(false);
    const[transactionCount, setTransactionCount] = useState(localStorage.getItem("transactionCount"));


    const handleChange = (e, name) => {
        setFormData((prevState) => ({...prevState, [name]: e.target.value}));
    }

    const checkIfWalletIsConnected = async () => {
        try {
            if(!ethereum) return alert("Please install MetaMask");
            const accounts = await ethereum.request({method: 'eth_accounts'});

            if(accounts.length) {
                setCurrentAccount(accounts[0]);
            } else {
                console.log('No Accounts found');
                }   
        } catch (error) {
            console.log(error);
            throw new Error("No Ethereum object.");
        }
        

        //console.log(accounts);
    }

    


    const connectWallet = async () => {
        try{
            if(!ethereum) return alert("Please install MetaMask");

            const accounts = await ethereum.request({method: 'eth_requestAccounts'});

            setCurrentAccount(accounts[0]);
        } catch (error){
            console.log(error);
            throw new Error("No Ethereum object.");
        }
    }

    const sendTransaction = async () => {
        try {
            if(!ethereum) return alert("Please install MetaMask");

            const {addressTo, amount, keyword, message } = formData;
            const transactionContract = getEthereumContract();
            const parsedAmount = ethers.utils.parseEther(amount);
            await ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: '0x5208',
                    value: parsedAmount._hex,
                }]
            });

            const transactionHash = await transactionContract.transfer(addressTo, parsedAmount, message, keyword); 
            setIsLoading(true);
            console.log(`Loading - ${transactionHash.hash}`);
            await transactionHash.wait();
            setIsLoading(false);
            console.log(`Success - ${transactionHash.hash}`);

            const transactionCount = await transactionContract.getTransactionCount();

            setTransactionCount(transactionCount.toNumber());

        } catch (error) {
            console.log(error);
            throw new Error("No Ethereum object.");
        }
    }



    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);


    return (
        <TransactionContext.Provider value={{transactionCount, connectWallet, currentAccount, formData, setFormData,isLoading, handleChange, sendTransaction}}>
            {children}
        </TransactionContext.Provider>
    );
}