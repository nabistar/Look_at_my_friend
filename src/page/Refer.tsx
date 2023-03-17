import React, { memo } from "react";
import styled from "styled-components";
import { NavLink, Routes, Route } from "react-router-dom";

// img
import pen from "../assets/img/pen.png";
import list from "../assets/img/list.png";

// 미디어쿼리
import mq from '../MediaQuery';

const Container = styled.div`
    width: 100%;
    height: 100%;
    background-color: #F0E8D1;
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
				width: 80%;
				margin: auto;
				text-align: center;
				word-break: keep-all;

				&:first-child {
					font-size: 50px;
					font-weight: bold;
					color: #ff8800;
					margin-bottom: 100px;
				}

				&:not(&:first-child) {
					font-size: 14px;
					margin-bottom: 20px;
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
					margin-top: 10px;
				}

				
            }
        }

		${mq.maxWidth('sm')`
			.content {
				p {
					&:first-child {
						width: 90%;
						font-size: 40px;
					}

					&:not(&:first-child) {
						font-size: 12px;
					}
				}
			}
		`}

	${mq.maxWidth('ph')`
			.content {
				margin-bottom: 50px;
				p {
					&:first-child {
						font-size: 30px;
						margin-bottom: 50px;
					}

					&:not(&:first-child) {
						margin-bottom: 10px;
					}

				}
			}

			.button {
				a {
					width: 60px;
					height: 60px;
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
                    <p>내 친구를 봐줘!</p>
					<p>사진을 올리고 자랑하는 글을 쓸 수 있는 웹 사이트입니다.</p>
                    <p>개인 작품으로 만든 웹 사이트입니다. 불안정한 부분이 있을 수 있습니다.</p>
					<p>업로드 된 사진은 게시물이 삭제되는 즉시 서버에서 삭제합니다.</p>
					<p>부적절한 사진 및 글이 포함된 게시글은 통보 없이 삭제될 수 있습니다.</p>
                </div>
                <div className="button">
                    <NavLink to="/main/list">
                        <img src={list} alt="list img" />
						<p>목록으로</p>
                    </NavLink>
                    <NavLink to="/main/write">
                        <img src={pen} alt="pen img" />
						<p>작성하기</p>
                    </NavLink>
                </div>
            </div>
        </Container>
    );
});

export default Refer;
