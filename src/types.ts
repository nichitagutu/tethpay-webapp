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
