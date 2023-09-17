import { useEffect, useState } from 'react';
import './Body.css';
import {
	OperationType,
	TabType,
	AddressAssetsResponseType,
	AssetType
} from '../types.js';
import { Link } from 'react-router-dom';
import SvgSend from '../assets/send.js';
import SvgReceive from '../assets/receive.js';
import SvgBuy from '../assets/buy.js';
import SvgSwap from '../assets/swap.js';

export default function Body() {
	const [activeTab, setActiveTab] = useState('tokens');
	const [activeOperation, setActiveOperation] = useState('send');
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
			}),
			onClick: () => setActiveOperation('send')
		},
		{
			name: 'receive',
			icon: SvgReceive.bind(null, {
				fill: window.Telegram?.WebApp?.themeParams?.text_color
			}),
			onClick: () => setActiveOperation('receive')
		},
		{
			name: 'buy',
			icon: SvgBuy.bind(null, {
				fill: window.Telegram?.WebApp?.themeParams?.text_color
			}),
			onClick: () => setActiveOperation('buy')
		},
		{
			name: 'swap',
			icon: SvgSwap.bind(null, {
				fill: window.Telegram?.WebApp?.themeParams?.text_color
			}),
			onClick: () => setActiveOperation('swap')
		}
	];

	return (
		<div className="body">
			<Tabs tabs={tabs} activeTab={activeTab} />
			<Operations
				operations={operations}
				activeOperation={activeOperation}
			/>
			<div className="body-assets">
				{activeTab === 'tokens' ? <AssetsList /> : "NFT's BRO!"}
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

function Operations({
	operations,
	activeOperation
}: {
	operations: OperationType[];
	activeOperation: string;
}) {
	return (
		<div className="body-operations">
			{operations.map(operation => {
				return (
					<Link to={`/${operation.name}`}>
						<OperationButton
							operation={operation}
							activeOperation={activeOperation}
						/>
					</Link>
				);
			})}
		</div>
	);
}

function OperationButton({
	operation,
	activeOperation
}: {
	operation: OperationType;
	activeOperation: string;
}) {
	return (
		<div className="body-operations-button">
			<operation.icon />
			<p>{operation.name}</p>
		</div>
	);
}

function AssetsList() {
	const [assets, setAssets] = useState<JSX.Element[] | null>(null);

	useEffect(() => {
		// fetch assets

		const addressAssetsResponse: AddressAssetsResponseType = {
			address: '0x3C739adDe59fA08E21d8A75884B8E0FB1745705F',
			tokens: [
				{
					balance: '450.00',
					metadata: {
						decimals: 6,
						logo: 'https://static.alchemyapi.io/images/assets/3408.png',
						name: 'USD Coin',
						symbol: 'USDC'
					},
					token: {
						contractAddress:
							'0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
						tokenBalance:
							'0x000000000000000000000000000000000000000000000000000000001ad27480'
					}
				},
				{
					balance: '0.00',
					metadata: {
						decimals: 18,
						logo: 'https://static.alchemyapi.io/images/assets/2396.png',
						name: 'WETH',
						symbol: 'WETH'
					},
					token: {
						contractAddress:
							'0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
						tokenBalance:
							'0x0000000000000000000000000000000000000000000000000000000000000000'
					}
				}
			]
		};

		// transform assets
		const assets: JSX.Element[] = addressAssetsResponse.tokens.map(
			token => {
				const asset: AssetType = {
					balance: token.balance,
					name: token.metadata.name,
					symbol: token.metadata.symbol,
					logo: token.metadata.logo
				};

				return <Asset asset={asset} />;
			}
		);

		setAssets(assets);
	}, []);

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
