import React, { memo } from "react";
import styled from "styled-components";

// img
import test from "../assets/img/test.png";

// 미디어쿼리
import mq from "../MediaQuery";

const Container = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-evenly;
    overflow-y: auto;

    &::-webkit-scrollbar {
        width: 10px;
    }

    &::-webkit-scrollbar-track {
        background-color: #eadac8;
    }

    &::-webkit-scrollbar-thumb {
        background-color: #ff8800;
    }

    .contentImg {
        width: 49%;
        img {
            width: 100%;
            height: 500px;
        }
    }

    .content {
        width: 49%;
        height: 500px;
        background-color: rgba(255, 255, 255, 0.5);
        padding: 20px;
        box-sizing: border-box;
        overflow-y: auto;

        &::-webkit-scrollbar {
            width: 10px;
        }

        &::-webkit-scrollbar-track {
            background-color: #eadac8;
        }

        &::-webkit-scrollbar-thumb {
            background-color: #ff8800;
        }

        p {
            text-align: left;
        }
    }

    ${mq.maxWidth("lg")`
			.contentImg {
				width: 100%;
			}

			.content {
				width: 100%;
			}
		`}

    ${mq.maxWidth("sm")`
			.contentImg {
				img {
					height: 400px;
				}
			}

			.content {
				height: 400px;
			}
		`}
`;

const view = memo(() => {
    return (
        <Container>
            <div className="contentImg">
                <img src={test} alt="img" />
            </div>
            <div className="content">
                <p>어쩌고저쩌고 자랑하는 주접글</p>
            </div>
        </Container>
    );
});

export default view;
