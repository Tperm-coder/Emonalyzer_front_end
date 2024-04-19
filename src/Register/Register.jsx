import { Link } from 'react-router-dom';
import { useState } from 'react';
import { TextField, Button, Typography, IconButton, InputAdornment, Container, Paper } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';

const Register = ({ customAxios }) => {
	const {
		handleSubmit,
		control,
		formState: { errors },
		watch,
	} = useForm({
		mode: 'onChange',
	});

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
		let res = await customAxios.post({
			endpoint: '/register',
			body: { username: data.email, password: data.password },
		});
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
		</Container>
	);
};

export default Register;
