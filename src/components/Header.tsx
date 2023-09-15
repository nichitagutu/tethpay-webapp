import { Web3Button } from '@nichitagutu/web3modal-react';
import './Header.css';

export default function Header() {
	return (
		<div>
			<Title />
			<Web3Button />
		</div>
	);
}

function Title() {
	return (
		<div>
			<h1>TETH PAY</h1>
		</div>
	);
}
