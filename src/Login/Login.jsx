import { Link } from 'react-router-dom';
import { TextField, Button, Typography, Container, Paper, InputAdornment, IconButton } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useState } from 'react';

const Login = () => {
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
	const handleLogin = (data) => {
		console.log('Login successful');
		console.log('=== data ===', data);
	};

	return (
		<Container maxWidth="xs">
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
						<Button fullWidth variant="contained" color="primary" type="submit">
							Submit
						</Button>
					</form>
					<p>
						{`Don't have an account?`} <Link to="/register">Register</Link>
					</p>
					<p>
						{`Don't have an account?`} <Link to="/emonalyzer">Go to app</Link>
					</p>
				</div>
			</Paper>
		</Container>
	);
};

export default Login;
