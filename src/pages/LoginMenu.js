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
import { GoogleSignin, GoogleSigninButton } from '@react-native-community/google-signin';
import Icon from "react-native-vector-icons/MaterialIcons";
import LinearGradient from 'react-native-linear-gradient';

const services = new Service();

GoogleSignin.configure({
	webClientId: '206403307836-68kbtfcasp038nrjhsp334hf8a3jv9p7.apps.googleusercontent.com',
});

function LoginMenu(props) {
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

	// const handleLogin = React.useCallback(() => {
	// 	if (credential.Email && credential.Password) {
	// 		dispatch({type: 'SET_LOADING', loading: true});
	// 		const data = {
	// 			...credential,
	// 		};
	// 		services.post('Login', data).then(async (res) => {
	// 			dispatch({type: 'SET_LOADING', loading: false});
	// 			if (res.status === 200) {
	// 				dispatch({type: 'SET_USER', userData: res.res});
	// 				await AsyncStorage.setItem('loginData', JSON.stringify({...data}));
	// 				await AsyncStorage.setItem('user', JSON.stringify({...res.res}));
	// 				navigation.dispatch(
	// 					StackActions.replace('Home', {
	// 						params: {user: {...credential}},
	// 					}),
	// 				);
	// 			} else {
	// 				let message = '';
	// 				if (Array.isArray(res.res)) {
	// 					message = res.res[0];
	// 				} else {
	// 					message = res.res || res.res.Message;
	// 				}
	// 				Alert.alert('Network Error', message);
	// 			}
	// 		});
	// 	} else {
	// 		Alert.alert('Validation Error', 'All fields are required');
	// 	}
	// }, [credential, navigation, dispatch]);

	React.useEffect(() => {
		async function getUser() {
			const user = await AsyncStorage.getItem('user');
			const loginData = await AsyncStorage.getItem('loginData');

			if (user) {
				const userData = user ? JSON.parse(user) : {};
				const data = {
					UserId: userData.CustomerId,
				};
				services.post('GetUserDetailByID', data).then((res) => {
					if (res.status === 200) {
						dispatch({type: 'SET_USER', userData: {...userData, ...res.res}});
						navigation.dispatch(
							StackActions.replace('Home', {
								params: {user: {...userData, ...res.res}},
							}),
						);
					} else {
						Alert.alert('Network error', 'Try again later');
					}
				});
				
			} else if(loginData) {
				setCredential(JSON.parse(loginData))
			}
		}
		getUser();
	}, [dispatch, navigation]);

	const handleSocialLogin = React.useCallback(
		(json) => {
			const data = {
				Email: json.email,
				UserName: json.name,
				TokenId: json.id,
			};
			services.post('SocialLogin', data).then(async (res) => {
				console.log(res);
				dispatch({type: 'SET_LOADING', loading: false});
				if (res.status === 200) {
					dispatch({type: 'SET_USER', userData: res.res});
					await AsyncStorage.setItem('user', JSON.stringify({...res.res}));
					navigation.dispatch(
						StackActions.replace('Home', {
							params: {user: {...res.res}},
						}),
					);
				} else {
					if (typeof res.res === 'object') {
						Alert.alert('Mobile login', JSON.stringify(res.res));
					} else if (Array.isArray(res.res)) {
						Alert.alert('Mobile login', res.res[0]);
					} else if (res.Body) {
						Alert.alert('Mobile login', res.Body);
					} else {
						Alert.alert('Mobile login', res.res);
					}
				}
			});
		},
		[dispatch, navigation],
	);

	const handleMobileLogin = React.useCallback(() => {
		navigation.dispatch(
			StackActions.push('MobileLogin'),
		);
    }, []);
    
    const handleLogin = React.useCallback(() => {
		navigation.dispatch(
			StackActions.push('Login'),
		);
	}, []);
	
	const handleGoogleLogin = React.useCallback(async () => {
		dispatch({type: 'SET_LOADING', loading: true});
		try {
			await GoogleSignin.hasPlayServices();
    		const userInfo = await GoogleSignin.signIn();
			console.log(userInfo);
			handleSocialLogin(userInfo.user);
		} catch(e) {
			dispatch({type: 'SET_LOADING', loading: false});
			console.log('ERROR', e, {...e});
			Alert.alert("Failed to login", e.message);
		}
	}, []);
    

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
				<Button leftIcon={<Image source={imageMapper.google.source} style={styles.google} />} style={styles.loginButton} title="Login with Gmail" onPress={handleGoogleLogin} />
				<Button leftIcon={<Icon name="email" size={24} color="#fff" style={styles.buttonIcon} />} style={styles.loginButton} title="Login with Email" onPress={handleLogin} />
				<Button leftIcon={<Icon name="call" size={24} color="#fff" style={styles.buttonIcon} />} style={styles.loginButton} title="Login with Mobile" onPress={handleMobileLogin} />
				
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
		marginBottom: 15,
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
    loginButton: {
        marginBottom: 15,
	},
	google: {
		width: 24,
		height: 20,
		marginTop: 3,
		marginRight: 10,
	},
	buttonIcon: {
		marginRight: 10,
		// marginTop: 5
	}
});

export default LoginMenu;
