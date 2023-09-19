import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { parseEther } from 'viem';
import { usePrepareSendTransaction, useSendTransaction } from 'wagmi';
import { AssetType } from '../types.js';

import './SendPage.css';

function SendPage({ availableTokens }: { availableTokens: AssetType[] }) {
	const navigate = useNavigate();

	const [pickedToken, setPickedToken] = useState<string>('Select a token');
	const [address, setAddress] = useState<string>('');
	const [amount, setAmount] = useState<string>('');

	const { config, error } = usePrepareSendTransaction({
		to: address,
		value: parseEther(amount),
		onError: (error: Error) => {
			console.log(error);
		}
	});

	const { sendTransaction } = useSendTransaction(config);

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
	}, [pickedToken]);

	useEffect(() => {
		if (address !== '' && amount !== '') {
			window.Telegram?.WebApp?.MainButton.show();
			window.Telegram?.WebApp?.MainButton.enable();
			window.Telegram?.WebApp?.MainButton.onClick(sendTransaction);
		} else {
			window.Telegram?.WebApp?.MainButton.hide();
		}
	}, [address, amount]);


	const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const regex = /^[0-9]*\.?[0-9]*$/;
		if (regex.test(e.target.value)) {
			setAmount(e.target.value);
		} else {
			e.preventDefault();
		}
	};

	const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const regex = /^[0-9a-fA-F]*$/;
		if (regex.test(e.target.value)) {
			setAddress(e.target.value);
		} else {
			e.preventDefault();
		}
	}

	return (
		<div className="app-wrapper">
			<div className="send">
				<h1>Send</h1>
				<div>
					<select
						className="send-select"
						onChange={e => setPickedToken(e.target.value)}
					>
						<option value={undefined}>Select a token</option>
						{availableTokens.map(token => (
							<option value={token.name}>{token.name}</option>
						))}
					</select>
				</div>
				{pickedToken !== 'Select a token' ? (
					<div className="send-details">
						<input
							required={true}
							pattern="^[0-9a-fA-F]*$"
							type={'text'}
							className="send-details-address"
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
