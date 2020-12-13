import React from 'react';
import {
	View,
	Alert,
	Text,
	StyleSheet,
	Image,
	TouchableOpacity,
} from 'react-native';
import Typography from './../components/Typography';
import Input from './../components/Input';
import Button from './../components/Button';
import commonStyles from './../commonStyles';
import imageMapper from './../images/imageMapper';
import {StackActions} from '@react-navigation/native';
import Service from '../services/http';
import Page from '../components/Page';
import {useStateValue} from '../store/store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const services = new Service();

function Login(props) {
	const {navigation} = props;
	const [state, dispatch] = useStateValue();
	const [credential, setCredential] = React.useState({});
	// const [load]
	const handleChange = React.useCallback((key, value) => {
		setCredential((c) => {
			return {...c, [key]: value};
		});
	}, []);

	const handleForgotPassword = React.useCallback(() => {
		navigation.dispatch(StackActions.push('ForgotPassword'));
	}, [navigation]);

	const handleSignup = React.useCallback(() => {
		navigation.dispatch(StackActions.push('Signup'));
	}, [navigation]);

	const handleLogin = React.useCallback(() => {
		if (credential.Email && credential.Password) {
			dispatch({type: 'SET_LOADING', loading: true});
			const data = {
				...credential,
			};
			services.post('Login', data).then(async (res) => {
				dispatch({type: 'SET_LOADING', loading: false});
				if (res.status === 200) {
					dispatch({type: 'SET_USER', user: res.res});
					await AsyncStorage.setItem('user', JSON.stringify({...res.res}));
					navigation.dispatch(
						StackActions.replace('Home', {
							params: {user: {...credential}},
						}),
					);
				} else {
					let message = '';
					if (Array.isArray(res.res)) {
						message = res.res[0];
					} else {
						message = res.res || res.res.Message;
					}
					Alert.alert('Network Error', message);
				}
			});
		} else {
			Alert.alert('Validation Error', 'All fields are required');
		}
	}, [credential, navigation, dispatch]);

	React.useEffect(() => {
		async function getUser() {
			const user = await AsyncStorage.getItem('user');
			if (user) {
				const userData = user ? JSON.parse(user) : {};
				dispatch({type: 'SET_USER', userData});
				navigation.dispatch(
					StackActions.replace('Home', {
						params: {user: {...userData}},
					}),
				);
			}
		}
		getUser();
	}, [dispatch, navigation]);

	return (
		<Page>
			<View
				style={[
					commonStyles.pageStyle,
					styles.container,
					commonStyles.largePageSize,
				]}>
				<Image source={imageMapper.logoIcon.source} style={styles.imageLogo} />
				<Typography variant="title2" style={styles.welcomeText}>
					Welcome Back
				</Typography>
				<Input
					style={styles.input}
					value={credential.Email}
					placeholder="Enter your Email id / phone number"
					onChange={(value) => handleChange('Email', value)}
				/>
				<Input
					style={styles.input}
					value={credential.Password}
					placeholder="Password"
					secureTextEntry={true}
					onChange={(value) => handleChange('Password', value)}
				/>
				<TouchableOpacity
					style={styles.forgotLink}
					onPress={handleForgotPassword}>
					<Typography variant="body" style={styles.forgotText}>
						Forgot password
					</Typography>
				</TouchableOpacity>
				<Button title="Login" onPress={handleLogin} />
				<View style={styles.signupLinkContainer}>
					<Typography variant="description" style={styles.dontHaveAccount}>
						Don't have an account?
					</Typography>
					<TouchableOpacity onPress={handleSignup}>
						<Typography variant="description" style={styles.signup}>
							Signup
						</Typography>
					</TouchableOpacity>
				</View>
			</View>
		</Page>
	);
}

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
	},
	imageLogo: {
		width: 64,
		height: 64,
		alignSelf: 'center',
	},
	input: {
		marginTop: 10,
		marginBottom: 10,
	},
	forgotLink: {
		marginBottom: 20,
	},
	forgotText: {
		textDecorationLine: 'underline',
		fontWeight: 'normal',
	},
	signupLinkContainer: {
		display: 'flex',
		flexDirection: 'row',
		// position: 'absolute',
		marginTop: 75,
		alignSelf: 'center',
	},
	welcomeText: {
		alignSelf: 'center',
		marginTop: 20,
		marginBottom: 20,
	},
	dontHaveAccount: {
		opacity: 0.5,
		marginRight: 5,
	},
	signup: {
		textDecorationLine: 'underline',
		fontWeight: 'bold',
	},
});

export default Login;
