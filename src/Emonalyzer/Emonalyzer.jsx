import React, { useEffect, useRef, useState } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut, Pie } from 'react-chartjs-2';
import { ToastContainer, toast } from 'react-toastify';
import { useWavesurfer } from '@wavesurfer/react';
import { MdFiberManualRecord } from 'react-icons/md';
import { quantum } from 'ldrs';

import 'react-toastify/dist/ReactToastify.css';

quantum.register();
ChartJS.register(ArcElement, Tooltip, Legend);

const AudioAnalyzer = ({ customAxios }) => {
	const areaChartRef = useRef(null);
	const pieChartRef = useRef(null);
	const fileInputRef = useRef(null);
	const audioChunks = useRef([]);
	const [audioStartTime, setAudioStartTime] = useState(null);
	const [pieVisibility, setPieVisibility] = useState(false);
	const recordingToast = useRef(null);
	const [currentAudio, setCurrentAudio] = useState(null);
	const [currentAudioURL, setCurrentAudioURL] = useState(null);
	const [loadingState, setLoadingState] = useState(false);
	const [recordName, setRecordName] = useState('');
	const [emotionPredictions, setEmotionPredictions] = useState([0, 0, 0, 0]);
	const [mediaRecorder, setMediaRecorder] = useState(null);

	useEffect(() => {
		console.log('====> trigger', audioStartTime);
		const timeOut = 10 * 1000;
		const margin = 100;
		const timer = setTimeout(() => {
			if (Date.now() - audioStartTime <= timeOut + margin) {
				console.log('Function executed after 3 seconds', Date.now());
				stopRecording();
			}
		}, timeOut);

		return () => {
			clearTimeout(timer);
		};
	}, [audioStartTime]);

	const { status, startRecording, stopRecording } = useReactMediaRecorder({
		audio: true,
		onStart: () => {
			console.log({ status });
			setAudioStartTime(Date.now());
			recordingToast.current = showToast({
				msg: 'Recording',
				html: (
					<div>
						{'Recording   '}
						<MdFiberManualRecord color="red" />
					</div>
				),
				closeAfter: 10 * 1000,
				position: 'top-left',
				canClose: false,
			});
		},

		onStop: async (mediaBlobUrl, mediaBlob) => {
			console.log({ status });
			toast.dismiss(recordingToast.current);
			const response = await fetch(mediaBlobUrl);
			if (!response.ok) {
				throw new Error('Failed to fetch audio file');
			}

			const audioBlob = await response.blob();

			console.log(mediaBlobUrl);
			console.log(audioBlob);

			setCurrentAudio(audioBlob);
			setRecordName(`record ${Date.now().toString()}.wav`);
		},
		blobPropertyBag: { type: 'audio/wav' },
	});

	const showToast = ({
		html,
		msg,
		closeAfter = 5000,
		position = 'top-right',
		canClose = true,
		hideProgressBar = false,
	}) => {
		return toast(html ? html : msg, {
			position,
			autoClose: closeAfter,
			hideProgressBar,
			closeOnClick: canClose,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: 'dark',
		});
	};

	useEffect(() => {
		showToast({ msg: 'Welcome joe404', hideProgressBar: true, closeAfter: 1000 });
	}, []);

	useEffect(() => {
		console.log('======> hope 2');
		if (currentAudio) {
			setCurrentAudioURL(URL.createObjectURL(currentAudio));
		}
	}, [currentAudio]);

	const handleFileChange = (event) => {
		setRecordName(event.target.files[0].name);
		setCurrentAudio(event.target.files[0]);
	};

	// const startRecording = async () => {
	// 	console.log('STARTTT');
	// 	audioChunks.current = [];
	// 	console.log('asking permission');
	// 	const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
	// 	console.log('permission granted');
	// 	const recorder = new MediaRecorder(stream);

	// 	recorder.ondataavailable = (e) => {
	// 		console.log('data ==>', e.data);
	// 		audioChunks.current.push(e.data);
	// 	};

	// 	recorder.onstop = () => {
	// 		const audioBlob = new Blob(audioChunks.current, { type: recorder.mimeType });
	// 		console.log('STOPPPP', audioBlob);
	// 		setCurrentAudio(audioBlob);
	// 	};

	// 	setMediaRecorder(recorder);
	// 	recorder.start(2000);
	// };

	// const stopRecording = () => {
	// 	if (mediaRecorder) {
	// 		mediaRecorder.stop();
	// 	}
	// };

	const onUploadFileClick = () => {
		fileInputRef.current.click();
	};
	const handleSubmit = async () => {
		if (!currentAudio) {
			showToast({ msg: 'Please select or record an audio file' });
			return;
		}
		const formData = new FormData();
		formData.append('file', currentAudio, recordName);

		try {
			console.log('===========================>>', currentAudio);
			setLoadingState(true);
			try {
				const currentUrl = currentAudioURL;
				setCurrentAudioURL('');
				const res = await customAxios.post({
					endpoint: '/upload_audio',
					headers: { 'Content-Type': 'multipart/form-data' },
					body: formData,
				});
				setLoadingState(false);
				console.log('===========================>>', currentAudio);

				let predictions = [
					parseFloat(res.predictions.ANG),
					parseFloat(res.predictions.HAP),
					parseFloat(res.predictions.NEU),
					parseFloat(res.predictions.SAD),
				];

				let mx = -1;
				let idx = 0;
				predictions.forEach((val, i) => {
					predictions[i] *= 100;
					if (val > mx) {
						mx = val;
						idx = i;
					}
				});

				showToast({
					msg: `The dominant emotion is ${
						idx == 0 ? 'Anger' : idx == 1 ? 'Happiness' : idx == 2 ? 'Neutrality' : 'Sadness'
					}`,
					closeAfter: 3 * 1000,
					position: 'top-center',
					hideProgressBar: true,
				});
				setEmotionPredictions(predictions);
				setCurrentAudioURL(currentUrl);
				setPieVisibility(true);
				console.log('File uploaded successfully:', predictions);
			} catch (e) {
				console.log(e);
				setLoadingState(false);
				setEmotionPredictions([1, 1, 1, 1]);
				console.log('Error uploading file:', error);
			}
		} catch (error) {
			setLoadingState(false);
			setEmotionPredictions([1, 1, 1, 1]);
			console.log('Error uploading file:', error);
		}
	};

	const data = {
		labels: ['Angry', 'Happy', 'Neutral', 'Sad'],
		datasets: [
			{
				label: '% ',
				data: emotionPredictions,
				backgroundColor: [
					'rgba(255, 99, 132, 0.5)',
					'rgba(54, 162, 235, 0.5)',
					'rgba(255, 206, 86, 0.5)',
					'rgba(205, 106, 6, 0.5)',
				],
				borderColor: [
					'rgba(255, 99, 132, 1)',
					'rgba(54, 162, 235, 1)',
					'rgba(255, 206, 86, 1)',
					'rgba(205, 106, 6, 1)',
				],
				borderWidth: 1,
			},
		],
	};

	const containerRef = useRef();

	const { wavesurfer, isPlaying, isReady, currentTime } = useWavesurfer({
		container: containerRef,
		url: currentAudioURL,
		waveColor: 'purple',
		height: 500,
		barRadius: 50,
	});
	const onPlayPause = () => {
		wavesurfer && wavesurfer.playPause();
	};

	const options = {
		plugins: {
			legend: {
				position: 'top',
			},
		},
	};
	return loadingState ? (
		<div>
			<l-quantum size="200" speed="1.75" color="white"></l-quantum>
		</div>
	) : (
		<div className="container">
			<div className="audio-controls">
				<h2>Audio Controls</h2>
				<button onClick={status != 'recording' ? startRecording : stopRecording}>
					{status != 'recording' ? 'Start Recording' : 'Stop Recording'}
				</button>

				{status != 'recording' ? <button onClick={onUploadFileClick}>Upload File</button> : <></>}
				{status != 'recording' && currentAudioURL ? <div ref={containerRef} /> : <></>}
				{currentAudioURL && status != 'recording' ? (
					<>
						<button onClick={onPlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
						<button onClick={handleSubmit}>Analyze Audio</button>
					</>
				) : (
					<> </>
				)}
			</div>
			<div className="graph-display">
				<h2>Emotions Predictions</h2>
				{pieVisibility ? <Pie data={data} options={options} /> : <></>}
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
			<input
				type="file"
				ref={fileInputRef}
				style={{ display: 'none' }}
				accept=".mp3,.wav"
				onChange={handleFileChange}
			/>
		</div>
	);
};

export default AudioAnalyzer;
