import { useState, useEffect } from 'react';
import axios from 'axios';
import { AddressAssetsResponseType } from '../types.js';

const useAssets = (
	address: string
): {
	data: AddressAssetsResponseType;
	loading: boolean;
	error: any;
} => {
	const [data, setData] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			// try {
			// 	const response = await axios.get(
			// 		`https://697f-78-128-179-166.ngrok-free.app/balances?address=${address}`
			// 	);
			// 	setData(response.data);
			// } catch (error) {
			// 	setError(error);
			// } finally {
			// 	setLoading(false);
			// }

			const addressAssetsResponse: AddressAssetsResponseType = {
				address: '0x3C739adDe59fA08E21d8A75884B8E0FB1745705F',
				tokens: [
					{
						balance: '450.00',
						metadata: {
							decimals: 6,
							logo: 'https://static.alchemyapi.io/images/assets/3408.png',
							name: 'USD Coin',
							symbol: 'USDC'
						},
						token: {
							contractAddress:
								'0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
							tokenBalance:
								'0x000000000000000000000000000000000000000000000000000000001ad27480'
						}
					},
					{
						balance: '0.00',
						metadata: {
							decimals: 18,
							logo: 'https://static.alchemyapi.io/images/assets/2396.png',
							name: 'WETH',
							symbol: 'WETH'
						},
						token: {
							contractAddress:
								'0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
							tokenBalance:
								'0x0000000000000000000000000000000000000000000000000000000000000000'
						}
					}
				]
			};

			setData(addressAssetsResponse);

			setLoading(false);
			setError(null);
		};

		fetchData();
	}, []);

	return { data, loading, error };
};

export default useAssets;
