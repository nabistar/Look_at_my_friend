import React, { memo, useEffect } from "react";
import styled from "styled-components";
import { NavLink, useLocation } from "react-router-dom";

// 슬라이스
import { getList } from "../Slice/FileSlice";

// 커스텀 훅
import { useAppDispatch, useAppSelector } from "../Hook";

// 미디어쿼리
import mq from "../MediaQuery";

// 로딩바
import Spinner from "../Spinner";

// pagenation
import Pagenation from "../pagenation";

const Container = styled.div`
    width: 100%;
    height: 100%;
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

    .list {
        width: 80%;
		margin: auto;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-evenly;
        position: relative;

        .imgBox {
            width: 23%;
            margin-bottom: 20px;
			position: relative;

            &::after {
                display: block;
                content: "";
                padding-bottom: 100%;
            }

            a {
                display: block;
                width: 100%;
                height: 100%;
				position: absolute;

                img {
                    width: 100%;
                    height: 100%;
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
    }

	${mq.maxWidth("lg")`
			.list {
				width: 100%;
			}
		`}

    ${mq.maxWidth("sm")`
			.list {
				width: 100%;
				.imgBox {
					width: 47%;
				}
			}
		`}
`;

const List = memo(() => {
    const dispatch = useAppDispatch();
    const { data, loading } = useAppSelector((state) => state.FileSlice);
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const nowpage = Object.fromEntries(params).page;

    useEffect(() => {
        if (nowpage) {
            dispatch(getList({ nowpage: parseInt(nowpage) }));
        } else {
            dispatch(getList({ nowpage: 1 }));
        }
    }, [nowpage]);

    return (
        <Container>
            <Spinner visible={loading} />
            <div className="list">
                {data && Array.isArray(data.data) && data.data.length > 0 ? (
                    data.data.map((v, i) => {
                        return (
                            <div className="imgBox" key={i}>
                                <NavLink to={`/main/view/${v.id}`}>
                                    <img src={v.file_path} alt="이미지" />
                                </NavLink>
                            </div>
                        );
                    })
                ) : (
                    <div className="error">
                        <p>아직 자랑이 없습니다.</p>
                    </div>
                )}
                {data && data.pagenation && <Pagenation pagenation={data.pagenation} />}
            </div>
        </Container>
    );
});

export default List;
