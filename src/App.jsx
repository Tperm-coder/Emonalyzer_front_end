import './App.css';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import Login from './Login/Login';
import Register from './Register/Register';
import Emonalyzer from './Emonalyzer/Emonalyzer';
import Layout from './Layout/Layout';
import CustomAxios from './axios/customAxios';
import config from './config/config';

function App() {
	let customAxios = new CustomAxios(config.baseUrl);
	let routes = createHashRouter([
		{
			path: '/',
			element: <Layout />,
			children: [
				{ index: true, element: <Login /> },
				{ path: '/register', element: <Register customAxios={customAxios} /> },
				{ path: '/emonalyzer', element: <Emonalyzer customAxios={customAxios} /> },
			],
		},
	]);
	return (
		<div className="App">
			<RouterProvider router={routes} />
		</div>
	);
}

export default App;
