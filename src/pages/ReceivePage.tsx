import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import './ReceivePage.css';
import BeautifulQRCode from '../components/QRCode.js';

function ReceivePage() {
	const [copied, setCopied] = useState(false);

	const { address, isConnected } = useAccount();
	const navigate = useNavigate();

	function handleCopy(content: string) {
		navigator.clipboard
			.writeText(content)
			.then(() => {
				console.log('Text copied to clipboard');
				setCopied(true);

				setTimeout(() => {
					setCopied(false);
				}, 2000);
			})
			.catch(err => {
				console.error('Unable to copy text: ', err);
			});
	}

	function handleShare(title: string, content: string) {
		if (navigator.share) {
			navigator
				.share({
					title,
					text: content
				})
				.then(() => {
					console.log('Content shared successfully');
				})
				.catch(err => {
					console.error('Error sharing: ', err);
				});
		} else {
			console.log('Sharing is not supported on this device.');
		}
	}

	useEffect(() => {
		if (!isConnected) {
			navigate('/');
		}
	}, [isConnected, navigate]);

	if (!isConnected || !address) {
		return;
	}

	return (
		<div className="app-wrapper receive-body">
			<div>
				<div className="receive-body-qrcode-wrapper">
					<BeautifulQRCode text={address} />
					{address.slice(0, 10)}...{address.slice(-4)}
				</div>
				<div className="receive-body-btns">
					<button
						className="receive-body-btns-copy"
						onClick={() => handleCopy(address)}
					>
						copy
					</button>
					<button
						className="receive-body-btns-share"
						onClick={() => handleShare('WAGMI', address)}
					>
						share
					</button>
				</div>
			</div>
			{copied && <div className="copy-popup">copied!</div>}
		</div>
	);
}

export default ReceivePage;
