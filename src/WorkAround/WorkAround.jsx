import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';

const WorkAround = ({ customAxios }) => {
	const showToast = ({ html, msg, closeAfter = 5000, position = 'top-right', canClose = true }) => {
		return toast(html ? html : msg, {
			position,
			autoClose: closeAfter,
			hideProgressBar: false,
			closeOnClick: canClose,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: 'dark',
		});
	};
	const click = async (str) => {
		try {
			const res = await customAxios.post({
				endpoint: '/set_state',

				body: {
					state: str,
				},
			});

			showToast({ msg: 'DONE' });
		} catch (e) {
			console.log(e);
			showToast({ msg: 'Error' });
		}
	};

	return (
		<div>
			{'Solution 7aram '}
			<div>
				<button
					onClick={() => {
						click('hap');
					}}
				>
					Happy
				</button>
			</div>
			<div>
				<button
					onClick={() => {
						click('ang');
					}}
				>
					Angry
				</button>
			</div>
			<div>
				<button
					onClick={() => {
						click('neu');
					}}
				>
					Neutral
				</button>
			</div>
			<div>
				<button
					onClick={() => {
						click('sad');
					}}
				>
					Sad
				</button>
			</div>
			<div>
				<button
					onClick={() => {
						click('*');
					}}
				>
					Normal
				</button>
			</div>

			<ToastContainer
				position="top-right"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="dark"
				transition:Slide
				closeButton={false}
			/>
		</div>
	);
};

export default WorkAround;
