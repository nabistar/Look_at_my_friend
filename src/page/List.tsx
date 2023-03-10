import React, { memo, useEffect } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";

// 슬라이스
import { getList } from "../Slice/FileSlice";

// 커스텀 훅
import { useAppDispatch, useAppSelector } from "../Hook";

// 로딩바
import Spinner from "../Spinner";

// pagenation
import Pagenation from "../pagenation";

const Container = styled.div`
    width: 100%;
    height: 100%;
	overflow-y: auto;
	position: relative;

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
        .imgBox {
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

			.error {
			width: 100%;
			height: 100%;
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			justify-content: center;
			margin-top: 150px;

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
`;

const List = memo(() => {

	const dispatch = useAppDispatch();
	const {data, loading} = useAppSelector((state) => state.FileSlice);

	useEffect(() => {
		dispatch(getList(null));
	}, []);

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
