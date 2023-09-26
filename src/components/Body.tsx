import { useEffect, useState } from 'react';
import { OperationType, AssetType, BalanceInfoType } from '../types.js';
import { Link } from 'react-router-dom';

import useAssets from '../hooks/useAssets.js';

import SvgSend from '../assets/send.js';
import SvgReceive from '../assets/receive.js';
import { useAccount, useBalance } from 'wagmi';
import { trimNumber } from '../utils/formatting.js';

import './Body.css';

export default function Body({
	setAvailableTokens
}: {
	setAvailableTokens: Function;
}) {
	const { address, isConnected } = useAccount();

	const { data: addressAssetsResponse, error: assetsError } =
		useAssets(address);

	console.log(addressAssetsResponse);

	const { data: ethBalance } = useBalance({
		address
	});

	const balanceInfo: BalanceInfoType = {
		eth: ethBalance?.formatted,
		tokens: addressAssetsResponse?.tokens
	};

	const hasBalance =
		ethBalance !== undefined &&
		ethBalance.value > 0n &&
		balanceInfo.tokens?.length > 0;

	return (
		<div className="body">
			<Operations isConnected={isConnected} hasBalance={hasBalance} />
			<AssetsList
				balanceInfo={balanceInfo}
				setAvailableTokens={setAvailableTokens}
			/>
		</div>
	);
}

function Operations({
	isConnected,
	hasBalance
}: {
	isConnected: boolean;
	hasBalance: boolean;
}) {
	return (
		<div className="body-operations">
			<SendButton isConnected={isConnected} hasBalance={hasBalance} />
			<ReceiveButton isConnected={isConnected} />
		</div>
	);
}

function SendButton({
	isConnected,
	hasBalance
}: {
	isConnected: boolean;
	hasBalance: boolean;
}) {
	const componentBody = (
		<>
			<SvgSend />
			<p>send</p>
		</>
	);

	return isConnected && hasBalance ? (
		<Link to="/send">
			<div className="body-operations-button"> {componentBody} </div>
		</Link>
	) : (
		<div className="body-operations-button disabled">{componentBody}</div>
	);
}

function ReceiveButton({ isConnected }: { isConnected: boolean }) {
	const componentBody = (
		<>
			<SvgReceive />
			<p>receive</p>
		</>
	);

	return isConnected ? (
		<Link to="/receive">
			<div className="body-operations-button">{componentBody}</div>
		</Link>
	) : (
		<div className="body-operations-button disabled">{componentBody}</div>
	);
}

function AssetsList({
	setAvailableTokens,
	balanceInfo
}: {
	setAvailableTokens: Function;
	balanceInfo: BalanceInfoType;
}) {
	const [assets, setAssets] = useState<JSX.Element[] | null>(null);

	useEffect(() => {
		const assets: AssetType[] = [];
		if (balanceInfo.eth !== undefined && BigInt(balanceInfo.eth) > 0n) {
			assets?.push({
				balance: trimNumber(balanceInfo.eth, 6).toString(),
				name: 'Ethereum',
				symbol: 'ETH',
				contractAddress: 'native',
				logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
				decimals: 18
			});
		}

		if (balanceInfo.tokens !== null && balanceInfo.tokens !== undefined) {
			assets.push(
				...balanceInfo.tokens?.map(token => ({
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
	}, [balanceInfo.eth, balanceInfo.tokens]);

	return <div className="body-assets">{assets ? assets : 'No data'}</div>;
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
