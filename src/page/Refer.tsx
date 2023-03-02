import React, { memo } from "react";
import styled from "styled-components";
import { NavLink, Routes, Route } from "react-router-dom";

// img
import back from "../assets/img/back.png";
import pen from "../assets/img/pen.png";
import list from "../assets/img/list.png";

// 미디어쿼리
import mq from '../MediaQuery';

const Container = styled.div`
    width: 100%;
    height: 100%;
    background: url(${back}) no-repeat center/cover;
    display: flex;
    align-items: center;

    .refer {
        background-color: rgba(255, 255, 255, 0.5);
        width: 70%;
        height: 80%;
        margin: auto;
        display: flex;
        align-items: center;
		align-content: center;
        flex-wrap: wrap;

		.content {
			width: 100%;
			margin-bottom: 100px;
			p {
				width: 100%;
				text-align: center;

				&:first-child {
					font-size: 50px;
					font-weight: bold;
					color: #ff0000;
					margin-bottom: 20px;

					span {
						color: #ff8800;
					}
				}

				&:last-child {
					font-size: 15px;
				}
			}
		}

        .button {
			width: 100%;
            display: flex;
			justify-content: center;
            a {
                display: block;
                width: 80px;
                height: 80px;
				text-decoration: none;
				
				&:first-child {
					margin-right: 40px;
				}

                img {
                    width: 100%;
                    height: 100%;
                }

				p {
					font-size: 12px;
					color: #000;
					text-align: center;
				}

				&:last-child {
					p {
						margin-left: 8px;
					}
				}
            }
        }

		${mq.maxWidth('sm')`
			.content {
				p {
					&:first-child {
						font-size: 40px;
					}

					&:last-child {
						font-size: 10px;
					}
				}
			}
		`}
    }
`;

const Refer = memo(() => {
    return (
        <Container>
            <div className="refer">
                <div className="content">
                    <p>내 <span>친구</span>를 봐줘!</p>
                    <p>개인 작품으로 만든 웹 사이트입니다. 불안정한 부분이 있을 수 있습니다. 업로드 된 사진은 게시물이 삭제되는 즉시 서버에서 삭제합니다.</p>
                </div>
                <div className="button">
                    <NavLink to="/main/list">
                        <img src={list} alt="list img" />
						<p>목록으로</p>
                    </NavLink>
                    <NavLink to="/main/write">
                        <img src={pen} alt="pen img" />
						<p>글 작성</p>
                    </NavLink>
                </div>
            </div>
        </Container>
    );
});

export default Refer;
