import { useState, useEffect, useCallback } from 'react';

export enum DeviceWidthBreakpoints {
	XS,
	SM,
	MD,
	LG,
	XL,
	XXL,
}

type UseDeviceWidthResult = {
	width: number;
	breakpoint: DeviceWidthBreakpoints;
}

export default function useDeviceWidth(): UseDeviceWidthResult {
	const [width, setWidth] = useState(window.innerWidth);
	const [breakpoint, setBreakpoint] = useState<DeviceWidthBreakpoints>(DeviceWidthToBreakpoint(window.innerWidth))

	const handleResize = useCallback(() => {
		setWidth(window.innerWidth)
		setBreakpoint(DeviceWidthToBreakpoint(window.innerWidth))
	}, []);

	useEffect(() => {
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	return {
		width: width,
		breakpoint: breakpoint
	};
};

function DeviceWidthToBreakpoint(width: number) {
	switch (true) {
		case width >= 1536: return DeviceWidthBreakpoints.XXL;
		case width >= 1280: return DeviceWidthBreakpoints.XL;
		case width >= 1024: return DeviceWidthBreakpoints.LG;
		case width >= 768: return DeviceWidthBreakpoints.MD;
		case width >= 640: return DeviceWidthBreakpoints.SM;
		default: return DeviceWidthBreakpoints.XS;
	}
}