import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

// 폰트 import 
import ExtraLight from "./font/MaruBuri-ExtraLight.ttf";
import Light from "./font/MaruBuri-Light.ttf";
import Regular from "./font/MaruBuri-Regular.ttf";
import SemiBold from "./font/MaruBuri-SemiBold.ttf";
import Bold from "./font/MaruBuri-Bold.ttf";

const GlobalStyles = createGlobalStyle`
    ${reset}

	html {
		width: 100%;
		height: 100%;
			body {
			width: 100%;
			height: 100%;

			#root {
				width: 100%;
				height: 100%;
			}
		}
	}
`;

export default GlobalStyles;
