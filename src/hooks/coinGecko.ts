import { useState, useEffect } from 'react';
import axios from 'axios';

const usePrice = (
	tokens: Array<any>,
	currency: string = 'usd'
): {
	data: any;
	loading: boolean;
	error: any;
} => {
	const [data, setData] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get(
					`https://api.coingecko.com/api/v3/simple/price?ids=ethereum,${tokens?.join(
						','
					)}&vs_currencies=${currency}`
				);
				setData(response.data);
			} catch (error) {
				setError(error);
			} finally {
				setLoading(false);
			}

			setLoading(false);
			setError(null);
		};

		fetchData();
	}, []);

	return { data, loading, error };
};

export default usePrice;
