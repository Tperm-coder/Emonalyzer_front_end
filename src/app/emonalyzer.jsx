import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { decrement, increment } from '../store/slices/loginSlice';

export default function Emonalyzer() {
	const count = useSelector((state) => state.login.value);
	const dispatch = useDispatch();

	return (
		<div>
			<div>
				<button aria-label="Increment value" onClick={() => dispatch(increment())}>
					Increment
				</button>
				<span>{count}</span>
				<button aria-label="Decrement value" onClick={() => dispatch(decrement())}>
					Decrement
				</button>
			</div>
		</div>
	);
}
