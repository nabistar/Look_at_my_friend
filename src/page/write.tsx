import React, { memo } from "react";
import styled from "styled-components";

// img
import test from "../assets/img/test.png";
import picture from "../assets/img/picture.png";

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
		width: 45%;
        img {
            width: 100%;
            height: 400px;
        }

		input {
			display: none;
		}

		label {
			img {
				width: 80px;
				height: 80px;
			}
		}
    }

    .content {
        width: 49%;
        height: 500px;
        background-color: rgba(255, 255, 255, 0.5);
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

        textarea {
            text-align: left;
			width: 100%;
			height: 498px;
			box-sizing: border-box;
			resize: none;
			outline: none;
			border: none;
			padding: 10px;
			font-size: 15px;
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
					height: 340px;
				}
			}

			.content {
				height: 400px;
				textarea {
					height: 398px;
				}
			}
		`}
`;

const write = memo(() => {
    return (
        <Container>
            <div className="contentImg">
				<input type='file' id="file" />
				<label htmlFor="file">
					<img src={picture} alt="img" />
				</label>
                <div className="view">
				<img src={test} alt="img" />
				</div>
            </div>
            <div className="content">
                <textarea></textarea>
            </div>
        </Container>
    );
});

export default write;
