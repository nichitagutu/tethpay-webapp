import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SendPage from './pages/SendPage.js';
// import ReceivePage from './pages/ReceivePage.js';
import MainPage from './pages/MainPage.js';
import './App.css';
import {
	EthereumClient,
	w3mConnectors,
	w3mProvider
} from '@web3modal/ethereum';
import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import { mainnet, optimism, polygon } from 'wagmi/chains';
import { Web3Modal } from '@nichitagutu/web3modal-react';
import { useEffect, useState } from 'react';
import ReceivePage from './pages/ReceivePage.js';

const projectId = '';

const chains = [mainnet, polygon, optimism];

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
	autoConnect: true,
	connectors: w3mConnectors({ chains, projectId }),
	publicClient
});

const ethereumClient = new EthereumClient(wagmiConfig, chains);

function App() {
	const [ready, setReady] = useState(false);

	useEffect(() => {
		setReady(true);
	}, []);

	return (
		<>
			{ready ? (
				<WagmiConfig config={wagmiConfig}>
					<Router>
						<Routes>
							<Route path="/receive" element={<ReceivePage />} />
							<Route path="/send" element={<SendPage />} />
							<Route path="/" element={<MainPage />} />
						</Routes>
					</Router>
				</WagmiConfig>
			) : null}

			<Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
		</>
	);
}

export default App;
