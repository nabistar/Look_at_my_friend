import React, { memo } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";

// img
import test from "../assets/img/test.png";

const Container = styled.div`
    width: 100%;
    height: 100%;
	overflow-y: auto;

	&::-webkit-scrollbar {
		width: 10px;
	}

	&::-webkit-scrollbar-track {
		background-color: #EADAC8;
	}

	&::-webkit-scrollbar-thumb {
		background-color: #ff8800;
	}

    .list {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-evenly;
        div {
            width: 250px;
            height: 250px;
            margin-bottom: 20px;
            a {
                display: block;
                width: 100%;
                height: 100%;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }
`;

const List = memo(() => {
    return (
        <Container>
            <div className="list">
                <div>
                    <NavLink to="/main/view">
                        <img src={test} alt="이미지" />
                    </NavLink>
                </div>

                <div>
                    <NavLink to="/main/view">
                        <img src={test} alt="이미지" />
                    </NavLink>
                </div>

                <div>
                    <NavLink to="/main/view">
                        <img src={test} alt="이미지" />
                    </NavLink>
                </div>

                <div>
                    <NavLink to="/main/view">
                        <img src={test} alt="이미지" />
                    </NavLink>
                </div>

                <div>
                    <NavLink to="/main/view">
                        <img src={test} alt="이미지" />
                    </NavLink>
                </div>

                <div>
                    <NavLink to="/main/view">
                        <img src={test} alt="이미지" />
                    </NavLink>
                </div>

                <div>
                    <NavLink to="/main/view">
                        <img src={test} alt="이미지" />
                    </NavLink>
                </div>

                <div>
                    <NavLink to="/main/view">
                        <img src={test} alt="이미지" />
                    </NavLink>
                </div>

                <div>
                    <NavLink to="/main/view">
                        <img src={test} alt="이미지" />
                    </NavLink>
                </div>

                <div>
                    <NavLink to="/main/view">
                        <img src={test} alt="이미지" />
                    </NavLink>
                </div>

                <div>
                    <NavLink to="/main/view">
                        <img src={test} alt="이미지" />
                    </NavLink>
                </div>

                <div>
                    <NavLink to="/main/view">
                        <img src={test} alt="이미지" />
                    </NavLink>
                </div>
            </div>
        </Container>
    );
});

export default List;
