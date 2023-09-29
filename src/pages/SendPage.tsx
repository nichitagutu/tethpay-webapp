import { useState, useEffect, useRef } from 'react';
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

	const { config: ethConfig } = usePrepareSendTransaction({
		to: destinationAddress,
		value: parseEther(amount),
		onError: (error: Error) => {
			console.log(error);
		}
	});

	let tokenConfig = null;

	try {
		const { config } = usePrepareContractWrite({
			address: pickedToken?.contractAddress as `0x${string}` | undefined,
			abi: erc20ABI,
			chainId,
			args: [
				destinationAddress as `0x${string}`,
				BigInt(Number.parseFloat(amount) * 10 ** 6)
			],
			functionName: 'transfer'
		});

		tokenConfig = config;
	} catch (error) {
		const { config } = usePrepareContractWrite({
			address: pickedToken?.contractAddress as `0x${string}` | undefined,
			abi: erc20ABI,
			chainId,
			args: [
				destinationAddress as `0x${string}`,
				BigInt(Number.parseFloat(0) * 10 ** 6)
			],
			functionName: 'transfer'
		});

		tokenConfig = config;
		console.log(error);
	}

	const { write } = useContractWrite(tokenConfig);

	const { sendTransaction } = useSendTransaction(ethConfig);

	useEffect(() => {
		window.Telegram?.WebApp?.MainButton.setText('Send');
		window.Telegram?.WebApp?.MainButton.disable();

		window.Telegram?.WebApp?.BackButton.show();
		window.Telegram?.WebApp?.BackButton.onClick(() => {
			navigate('/');
		});

		return () => {
			window.Telegram?.WebApp?.MainButton.hide();
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

	useEffect(() => {
		console.log(destinationAddress, amount);
		if (destinationAddress !== '' && amount !== '') {
			window.Telegram?.WebApp?.MainButton.show();
			window.Telegram?.WebApp?.MainButton.enable();
			console.log(pickedTokenName);
			if (pickedTokenName.toLowerCase() === 'eth') {
				window.Telegram?.WebApp?.MainButton.onClick(() => {
					sendTransaction?.();
				});
			} else {
				window.Telegram?.WebApp?.MainButton.onClick(() => {
					write?.();
				});
			}
		} else {
			window.Telegram?.WebApp?.MainButton.hide();
		}
	}, [destinationAddress, amount]);

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

	useEffect(() => {
		if (inputAmountRef.current) {
			const placeholder =
				inputAmountRef.current.getAttribute('placeholder') || '';
			const computedStyle = getComputedStyle(inputAmountRef.current);
			const font = computedStyle.font;
			const width = getTextWidth(placeholder, font);
			inputAmountRef.current.style.width = `${Math.ceil(width) + 4}px`;
		}
	}, []);

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

					{/* <div className="send-details-amount">
						<div className="sned-details-amount-input-wrapper">
							<input
								ref={inputAmountRef}
								required={true}
								type={'text'}
								className="send-details-amount-input"
								placeholder={`0`}
								onChange={handleAmountChange}
								value={amount}
							/>
						</div>
						<div className="send-details-amount-token-name">
							{pickedTokenName}
						</div>
					</div> */}
				</div>
			) : null}
		</div>
	);
}

export default SendPage;
