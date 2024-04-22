import { Link } from 'react-router-dom';
import { TextField, Button, Typography, Container, Paper, InputAdornment, IconButton } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
	// const history = useHistory();

	// const goToLink = (link) => {
	// 	history.push(link);
	// };

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

	const navigate = useNavigate();
	const {
		handleSubmit,
		control,
		formState: { errors },
	} = useForm({
		mode: 'onChange',
	});
	const [showPassword, setShowPassword] = useState(false);
	const handleTogglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};
	const handleLogin = (data) => {};

	return (
		<Container maxWidth="xs">
			<h1>Welcome to Emonalyzer</h1>
			<Paper
				elevation={3}
				style={{ padding: '20px', marginTop: '20px', boxShadow: '0px 0px 10px rgba(0,0,0,0.2)' }}
			>
				<div>
					<Typography variant="h4">Login</Typography>
					<form onSubmit={handleSubmit(handleLogin)}>
						<Controller
							name="email"
							control={control}
							defaultValue=""
							rules={{
								required: 'Email is required',
								pattern: {
									value: /^\S+@\S+\.\S+$/,
									message: 'Invalid email',
								},
							}}
							render={({ field }) => (
								<TextField
									label="Email"
									margin="normal"
									variant="filled"
									fullWidth
									error={Boolean(errors.email)}
									helperText={errors.email?.message}
									{...field}
								/>
							)}
						/>
						<Controller
							name="password"
							control={control}
							defaultValue=""
							rules={{
								required: 'Password is required',
								minLength: {
									value: 6,
									message: 'Password must be at least 6 characters',
								},
							}}
							render={({ field }) => (
								<TextField
									label="Password"
									margin="normal"
									variant="filled"
									fullWidth
									type={showPassword ? 'text' : 'password'}
									InputProps={{
										endAdornment: (
											<InputAdornment position="end">
												<IconButton onClick={handleTogglePasswordVisibility}>
													{showPassword ? <Visibility /> : <VisibilityOff />}
												</IconButton>
											</InputAdornment>
										),
									}}
									error={Boolean(errors.password)}
									helperText={errors.password?.message}
									{...field}
								/>
							)}
						/>
						<Button
							fullWidth
							variant="contained"
							color="primary"
							onClick={() => {
								navigate('/Emonalyzer');
							}}
						>
							Submit
						</Button>
					</form>
					<p>
						{`Don't have an account?`} <Link to="/register">Register</Link>
					</p>
				</div>
			</Paper>
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
		</Container>
	);
};

export default Login;
