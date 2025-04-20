// Component types
export interface ComponentVariant {
  _id?: string;
  name: string;
  description: string;
  code: string;
  author?: string;
  deployedLink?: string;
  packageCommands?: string;
  imageUrl?: string;
  componentId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Component {
  _id?: string;
  name: string;
  category: string;
  description: string;
  variants: ComponentVariant[];
  createdAt?: Date;
  updatedAt?: Date;
}

// User types
export interface User {
  walletAddress: string;
  isAdmin: boolean;
}

// WalletContext types
export interface WalletContextType {
  address: string | null;
  isConnecting: boolean;
  isAdmin: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}