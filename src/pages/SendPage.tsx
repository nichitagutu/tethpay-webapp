import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { parseEther } from 'viem';
import {
	erc20ABI,
	useContractWrite,
	usePrepareContractWrite,
	usePrepareSendTransaction,
	useSendTransaction
} from 'wagmi';
import { AssetType } from '../types.js';

import './SendPage.css';
import useChainId from '../hooks/useChainId.js';

function SendPage({ availableTokens }: { availableTokens: AssetType[] }) {
	const navigate = useNavigate();

	const [pickedTokenName, setPickedTokenName] = useState<string>(
		'Select Cryptocurrency or Token'
	);
	const [pickedToken, setPickedToken] = useState<AssetType | null>(null);
	const [destinationAddress, setAddress] = useState<string>('');
	const [amount, setAmount] = useState<string>('0');
	const { data: chainId } = useChainId();

	const inputAmountRef = useRef<HTMLInputElement>(null);

	const numberAmount = amount === '' ? 0 : Number.parseFloat(amount);
	const { config: ethConfig, error: ethError } = usePrepareSendTransaction({
		to: destinationAddress,
		value: parseEther(amount ? amount : '0')
	});

	let tokenConfig = null;

	const { config, error: tokenError } = usePrepareContractWrite({
		address: pickedToken?.contractAddress as `0x${string}` | undefined,
		abi: erc20ABI,
		chainId,
		args: [
			destinationAddress as `0x${string}`,
			BigInt(numberAmount * 10 ** 6)
		],
		functionName: 'transfer'
	});

	tokenConfig = config;

	const { write } = useContractWrite(tokenConfig);

	const { sendTransaction } = useSendTransaction(ethConfig);

	const pickedEth = pickedTokenName.toLowerCase() === 'eth';

	useEffect(() => {
		if (inputAmountRef.current) {
			const placeholder =
				inputAmountRef.current.getAttribute('placeholder') || '';
			const computedStyle = getComputedStyle(inputAmountRef.current);
			const font = computedStyle.font;
			const width = getTextWidth(placeholder, font);
			inputAmountRef.current.style.width = `${Math.ceil(width) + 4}px`;
		}

		window.Telegram?.WebApp?.MainButton.setText('Send');
		window.Telegram?.WebApp?.MainButton.disable();

		window.Telegram?.WebApp?.BackButton.show();
		window.Telegram?.WebApp?.BackButton.onClick(() => {
			navigate('/');
		});

		return () => {
			window.Telegram?.WebApp?.MainButton.hide();
			window.Telegram?.WebApp?.MainButton.disable();
			window.Telegram?.WebApp?.BackButton.hide();
			window.Telegram?.WebApp?.BackButton.offClick(() => {
				navigate('/');
			});
		};
	}, []);

	useEffect(() => {
		if (availableTokens.length === 0) {
			navigate('/');
		}
	}, [availableTokens]);

	useEffect(() => {
		setAddress('');
		setAmount('');
		setPickedToken(
			availableTokens.find(token => token.symbol === pickedTokenName) ||
				null
		);
	}, [pickedTokenName]);

	const handleSendTransaction = useCallback(async () => {
		if (pickedEth) {
			await sendTransaction?.();
		} else {
			await write?.();
		}
	}, [write, sendTransaction]);

	const handleAlert = useCallback(() => {
		alert('Please double check address and amount');
	}, []);

	useEffect(() => {
		if (
			(pickedEth && ethError !== null) ||
			(!pickedEth && tokenError !== null)
		) {
			window.Telegram?.WebApp?.MainButton.onClick(handleAlert);
		} else {
			window.Telegram?.WebApp?.MainButton.onClick(handleSendTransaction);
		}

		return () => {
			window.Telegram?.WebApp?.MainButton.offClick(handleSendTransaction);
			window.Telegram?.WebApp?.MainButton.offClick(handleAlert);
		};
	}, [ethError, tokenError, handleSendTransaction]);

	useEffect(() => {
		if (amount !== '' && destinationAddress !== '') {
			window.Telegram?.WebApp?.MainButton.show();
			window.Telegram?.WebApp?.MainButton.enable();
		} else {
			window.Telegram?.WebApp?.MainButton.hide();
			window.Telegram?.WebApp?.MainButton.disable();
		}
	}, [amount, destinationAddress]);

	function getTextWidth(text: string, font: string) {
		const canvas = document.createElement('canvas');
		const context = canvas.getContext('2d');

		if (context) {
			context.font = font;
			const metrics = context.measureText(text);
			return metrics.width;
		}
		return 0;
	}

	const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const regex = /^\d*(\.\d*)?$/;
		if (regex.test(e.target.value)) {
			setAmount(e.target.value);
		}
	};

	const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setAddress(e.target.value);
	};

	return (
		<div className="app-wrapper send-page">
			<div className="send-select-wrapper">
				<select
					className="send-select"
					onChange={e => setPickedTokenName(e.target.value)}
				>
					<option value="" disabled selected>
						Select Cryptocurrency or Token
					</option>
					{availableTokens.map(token => (
						<option key={token.symbol} value={token.symbol}>
							{token.symbol}
						</option>
					))}
				</select>
			</div>
			{pickedTokenName !== 'Select Cryptocurrency or Token' ? (
				<div className="send-details">
					<div className="send-details-address">
						<input
							required={true}
							pattern="^[0-9a-fA-F]*$"
							type={'text'}
							className="send-details-destination-address"
							placeholder="Address"
							onChange={handleAddressChange}
						/>
					</div>

					<div className="send-details-amount">
						<input
							required={true}
							pattern="\d*(\.\d*)?"
							type={'text'}
							className="send-details-destination-address"
							placeholder="Amount"
							inputMode="decimal"
							value={amount}
							onChange={handleAmountChange}
						/>

						<div className="send-details-amount-picked-token">
							{pickedTokenName}
						</div>
					</div>
				</div>
			) : null}
		</div>
	);
}

export default SendPage;
