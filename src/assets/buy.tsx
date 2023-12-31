function SvgBuy({ fill }: { fill?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="1.35rem"
			height="1.35rem"
			fill="none"
			viewBox="0 0 25 23"
		>
			<path
				stroke={window.Telegram.WebApp.themeParams.text_color || '#000'}
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2.309}
				d="M1.979 4.841v13.347c.002.724.283 1.417.78 1.927.498.51 1.172.795 1.873.792h15.924a2.602 2.602 0 0 0 1.872-.792c.498-.51.78-1.203.781-1.927V4.841a2.773 2.773 0 0 0-.78-1.927 2.602 2.602 0 0 0-1.873-.792H4.632a2.601 2.601 0 0 0-1.872.792 2.773 2.773 0 0 0-.781 1.927Z"
				clipRule="evenodd"
			/>
			<path
				fill={window.Telegram.WebApp.themeParams.text_color || '#000'}
				d="M23.21 9.705a1.155 1.155 0 0 0 0-2.31v2.31ZM1.978 7.395a1.155 1.155 0 0 0 0 2.31v-2.31Zm11.942 7.129a1.155 1.155 0 0 0 0-2.31v2.31Zm-11.942-2.31a1.155 1.155 0 0 0 0 2.31v-2.31Zm17.25 2.31a1.155 1.155 0 0 0 0-2.31v2.31Zm-1.327-2.31a1.155 1.155 0 0 0 0 2.31v-2.31Zm5.307-4.818H1.98v2.309h21.23v-2.31Zm-9.288 4.818H1.979v2.31H13.92v-2.31Zm5.308 0h-1.327v2.31h1.327v-2.31Z"
			/>
		</svg>
	);
}

export default SvgBuy;
