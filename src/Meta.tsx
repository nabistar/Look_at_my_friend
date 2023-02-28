// 기본참조객체
import React from "react";
// SEO 처리 기능 패키지
import { Helmet, HelmetProvider } from "react-helmet-async";

/**
 * SEO 처리 컴포넌트
 * @params props
 * @returns {JSX.Element}
 */

interface type {
	keywords?: string;
	author?: string;
	description?: string;
	title?: string;
	url?: string;
	subject?: string;
	copyright?: string;
	image?: string;
	icon?: string;
	shortcutIcon?: string;
	appleTouchIcon?: string;
}

const Meta = (props: type) => {
  return (
    <HelmetProvider>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{props.title}</title>
        {/* SEO 태그 */}
        <meta name="description" content={props.description} />
        <meta name="keywords" content={props.keywords} />
        <meta name="author" content={props.author} />
        <meta name="subject" content={props.subject} />
        <meta name="copyright" content={props.copyright} />
        <meta name="content-language" content="ko" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={props.title} />
        <meta property="og:description" content={props.description} />
        <meta property="og:image" content={props.image} />
        <meta property="og:url" content={props.url} />
        <link rel="icon" href={props.icon} type="image/png" />
        <link rel="shortcut icon" href={props.shortcutIcon} type="image/png" />
        <link
          rel="apple-touch-icon"
          href={props.appleTouchIcon}
          type="image/png"
        />
      </Helmet>
    </HelmetProvider>
  );
};

Meta.defaultProps = {
  title: "내 친구를 봐줘!",
  description: "반려동물 자랑 사이트",
  keywords: "React",
  author: "hana",
  subject: "포트폴리오",
  copyright: "hana",
  image: null,
  url: null,
  icon: null,
  shortcutIcon: null,
  appleTouchIcon: null,
};

export default Meta;
