function SvgSwap({ fill }: { fill?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="1.35rem"
			height="1.35rem"
			fill="none"
			viewBox="0 0 20 24"
		>
			<path
				fill={window.Telegram.WebApp.themeParams.text_color || '#000'}
				d="M.818 5.945a1.5 1.5 0 1 0 2.125 2.117L.818 5.945ZM6.765 2.1h1.5a1.5 1.5 0 0 0-2.562-1.059l1.062 1.059Zm-1.5 19.61a1.5 1.5 0 0 0 3 0h-3Zm13.961-3.844a1.5 1.5 0 0 0-2.125-2.117l2.125 2.117Zm-5.947 3.844h-1.5a1.5 1.5 0 0 0 2.562 1.059L13.28 21.71Zm1.5-19.61a1.5 1.5 0 0 0-3 0h3ZM2.943 8.062 7.828 3.16 5.703 1.042.818 5.945l2.125 2.117Zm2.322-5.96V21.71h3V2.1h-3ZM17.101 15.75l-4.885 4.902 2.125 2.118 4.885-4.903-2.125-2.117ZM14.78 21.71V2.101h-3v19.61h3Z"
			/>
		</svg>
	);
}
export default SvgSwap;
