import React, {memo} from 'react';
import {Oval} from 'react-loader-spinner';
import PropTypes from 'prop-types';

interface spinner {
	visible: boolean;
	width?: number;
	height?: number;
	color?: string;
	secondaryColor?: string;
	wrapperStyle?: any;
}

const Spinner = memo(({visible=false, width=100, height=100, color='#ff8800', secondaryColor, wrapperStyle={
	position: 'fixed',
	zIndex: 9999,
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)'
}}: spinner)=>{
	return (
		<Oval
			height={height}
			width={width}
			color={color}
			wrapperStyle={wrapperStyle}
			wrapperClass=""
			visible={visible}
			ariaLabel='oval-loading'
			secondaryColor={secondaryColor}
			strokeWidth={2}
			strokeWidthSecondary={2}
		/>
	)
});

export default Spinner;