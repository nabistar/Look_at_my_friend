import React, { memo, useCallback } from "react";
import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";

const Container = styled.div`
    list-style: none;
    padding: 0;
<<<<<<< HEAD
    margin: auto;
=======
    margin: 20px auto;
>>>>>>> 90415a3 ('list')
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
	position: absolute;
<<<<<<< HEAD
	bottom: -50px;
=======
	bottom: 0;
>>>>>>> 90415a3 ('list')

    .link {
        display: block;
        font-size: 11px;
        padding: 5px 10px;
        text-decoration: none;
        transition: background-color 0.3s;
        border: 1px solid #ddd;
        margin: 0 1px;
        color: #000;

        &.active,
        &.active:hover {
            background-color: #000;
            color: #fff;
            border: 1px solid #000;
        }

        &.disabled,
        &.disabled:hover {
            border: 1px solid #fff;
            background-color: #fff;
            color: #ccc;
            cursor: no-drop;
        }

        &:hover {
            background-color: #000;
            color: #fff;
            border: 1px solid #000;
        }
    }
`;

interface page {
	pagenation: {
		[key: string] : number
	}
}

const pagenation = memo(({ pagenation: { groupStart, groupEnd, nextGroupFirstPage, nowPage, preGroupLastPage, totalPage } }: page) => {
    const location = useLocation();

    const pageNumber = useCallback((currentPage: number, targetPage: number, linkText: string | number) => {
        const { pathname, search } = location;

        const params = new URLSearchParams(search);

        params.set("page", String(targetPage));

        const qs = params.toString();

        let targetUrl = `${pathname}?${qs}`;

        if (linkText == "") {
            linkText = targetPage;
        }

        if (targetPage === 0) {
            return (
                <li key={Math.random()}>
                    <span className="link disabled" dangerouslySetInnerHTML={{ __html: String(linkText) }} />
                </li>
            );
        } else if (targetPage == currentPage) {
            return (
                <li key={Math.random()}>
                    <span className="link active" dangerouslySetInnerHTML={{ __html: String(linkText) }} />
                </li>
            );
        } else {
            return (
                <li key={Math.random()}>
                    <Link className="link" to={targetUrl} dangerouslySetInnerHTML={{ __html: String(linkText) }} />
                </li>
            );
        }
    }, []);

    window.scrollTo(0, 0);

    return (
        <Container>
            {pageNumber(nowPage, 1, "&laquo;")}
            {pageNumber(nowPage, preGroupLastPage, "&lt;")}
            {new Array(groupEnd - groupStart + 1).fill(groupStart).map((v, i) => pageNumber(nowPage, v + i, ""))}
            {pageNumber(nowPage, nextGroupFirstPage, "&gt;")}
            {pageNumber(nowPage, totalPage, "&raquo;")}
        </Container>
    );
});

export default pagenation;
