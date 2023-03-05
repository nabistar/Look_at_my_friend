import React, { memo } from "react";
import styled from "styled-components";
import { NavLink, Routes, Route } from "react-router-dom";

// img
import back from "../assets/img/back.png";
import pen from "../assets/img/pen.png";
import list from "../assets/img/list.png";

// page
import View from "./view";
import Write from "./write";
import List from "./List";

const Container = styled.div`
    width: 100%;
    height: 100%;
    background: url(${back}) no-repeat center/cover;

    .box {
        width: 60%;
        height: 100%;
        margin: auto;
        padding: 10px;
        box-sizing: border-box;
        text-align: right;

        nav {
			width: 200px;
			margin: 0 auto 20px;
			display: flex;
			justify-content: space-between;
            a {
                display: block;
                width: 80px;
                height: 80px;

                img {
                    width: 100%;
                    height: 100%;
                }
            }
        }

		.img {
			width: 100%;
			height: 90%;
		}
    }

`;

const main = memo(() => {
    return (
        <Container>
            <div className="box">
                <nav>
                    <NavLink to="list">
                        <img src={list} alt="list img" />
                    </NavLink>
                    <NavLink to="write">
                        <img src={pen} alt="pen img" />
                    </NavLink>
                </nav>
                <div className="img">
                    <Routes>
                        <Route path="view" element={<View />} />
						<Route path="list" element={<List />} />
                        <Route path="write" element={<Write />} />
                    </Routes>
                </div>
            </div>
        </Container>
    );
});

export default main;