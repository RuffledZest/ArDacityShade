import { Outlet } from 'react-router-dom';
import { WalletProvider } from './context/WalletContext';

function App() {
  return (
    <WalletProvider>
      <div className="bg-gray-900 min-h-screen text-white">
        <Outlet />
      </div>
    </WalletProvider>
  );  
}

export default App;