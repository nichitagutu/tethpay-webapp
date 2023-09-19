import { useEffect, useRef } from 'react';
import * as QRCodeStyling from 'qr-code-styling';
import logo from '../assets/logo.jpeg';

function BeautifulQRCode({ text }: { text: string }) {
	const qrRef = useRef(null);
	useEffect(() => {
		if (qrRef.current) {
			// @ts-ignore
			while (qrRef.current.firstChild) {
				// @ts-ignore
				qrRef.current.removeChild(qrRef.current.firstChild);
			}
		}

		// @ts-ignore
		const qrCode = new QRCodeStyling({
			width: 200,
			height: 200,
			type: 'svg', // "svg" or "canvas"
			data: text,
			image: logo, // URL for center image if you want to include one
			dotsOptions: {
				color: window.Telegram?.WebApp?.themeParams?.text_color,
				type: 'rounded' // Rounded dots
			},
			backgroundOptions: {
				color: window.Telegram?.WebApp?.themeParams?.secondary_bg_color
			}
		});

		qrCode.append(qrRef.current);
	}, [text]);

	return <div ref={qrRef} />;
}

export default BeautifulQRCode;
