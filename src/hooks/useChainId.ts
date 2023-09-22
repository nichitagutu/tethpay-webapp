import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

const useChainId = (): {
	data: number;
	loading: boolean;
	error: any;
} => {
	const { connector } = useAccount();
	const [data, setData] = useState<number>(1);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	connector?.on('change', data => {
		if (data.chain?.id) {
			setData(data.chain?.id);
		} else {
			setData(1);
		}
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				const chainId = await connector?.getChainId();
				setData(chainId ? chainId : 1);
			} catch (error) {
				setError(error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	return { data, loading, error };
};

export default useChainId;
