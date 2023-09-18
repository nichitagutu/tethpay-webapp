function SvgReceive({ fill }: { fill?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="1.35rem"
			height="1.35rem"
			fill="none"
			viewBox="0 0 25 20"
		>
			<path
				stroke={fill || '#000'}
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={3}
				d="m2.221 6.652 7.832 10.691a2.551 2.551 0 0 0 2.098 1.117 2.55 2.55 0 0 0 2.097-1.117L22.81 6.652a3.233 3.233 0 0 0 .427-3.2c-.439-1.066-1.408-1.798-2.526-1.906H4.315c-1.117.11-2.085.843-2.522 1.909a3.233 3.233 0 0 0 .428 3.197Z"
				clipRule="evenodd"
			/>
		</svg>
	);
}
export default SvgReceive;