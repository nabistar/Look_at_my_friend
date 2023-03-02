import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

// 폰트 import 


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
