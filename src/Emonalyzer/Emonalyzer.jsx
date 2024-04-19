import React, { useEffect, useRef, useState } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';
import Chart from 'chart.js/auto';

const AudioAnalyzer = ({ customAxios }) => {
	const areaChartRef = useRef(null);
	const pieChartRef = useRef(null);
	const audioChunks = useRef([]);
	const [currentAudio, setCurrentAudio] = useState(null);
	const [mediaRecorder, setMediaRecorder] = useState(null);
	// const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({
	// 	audio: true,
	// 	onStop: async (mediaBlobUrl, mediaBlob) => {
	// 		console.log(mediaBlobUrl);
	// 		console.log(mediaBlob);
	// 		setCurrentAudio(mediaBlob);
	// 	},
	// 	blobPropertyBag: { type: 'audio/webm' },
	// });

	// let onrecordingStop = async () => {
	// 	if (mediaBlobUrl) {
	// 		const audioBlob = await fetch(mediaBlobUrl).then((r) => r.blob());
	// 		setCurrentAudio(audioBlob);
	// 	}
	// };
	// useEffect(async () => {
	// 	console.log(status);
	// 	// if (mediaBlobUrl) {
	// 	// 	const audioBlob = await fetch(mediaBlobUrl).then((r) => r.blob());
	// 	// 	setCurrentAudio(audioBlob);
	// 	// }
	// }, [status]);

	useEffect(() => {
		const audioPlayer = document.getElementById('audio-player');
		if (currentAudio) {
			audioPlayer.src = URL.createObjectURL(currentAudio);
			audioPlayer.load();
		}
	}, [currentAudio]);

	const handleFileChange = (event) => {
		console.log(event.target.files[0]);
		setCurrentAudio(event.target.files[0]);
	};

	const startRecording = async () => {
		console.log('STARTTT');
		audioChunks.current = [];
		console.log('asking permission');
		const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
		console.log('permission granted');
		const recorder = new MediaRecorder(stream);

		recorder.ondataavailable = (e) => {
			console.log('data ==>', e.data);
			audioChunks.current.push(e.data);
		};

		recorder.onstop = () => {
			const audioBlob = new Blob(audioChunks.current, { type: recorder.mimeType });
			console.log('STOPPPP', audioBlob);
			setCurrentAudio(audioBlob);
		};

		setMediaRecorder(recorder);
		recorder.start(2000);
	};

	const stopRecording = () => {
		if (mediaRecorder) {
			mediaRecorder.stop();
		}
	};

	const handleSubmit = async () => {
		if (!currentAudio) {
			alert('Please select or record an audio file');
			return;
		}
		const formData = new FormData();
		formData.append('file', currentAudio, `record ${Date.now().toString()}.wav`);

		try {
			const res = await customAxios.post({
				endpoint: '/upload_audio',
				headers: { 'Content-Type': 'multipart/form-data' },
				body: formData,
			});

			console.log('File uploaded successfully:', res);
		} catch (error) {
			console.error('Error uploading file:', error);
		}
	};

	return (
		<div className="container">
			<div className="audio-controls">
				<h2>Audio Controls</h2>
				<input type="file" id="upload-audio" accept=".mp3,.wav" onChange={handleFileChange} />
				<button id="record-audio" onClick={startRecording}>
					Record Voice
				</button>
				<button onClick={stopRecording}>Stop Recording</button>
				<audio id="audio-player" controls></audio>
				<button id="analyze-audio" onClick={handleSubmit}>
					Analyze Audio
				</button>
			</div>
			<div className="graph-display">
				<h2>Graph Display</h2>
				<canvas ref={areaChartRef} id="area-chart" width="75vw"></canvas>
				<canvas ref={pieChartRef} id="pie-chart" width="75vw"></canvas>
			</div>
		</div>
	);
};

export default AudioAnalyzer;
