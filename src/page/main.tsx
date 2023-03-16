import React, { memo } from "react";
import styled from "styled-components";
import { NavLink, Routes, Route } from "react-router-dom";

// 미디어 쿼리
import mq from "../MediaQuery";

// img
import pen from "../assets/img/pen.png";
import list from "../assets/img/list.png";
import home from "../assets/img/home.png";

// page
import View from "./view";
import Write from "./write";
import List from "./List";

const Container = styled.div`
    width: 100%;
    height: 100%;
    background-color: #f2bd85;

    .box {
        width: 60%;
        height: 100%;
        margin: auto;
        padding: 10px;
        box-sizing: border-box;
        text-align: right;

        nav {
			width: 350px;
			margin: 0 auto 80px;
			display: flex;
			justify-content: space-between;
            a {
                display: block;
                width: 80px;
                height: 80px;
				text-decoration: none;

                img {
                    width: 100%;
                    height: 100%;
                }

				p {
					text-align: center;
					color: #000;
					margin-top: 5px;
					font-size: 12px;
				}
            }
        }

		.img {
			width: 100%;
			height: calc(100% - 160px);
		}
    }

	${mq.maxWidth('sm')`
		.box {
			width: 75%;
		}
	`}

`;

const main = memo(() => {
    return (
        <Container>
            <div className="box">
                <nav>
					<NavLink to="/">
                        <img src={home} alt="home img" />
						<p>처음으로</p>
                    </NavLink>
                    <NavLink to="list">
                        <img src={list} alt="list img" />
						<p>목록으로</p>
                    </NavLink>
                    <NavLink to="write">
                        <img src={pen} alt="pen img" />
						<p>작성하기</p>
                    </NavLink>
                </nav>
                <div className="img">
                    <Routes>
                        <Route path="view/:id" element={<View />} />
						<Route path="list" element={<List />} />
                        <Route path="write" element={<Write />} />
                    </Routes>
                </div>
            </div>
        </Container>
    );
});

export default main;
