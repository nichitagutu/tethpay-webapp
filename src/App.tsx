import {
	EthereumClient,
	w3mConnectors,
	w3mProvider
} from '@web3modal/ethereum';
import { Web3Modal } from '@nichitagutu/web3modal-react';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { mainnet, optimism, polygon } from 'wagmi/chains';
import { useEffect, useState } from 'react';

import Header from './components/Header.js';
import Body from './components/Body.js';

import './App.css';

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
					<div className="app-wrapper">
						<Header />
						<Body />
					</div>
				</WagmiConfig>
			) : null}

			<Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
		</>
	);
}

export default App;
