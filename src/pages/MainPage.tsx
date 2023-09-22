import Body from '../components/Body.js';
import Header from '../components/Header.js';
import { AssetType } from '../types.js';

import './MainPage.css';

export default function MainPage({ availableTokens, setAvailableTokens }: { availableTokens: AssetType[], setAvailableTokens: Function}) {
	return (
		<>
			<div className="app-wrapper">
				<Header availableTokens={availableTokens} />
				<Body setAvailableTokens={setAvailableTokens} />
			</div>
		</>
	);
}
