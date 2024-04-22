import { Link } from 'react-router-dom';
import { useState } from 'react';
import { TextField, Button, Typography, IconButton, InputAdornment, Container, Paper } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Register = ({ customAxios }) => {
	const {
		handleSubmit,
		control,
		formState: { errors },
		watch,
	} = useForm({
		mode: 'onChange',
	});

	const navigate = useNavigate();

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

	const watchPassword = watch('password', '');
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const handleTogglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};
	const handleToggleConfirmPasswordVisibility = () => {
		setShowConfirmPassword(!showConfirmPassword);
	};

	const onSubmit = async (data) => {
		console.log(data);
		// let res = await customAxios.post({
		// 	endpoint: '/register',
		// 	body: { username: data.email, password: data.password },
		// });
		showToast({ msg: 'Registered Successfully', closeAfter: false });
		// const timer = setTimeout(() => {
		// 	navigate('/');
		// 	// setTime((prevTime) => prevTime + 1);
		// }, 1000);

		const runFunctionAfterDelay = () => {
			setTimeout(() => {
				navigate('/');
				console.log('Function executed after 3 seconds');
			}, 2000);
		};

		// Call the function when the component renders
		runFunctionAfterDelay();
	};

	return (
		<Container maxWidth="xs">
			<Paper
				elevation={3}
				style={{ padding: '20px', marginTop: '20px', boxShadow: '0px 0px 10px rgba(0,0,0,0.2)' }}
			>
				<div>
					<Typography variant="h4">Register</Typography>
					<form onSubmit={handleSubmit(onSubmit)}>
						<Controller
							name="email"
							control={control}
							defaultValue=""
							rules={{ required: 'Email is required', pattern: /^\S+@\S+\.\S+$/ || 'Invalid email' }}
							render={({ field }) => (
								<TextField
									margin="normal"
									label="Email"
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
								minLength: { value: 6, message: 'Password must be at least 6 characters' },
							}}
							render={({ field }) => (
								<TextField
									margin="normal"
									label="Password"
									variant="filled"
									type={showPassword ? 'text' : 'password'}
									fullWidth
									error={Boolean(errors.password)}
									helperText={errors.password?.message}
									InputProps={{
										endAdornment: (
											<InputAdornment position="end">
												<IconButton onClick={handleTogglePasswordVisibility}>
													{showPassword ? <Visibility /> : <VisibilityOff />}
												</IconButton>
											</InputAdornment>
										),
									}}
									{...field}
								/>
							)}
						/>
						<Controller
							name="confirmPassword"
							control={control}
							defaultValue=""
							rules={{
								validate: (value) => value === watchPassword || 'Passwords do not match',
							}}
							render={({ field }) => (
								<TextField
									margin="normal"
									label="Confirm Password"
									variant="filled"
									type={showConfirmPassword ? 'text' : 'password'}
									fullWidth
									error={Boolean(errors.confirmPassword)}
									helperText={errors.confirmPassword?.message}
									InputProps={{
										endAdornment: (
											<InputAdornment position="end">
												<IconButton onClick={handleToggleConfirmPasswordVisibility}>
													{showConfirmPassword ? <Visibility /> : <VisibilityOff />}
												</IconButton>
											</InputAdornment>
										),
									}}
									{...field}
								/>
							)}
						/>
						<Button fullWidth variant="contained" color="primary" type="submit">
							Submit
						</Button>
					</form>
					<p>
						{`Already have an account?`} <Link to="/">Login</Link>
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

export default Register;
