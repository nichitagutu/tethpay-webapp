import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {
	EthereumClient,
	w3mConnectors,
	w3mProvider
} from '@web3modal/ethereum';
import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import { mainnet, optimism, polygon } from 'wagmi/chains';
import { Web3Modal } from '@nichitagutu/web3modal-react';

import SendPage from './pages/SendPage.js';
import MainPage from './pages/MainPage.js';
import ReceivePage from './pages/ReceivePage.js';

import { AssetType } from './types.js';

import './App.css';

declare global {
	interface Window {
		Telegram: any;
	}
}

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
	const [availableTokens, setAvailableTokens] = useState<AssetType[]>([]);

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
							<Route
								path="/send"
								element={
									<SendPage
										availableTokens={availableTokens}
									/>
								}
							/>
							<Route
								path="/"
								element={
									<MainPage
										setAvailableTokens={setAvailableTokens}
									/>
								}
							/>
						</Routes>
					</Router>
				</WagmiConfig>
			) : null}

			<Web3Modal
				themeVariables={{
					'--w3m-accent-color':
						window.Telegram?.WebApp?.themeParams?.button_color,
					'--w3m-accent-fill-color':
						window.Telegram?.WebApp?.themeParams.button_text_color,
					'--w3m-background-color':
						window.Telegram?.WebApp?.themeParams?.button_color,
					'--w3m-color-bg-1':
						window.Telegram?.WebApp?.themeParams?.bg_color,
					'--w3m-color-fg-1':
						window.Telegram?.WebApp?.themeParams?.text_color,
					'--w3m-color-fg-3':
						window.Telegram?.WebApp?.themeParams?.hint_color
				}}
				projectId={projectId}
				ethereumClient={ethereumClient}
			/>
		</>
	);
}

export default App;
