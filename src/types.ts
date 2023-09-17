export type TabType = {
	title: string;
	name: string;
	onClick?: () => void;
};

export type OperationType = {
	name: string;
	icon: JSX.Element;
	onClick: () => void;
};


export type AddressAssetsResponseType = {
	address: string;
	tokens: {
		balance: string;
		metadata: {
			decimals: number;
			logo: string;
			name: string;
			symbol: string;
		};
		token: {
			contractAddress: string;
			tokenBalance: string;
		};
	}[];
}

export type AssetType = {
	balance: string;
	name: string;
	symbol: string;
	logo: string;
}
