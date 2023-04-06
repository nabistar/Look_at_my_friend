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
			display: flex;
			flex-wrap: wrap; 

            .view {
                width: 100%;
                position: relative;
				background-color: rgba(255, 255, 255, 0.5);

                &::after {
                    display: block;
                    content: "";
                    padding-bottom: 100%;
                }

                img {
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    left: 0;
                    bottom: 0;
                }
            }

            input {
                display: none;
            }

            label {
                width: 75px;
                height: 75px;
                display: block;
				text-align: center;
                img {
                    width: 60px;
                    height: 60px;
                    position: static;
                }

                p {
                    text-align: center;
                    font-size: 12px;
                }
            }
        }

        .content {
            width: 45%;
            background-color: rgba(255, 255, 255, 0.5);
            overflow-y: auto;
            margin-top: 75px;
            position: relative;

            &::after {
                display: block;
                content: "";
                padding-bottom: 100%;
            }

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
                height: 100%;
                box-sizing: border-box;
                resize: none;
                outline: none;
                border: none;
                padding: 10px;
                font-size: 15px;
                position: absolute;
                top: 0;
                left: 0;
            }
        }

        .password {
            width: 100%;
            text-align: center;
            margin-top: 20px;

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
            margin-top: 30px;

            &:hover {
                background-color: #ff8800;
            }
        }
    }

    ${mq.maxWidth("lg")`
			form {
				width: 90%;
				margin: auto;
				.contentImg {
					margin: auto;
					width: 90%;

				}

				.content {
					width: 90%;
					margin: 20px auto 20px;
				}

				.password {
					margin-top: 0px;
				}

				button {
					margin-top: 50px;
				}

			}
		`}

    ${mq.maxWidth("sm")`
			form {
				width: 100%;
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

    const addLetter = useCallback(
        (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const current = e.currentTarget;
            const content: string = current.content.value;
            const password: string = current.password.value;
            if (!password) {
                window.alert("비밀번호를 입력해주세요.");
            }

<<<<<<< HEAD
            if (file && file.data) {
                const img = file.data.url;
                dispatch(PostItem({ file_path: img, content: content, password: password })).then((result) => {
                    const view = result.payload;

                    if (view instanceof Error) {
                        window.alert("에러가 발생했습니다.");
                    } else {
                        if (typeof view !== "undefined" && !Array.isArray(view.data)) {
                            window.alert("글이 작성되었습니다.");
                            navigate("/main/list");
                        }
                    }
                });
            } else {
                window.alert("이미지를 추가해주세요.");
            }
        },
        [file],
    );
=======
		if(file && file.data) {
			const img = file.data.url;
			dispatch(PostItem({file_path: img, content: content, password: password})).then((result) => {
				const view = result.payload;
				if(view instanceof Error) {
					window.alert("에러가 발생했습니다.");
				} else {
					if(typeof view !== 'undefined' && !Array.isArray(view.data)) {
						navigate(`/main/view/${view.data.id}`);
					}
				}
			});
		} else {
			window.alert("이미지를 추가해주세요.");
		}
	}, [file]);
>>>>>>> 90415a3 ('list')

    return (
        <Container>
            <form onSubmit={addLetter}>
                <div className="contentImg">
                    <input type="file" id="file" name="file" onChange={addImg} />
                    <label htmlFor="file">
                        <img src={picture} alt="img" />
                        <p>사진 올리기</p>
                    </label>
                    <div className="view">{file && <img src={file.data.url} alt="img" />}</div>
                </div>
                <div className="content">
                    <textarea name="content" placeholder="자랑 글을 입력해주세요. 최대 5000자까지 작성 가능합니다." maxLength={5000}></textarea>
                </div>
                <div className="password">
                    <input type="text" name="password" placeholder="비밀번호를 입력해주세요." required />
                    <p>적어주신 비밀번호는 게시글 삭제 시 이용됩니다.</p>
                </div>
                <button type="submit">자랑하기</button>
            </form>
        </Container>
    );
});

export default write;
