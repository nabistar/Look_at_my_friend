import React, { memo, useEffect, useCallback } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";

// 슬라이스
import { getItem, DeleteItem } from "../Slice/FileSlice";

// 커스텀 훅
import { useAppDispatch, useAppSelector } from "../Hook";

// 로딩바
import Spinner from "../Spinner";

// 미디어쿼리
import mq from "../MediaQuery";

const Container = styled.div`
    width: 100%;
    height: 100%;

    .contentBox {
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
            width: 48%;
            position: relative;
            &::after {
                display: block;
                content: "";
                padding-bottom: 100%;
            }
            img {
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
            }
        }

        .content {
            width: 48%;
            position: relative;
            background-color: rgba(255, 255, 255, 0.5);
            overflow-y: auto;
            vertical-align: middle;

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
                background-color: transparent;
                position: absolute;
                top: 0;
                left: 0;
            }
        }

        .delete {
            button {
                width: 100px;
                height: 50px;
                border: none;
                outline: none;
                margin-top: 50px;

                &:hover {
                    background-color: #ff8800;
                }
            }
        }
    }

    .error {
        width: 100%;
        height: 100%;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;

        p {
            width: 500px;
            height: 400px;
            text-align: center;
            font-weight: bold;
            background-color: rgba(255, 255, 255, 0.7);
            padding-top: 190px;
            box-sizing: border-box;
        }
    }

    ${mq.maxWidth("lg")`
			.contentBox {
				width: 90%;
				margin: auto;
				.contentImg {
					width: 90%;
				}

				.content {
					width: 90%;
					margin-top: 20px;
				}
			}
		`}

    ${mq.maxWidth("sm")`
			.contentBox {
				width: 100%;
				margin: auto;
				.contentImg {
					width: 90%;
				}

				.content {
					width: 90%;
					margin-top: 20px;
				}
			}
		`}
`;

const view = memo(() => {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { data, loading } = useAppSelector((state) => state.FileSlice);

    useEffect(() => {
        if (id) {
            dispatch(getItem({ id: id }));
        }
    }, []);

<<<<<<< HEAD
    const deleteBtn = useCallback(
        (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.preventDefault();
            const password = window.prompt("비밀번호를 입력해주세요.", "");
            if (data && !Array.isArray(data.data) && data.data.id && password == data.data.password) {
                if (window.confirm("정말 삭제하시겠습니까?")) {
                    dispatch(DeleteItem({ id: data.data.id })).then((result) => {
                        navigate("/main/list");
                    });
                }
            } else {
                window.alert("비밀번호가 틀렸습니다.");
            }
        },
        [data],
    );
=======
    const deleteBtn = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault();
		const password = window.prompt('비밀번호를 입력해주세요.', "");
		if (data && !Array.isArray(data.data) && data.data.id && password == data.data.password) {
			if(window.confirm("정말 삭제하시겠습니까?")) {
				dispatch(DeleteItem({id: data.data.id})).then((result) => {
					navigate("/main/list");
				});
			}
		} else {
			window.alert("비밀번호가 틀렸습니다.");
		}
	}, [data]);
>>>>>>> 90415a3 ('list')

    return (
        <Container>
            <Spinner visible={loading} />
            {data && data.data && !Array.isArray(data.data) ? (
                <div className="contentBox">
                    <div className="contentImg">
                        <img src={data.data.file_path} alt="img" />
                    </div>
                    <div className="content">
                        {data.data.content ? <textarea value={data.data.content} readOnly></textarea> : <textarea readOnly></textarea>}
                    </div>
                    <div className="delete">
                        <button type="button" onClick={deleteBtn}>
                            삭제하기
                        </button>
                    </div>
                </div>
            ) : (
                <div className="error">
                    <p>데이터가 없습니다.</p>
                </div>
            )}
        </Container>
    );
});

export default view;
