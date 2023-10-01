import { useState, useEffect } from 'react';
import axios from 'axios';
import { AddressAssetsResponseType } from '../types.js';
import useChainId from '../hooks/useChainId.js';

const useAssets = (
	address?: string
): {
	data: AddressAssetsResponseType | null;
	loading: boolean;
	error: any;
} => {
	const [data, setData] = useState<AddressAssetsResponseType | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const {
		data: chainId,
		loading: chainIdLoading,
		error: chainIdError
	} = useChainId();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get(
					`https://tethpay.qpwe.me/balances?address=${address}&chainId=${chainId}`
				);
				setData(response.data);
			} catch (error) {
				setError(error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [chainId, chainIdLoading, chainIdError, address]);

	return { data, loading, error };
};

export default useAssets;
