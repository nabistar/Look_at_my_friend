import React, { ChangeEvent, FormEvent, memo, useCallback, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

// 슬라이스
import { PostImg, PostItem } from "../Slice/FileSlice";

// 커스텀 훅
import { useAppDispatch, useAppSelector } from "../Hook";

// img
import picture from "../assets/img/picture.png";

// 미디어쿼리
import mq from "../MediaQuery";

const Container = styled.div`
    width: 100%;
    height: 100%;

    form {
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
                height: 500px;
            }

            input {
                display: none;
            }

            label {
				width: 80px;
				height: 80px;
				display: block;
				margin: auto;
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
            margin-top: 80px;

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

		.password {
			width: 100%;
			text-align: center;

			input {
				width: 200px;
				height: 30px;
				border: none;
				outline: none;
				margin-bottom: 20px;
			}

			p {
				font-size: 12px;
				font-weight: bold;
			}
		}

		button {
			width: 100px;
			height: 50px;
			border: none;
			outline: none;

			&:hover {
				background-color: #ff8800;
			}
		}
    }

    ${mq.maxWidth("lg")`
			form {
					.contentImg {
					width: 100%;

					img {
						height: 500px;
					}
				}

				.content {
					width: 100%;
					margin-top: 20px;
				}

				button {
					margin-top: 20px;
				}
			}
		`}

    ${mq.maxWidth("sm")`
			form {
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
			}
		`}
`;

const write = memo(() => {
    const dispatch = useAppDispatch();
    const { file } = useAppSelector((state) => state.FileSlice);
	const navigate = useNavigate();

    const addImg = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const file = e.currentTarget.files;
        const formData = new FormData();
        if (file) {
            formData.append("friend", file[0]);
        }
        dispatch(PostImg(formData));
    }, []);

	const addLetter = useCallback((e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const current = e.currentTarget;
		const content: string = current.content.value;
		const password: string = current.password.value;
		if(!password) {
			window.alert("비밀번호를 입력해주세요.");
		}

		if(file && file.data) {
			const img = file.data.url;
			dispatch(PostItem({file: img, content: content, password: password})).then((result) => {
				const view = result.payload;
				if(view instanceof Error) {
					window.alert("에러가 발생했습니다.");
				} else {
					if(typeof view !== 'undefined') {
						navigate(`/main/view/${view.data.id}`);
					}
				}
			});
		} else {
			window.alert("이미지를 추가해주세요.");
		}
	}, [file]);

    return (
        <Container>
            <form onSubmit={addLetter}>
                <div className="contentImg">
                    <input type="file" id="file" name="file" onChange={addImg} />
                    <label htmlFor="file">
                        <img src={picture} alt="img" />
                    </label>
                    <div className="view">{file && <img src={file.data.url} alt="img" />}</div>
                </div>
                <div className="content">
                    <textarea name="content"></textarea>
                </div>
				<div className="password">
					<input type='text' name='password' placeholder="비밀번호를 입력해주세요." required/>
					<p>적어주신 비밀번호는 게시글 삭제 시 이용됩니다.</p>
				</div>
                <button type="submit">자랑하기</button>
            </form>
        </Container>
    );
});

export default write;
