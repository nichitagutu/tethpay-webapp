import { useState } from 'react';
// @ts-ignore
import { ReactComponent as SendIcon } from '../assets/send.svg';
// @ts-ignore
import { ReactComponent as ReceiveIcon } from '../assets/receive.svg';
// @ts-ignore
import { ReactComponent as BuyIcon } from '../assets/buy.svg';
// @ts-ignore
import { ReactComponent as SwapIcon } from '../assets/swap.svg';
import './Body.css';
import { OperationType, TabType } from '../types.js';

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
			icon: SendIcon,
			onClick: () => setActiveOperation('send')
		},
		{
			name: 'receive',
			icon: ReceiveIcon,
			onClick: () => setActiveOperation('receive')
		},
		{
			name: 'buy',
			icon: BuyIcon,
			onClick: () => setActiveOperation('buy')
		},
		{
			name: 'swap',
			icon: SwapIcon,
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
			<AssetsList />
		</div>
	);
}

function Tabs({ tabs, activeTab }: { tabs: TabType[]; activeTab: string }) {
	return (
		<div className="body-tabs">
			{tabs.map(tab => {
				return <Tab tab={tab} activeTab={activeTab} />;
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
				return <OperationButton operation={operation} activeOperation={activeOperation} />;
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
	return <></>;
}

function Asset() {}
