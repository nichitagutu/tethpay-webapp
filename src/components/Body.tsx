import { useEffect, useState } from 'react';
import './Body.css';
import { OperationType, TabType, AssetType } from '../types.js';
import { Link } from 'react-router-dom';

import useAssets from '../hooks/useAssets.js';

import SvgSend from '../assets/send.js';
import SvgReceive from '../assets/receive.js';
import SvgBuy from '../assets/buy.js';
import SvgSwap from '../assets/swap.js';
import { useAccount, useBalance } from 'wagmi';
import { trimNumber } from '../utils/formatting.js';

export default function Body({
	setAvailableTokens
}: {
	setAvailableTokens: Function;
}) {
	const [activeTab, setActiveTab] = useState('tokens');
	const tabs: TabType[] = [
		{
			title: 'Tokens',
			name: 'tokens',
			onClick: () => setActiveTab('tokens')
		},
		{
			title: "NFT's",
			name: 'nfts',
			onClick: () => setActiveTab('nfts')
		}
	];

	const operations: OperationType[] = [
		{
			name: 'send',
			icon: SvgSend.bind(null, {
				fill: window.Telegram?.WebApp?.themeParams?.text_color
			})
		},
		{
			name: 'receive',
			icon: SvgReceive.bind(null, {
				fill: window.Telegram?.WebApp?.themeParams?.text_color
			})
		},
		{
			name: 'buy',
			icon: SvgBuy.bind(null, {
				fill: window.Telegram?.WebApp?.themeParams?.text_color
			})
		},
		{
			name: 'swap',
			icon: SvgSwap.bind(null, {
				fill: window.Telegram?.WebApp?.themeParams?.text_color
			})
		}
	];

	return (
		<div className="body">
			{/* <Tabs tabs={tabs} activeTab={activeTab} /> */}
			<Operations operations={operations} />
			<div className="body-assets">
				{/* {activeTab === 'tokens' ? ( */}
				<AssetsList setAvailableTokens={setAvailableTokens} />
				{/*  ) : (
					"NFT's BRO!"
				)} */}
			</div>
		</div>
	);
}

function Tabs({ tabs, activeTab }: { tabs: TabType[]; activeTab: string }) {
	return (
		<div className="body-tabs">
			{tabs.map((tab, i) => {
				return <Tab tab={tab} activeTab={activeTab} key={i} />;
			})}
		</div>
	);
}

function Tab({ tab, activeTab }: { tab: TabType; activeTab: string }) {
	return (
		<div
			className={`body-tabs-tab ${
				activeTab === tab.name ? 'active' : ''
			}`}
			onClick={tab.onClick}
		>
			<p>{tab.title}</p>
		</div>
	);
}

function Operations({ operations }: { operations: OperationType[] }) {
	const { isConnected } = useAccount();
	return (
		<div className="body-operations">
			{operations.map(operation => {
				return isConnected ? (
					<Link to={`/${operation.name}`}>
						<OperationButton
							operation={operation}
							isConnected={isConnected}
						/>
					</Link>
				) : (
					<OperationButton
						operation={operation}
						isConnected={isConnected}
					/>
				);
			})}
		</div>
	);
}

function OperationButton({
	operation,
	isConnected
}: {
	operation: OperationType;
	isConnected: boolean;
}) {
	return (
		<div
			className={`body-operations-button ${
				isConnected ? '' : 'disabled'
			}`}
		>
			<operation.icon />
			<p>{operation.name}</p>
		</div>
	);
}

function AssetsList({ setAvailableTokens }: { setAvailableTokens: Function }) {
	const [assets, setAssets] = useState<JSX.Element[] | null>(null);
	const { address } = useAccount();

	const { data: addressAssetsResponse, error: assetsError } =
		useAssets(address);

	const { data: ethBalance } = useBalance({
		address
	});

	useEffect(() => {
		const assets: AssetType[] = [];
		if (ethBalance !== undefined && ethBalance.value > 0n) {
			assets?.push({
				balance: trimNumber(ethBalance.formatted, 6).toString(),
				name: 'Ethereum',
				symbol: 'ETH',
				contractAddress: 'native',
				logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
				decimals: 18
			});
		}

		if (addressAssetsResponse !== null) {
			assets.push(
				...addressAssetsResponse?.tokens?.map(token => ({
					balance: trimNumber(token.balance, 6).toString(),
					name: token.metadata.name,
					symbol: token.metadata.symbol,
					logo: token.metadata.logo,
					contractAddress: token.token.contractAddress,
					decimals: token.metadata.decimals
				}))
			);
		}

		const positiveBalances = assets.filter(
			token => Number.parseFloat(token.balance) !== 0
		);

		setAvailableTokens(positiveBalances);

		const assetElements = positiveBalances.map(asset => {
			return <Asset asset={asset} />;
		});

		setAssets(assetElements);
	}, [addressAssetsResponse, assetsError]);

	return <>{assets ? assets : 'No data'}</>;
}

function Asset({ asset }: { asset: AssetType }) {
	return (
		<>
			<div className="body-assets-asset">
				<div className="body-assets-asset-info">
					<div className="body-assets-asset-logo">
						<img src={asset.logo} alt="logo" />
					</div>
					<div className="body-assets-asset-naming">
						<p className="body-assets-asset-naming-name">
							{asset.name}
						</p>
						<p className="body-assets-asset-naming-symbol">
							{asset.symbol}
						</p>
					</div>
				</div>
				<div className="body-assets-asset-balance">
					<p className="body-assets-asset-balance-amount">
						{asset.balance}
					</p>
				</div>
			</div>
		</>
	);
}
