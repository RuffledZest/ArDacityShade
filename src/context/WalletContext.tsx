import React, { createContext, useContext, useEffect, useState } from 'react';
import { WalletContextType } from '../types';

// Create context with default values
const WalletContext = createContext<WalletContextType>({
  address: null,
  isConnecting: false,
  isAdmin: false,
  connect: async () => {},
  disconnect: async () => {}
});

// Admin wallet address
const ADMIN_ADDRESS = "ZifcjgKLVpnPInkBSRA3pe4A9Niwop-3uevJP4PDPH0";

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(localStorage.getItem('walletAddress'));
  const [isConnecting, setIsConnecting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if wallet is already connected on mount
  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        const addr = localStorage.getItem('walletAddress');
        if (addr) {
          setAddress(addr);
          setIsAdmin(addr === ADMIN_ADDRESS);
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
      }
    };

    checkWalletConnection();
  }, []);

  // Connect wallet
  const connect = async () => {
    setIsConnecting(true);
    try {
      if (!window.arweaveWallet) {
        console.log("For testing, setting mock wallet address");
        // Mock wallet connection for testing
        const mockAddress = "test-wallet-address";
        setAddress(mockAddress);
        localStorage.setItem('walletAddress', mockAddress);
        return;
      }

      await window.arweaveWallet.connect(
        ['ACCESS_ADDRESS', 'SIGN_TRANSACTION', 'ACCESS_TOKENS'],
        {
          name: 'Anon',
          logo: 'https://arweave.net/jAvd7Z1CBd8gVF2D6ESj7SMCCUYxDX_z3vpp5aHdaYk',
        },
        {
          host: 'g8way.io',
          port: 443,
          protocol: 'https',
        }
      );

      const walletAddress = await window.arweaveWallet.getActiveAddress();
      setAddress(walletAddress);
      localStorage.setItem('walletAddress', walletAddress);
      setIsAdmin(walletAddress === ADMIN_ADDRESS);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      // For testing - set a mock address anyway
      const mockAddress = "test-wallet-address";
      setAddress(mockAddress);
      localStorage.setItem('walletAddress', mockAddress);
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnect = async () => {
    try {
      if (window.arweaveWallet) {
        await window.arweaveWallet.disconnect();
      }
      setAddress(null);
      setIsAdmin(false);
      localStorage.removeItem('walletAddress');
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  };

  return (
    <WalletContext.Provider value={{ address, isConnecting, isAdmin, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
};

// Custom hook to use wallet context
export const useWallet = () => useContext(WalletContext);

// Add type declaration for window.arweaveWallet
declare global {
  interface Window {
    arweaveWallet?: {
      connect: (
        permissions: string[],
        appInfo: {
          name: string;
          logo: string;
        },
        gateway: {
          host: string;
          port: number;
          protocol: string;
        }
      ) => Promise<void>;
      disconnect: () => Promise<void>;
      getActiveAddress: () => Promise<string>;
    };
  }
}