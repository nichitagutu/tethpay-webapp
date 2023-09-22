import { useState, useEffect } from 'react';
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

	const [pickedTokenName, setPickedTokenName] =
		useState<string>('Select a token');
	const [pickedToken, setPickedToken] = useState<AssetType | null>(null);
	const [destinationAddress, setAddress] = useState<string>('');
	const [amount, setAmount] = useState<string>('');
	const { data: chainId } = useChainId();

	const { config: ethConfig } = usePrepareSendTransaction({
		to: destinationAddress,
		value: parseEther(amount),
		onError: (error: Error) => {
			console.log(error);
		}
	});

	const { config: tokenConfig } = usePrepareContractWrite({
		address: pickedToken?.contractAddress as `0x${string}` | undefined,
		abi: erc20ABI,
		chainId,
		args: [destinationAddress as `0x${string}`, BigInt(amount) * 10n ** 6n],
		functionName: 'transfer'
	});

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

	const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const regex = /^[0-9]*\.?[0-9]*$/;
		if (regex.test(e.target.value)) {
			setAmount(e.target.value);
		} else {
			e.preventDefault();
		}
	};

	const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setAddress(e.target.value);
	};

	return (
		<div className="app-wrapper">
			<div className="send">
				<h1>Send</h1>
				<div>
					<select
						className="send-select"
						onChange={e => setPickedTokenName(e.target.value)}
					>
						<option value={undefined}>Select a token</option>
						{availableTokens.map(token => (
							<option value={token.symbol}>{token.symbol}</option>
						))}
					</select>
				</div>
				{pickedTokenName !== 'Select a token' ? (
					<div className="send-details">
						<input
							required={true}
							pattern="^[0-9a-fA-F]*$"
							type={'text'}
							className="send-details-destinationAddress"
							placeholder="Address"
							onChange={handleAddressChange}
						/>
						<input
							required={true}
							pattern="^[0-9]*\.?[0-9]*$"
							type={'text'}
							className="send-details-amount"
							placeholder="Amount"
							onChange={handleAmountChange}
						/>
					</div>
				) : null}
			</div>
		</div>
	);
}

export default SendPage;
