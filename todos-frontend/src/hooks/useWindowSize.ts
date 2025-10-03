import { useEffect, useState } from 'react';

interface Size {
	width: number;
	height: number;
}

const useWindowSize = (): Size => {
	const [windowSize, setWindowSize] = useState<Size>({
		width: window.innerWidth,
		height: window.innerHeight,
	});

	useEffect(() => {
		let timeoutId: number | undefined;

		function handleResize() {
			if (timeoutId !== undefined) {
				clearTimeout(timeoutId);
			}

			timeoutId = window.setTimeout(() => {
				setWindowSize({
					width: window.innerWidth,
					height: window.innerHeight,
				});
			}, 150);
		}

		window.addEventListener('resize', handleResize);
		handleResize();

		return () => {
			window.removeEventListener('resize', handleResize);
			if (timeoutId !== undefined) {
				clearTimeout(timeoutId);
			}
		};
	}, []);

	return windowSize;
};

export default useWindowSize;
