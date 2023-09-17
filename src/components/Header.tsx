import { Web3Button } from '@nichitagutu/web3modal-react';
import { useMemo } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useAccount, useBalance } from 'wagmi';
import usePrice from '../hooks/coinGecko.js';
import { trimNumber } from '../utils/formatting.js';
import 'react-loading-skeleton/dist/skeleton.css';
import './Header.css';

const mockAddress = '0xbe0eb53f46cd790cd13851d5eff43d12404d33e8';

export default function Header() {
	return (
        <div className='header'>
			<Title />
			<Web3Button />
			<Balance />
		</div>
	);
}

function Title() {
	return (
		<div>
			<h1>TETH Pay</h1>
		</div>
	);
}

function Balance() {
	// const { address } = useAccount();
	const {
		data: balanceData,
		error: balanceError,
		isLoading: balanceIsLoading
	} = useBalance({
		address: mockAddress
	});

	const {
		data: priceData,
		error: priceError,
		loading: priceIsLoading
	} = usePrice(['ethereum']);

	const balanceInUSD = useMemo(() => {
		const ethPrice = priceData?.ethereum?.usd;
		if (balanceData?.formatted !== undefined && ethPrice !== undefined) {
			return trimNumber(
				Number.parseFloat(balanceData.formatted) * ethPrice,
				2
			)
				.toString()
				.split('.');
		}

		return [];
	}, [balanceData?.formatted, priceData?.ethereum?.usd]);

	const balanceComponent = useMemo(() => {
		if (balanceIsLoading || priceIsLoading || balanceError || priceError) {
			return (
				<div className="header-balance-number">
					<p className="header-balance-integer">
						<Skeleton width={280} />
					</p>
				</div>
			);
		}

		return (
			<div className="header-balance-number">
				<p className="header-balance-integer">
					${balanceInUSD[0]}
					{balanceInUSD[1]?.length > 0 ? '.' : ''}
				</p>
				<p className="header-balance-decimal">{balanceInUSD[1]}</p>
			</div>
		);
	}, [
		balanceInUSD,
		balanceIsLoading,
		priceIsLoading,
		balanceError,
		priceError
	]);

	return (
		<div className='header-balance'>
			{balanceComponent}
			<p className="header-balance-text">Your Balance</p>
		</div>
	);
}
