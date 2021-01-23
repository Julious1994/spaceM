import React, {useState} from 'react';
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
import PhoneInput from 'react-native-phone-number-input';
import Icon from "react-native-vector-icons/MaterialIcons";

import OTPInputView from '@twotalltotems/react-native-otp-input';
import {LoginButton, AccessToken, LoginManager} from 'react-native-fbsdk';
const services = new Service();
function MobileLogin(props) {
	const {navigation} = props;
	const [state, dispatch] = useStateValue();
	const [value, setValue] = useState('');
	const [mobile, setMobile] = React.useState();
	const [timer, setTimer] = React.useState(0);
	const [otp, setOtp] = React.useState();
	const [sent, setSent] = React.useState(false);
	const [resent, setResent] = React.useState(false);
	const [credential, setCredential] = React.useState({}); // const [load] const handleChange = React.useCallback((key, value) => { setCredential((c) => { return {...c, [key]: value}; }); }, []);
	const phoneInput = React.useRef(null);
	const sendOtp = React.useCallback(
		(isResent = false) => {
			dispatch({type: 'SET_LOADING', loading: true});
			services.post('SendOTP', {Mobile: mobile}).then(async (res) => {
				console.log(res);
				dispatch({type: 'SET_LOADING', loading: false});
				if (res.status === 200) {
					// if(res)
					setTimer(30);
					setSent(true);
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
		[mobile, dispatch, timer],
	);
	const verifyOtp = React.useCallback(() => {
		dispatch({type: 'SET_LOADING', loading: true});
		services.post('MatchOTP', {OTP: otp, Mobile: mobile}).then(async (res) => {
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
				console.log(res, res.res, typeof res.res);
				if (typeof res.res === 'object') {
					Alert.alert('Mobile login', JSON.stringify(res.res));
				} else if (Array.isArray(res.res)) {
					Alert.alert('Mobile login', res.res[0]);
				} else if (res.Body) {
					Alert.alert('Mobile login', res.Body);
				} else {
					Alert.alert('Mobile login', res.res);
				}
				// setSent(true);
			}
		});
	}, [otp, dispatch, mobile]);

	React.useEffect(() => {
		// exit early when we reach 0
		if (!timer) return;

		// save intervalId to clear the interval when the
		// component re-renders
		const intervalId = setInterval(() => {
			setTimer(timer - 1);
		}, 1000);

		// clear interval on re-render to avoid memory leaks
		return () => clearInterval(intervalId);
		// add timeLeft as a dependency to re-rerun the effect
		// when we update it
	}, [timer]);

	const handleForgotPassword = React.useCallback(() => {
		navigation.dispatch(StackActions.push('ForgotPassword'));
	}, [navigation]);
	const handleSignup = React.useCallback(() => {
		navigation.dispatch(StackActions.push('Signup'));
	}, [navigation]);
	const handleLogin = React.useCallback(() => {
		if (credential.Email && credential.Password) {
			dispatch({type: 'SET_LOADING', loading: true});
			const data = {...credential};
			services.post('Login', data).then(async (res) => {
				dispatch({type: 'SET_LOADING', loading: false});
				if (res.status === 200) {
					dispatch({type: 'SET_USER', userData: res.res});
					await AsyncStorage.setItem('user', JSON.stringify({...res.res}));
					navigation.dispatch(
						StackActions.replace('Home', {params: {user: {...credential}}}),
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
	console.log(sent);
	return (
		<Page>
			<View
				style={[
					commonStyles.pageStyle,
					styles.container,
					commonStyles.largePageSize,
				]}>
				<TouchableOpacity
					style={commonStyles.backButton}
					onPress={() => navigation.goBack()}>
					<Image
						source={imageMapper.leftArrow.source}
						style={commonStyles.backButtonIcon}
					/>
				</TouchableOpacity>
				<Image source={imageMapper.logoIcon.source} style={styles.imageLogo} />
				<Typography variant="title2" style={styles.welcomeText}>
					Welcome Back
				</Typography>
				<PhoneInput
					ref={phoneInput}
					defaultValue={value}
					defaultCode="IN"
					layout="first"
					containerStyle={[
						{
							width: '100%',
							color: '#fff',
							backgroundColor: '#031B3B',
							height: 60,
							borderRadius: 5,
						},
						styles.input,
					]}
					textContainerStyle={{
						color: '#fff',
						padding: 0,
						margin: 0,
						borderRadius: 5,
						backgroundColor: '#031B3B',
					}}
					textInputStyle={{
						backgroundColor: '#031B3B',
						color: '#fff',
						padding: 0,
						margin: 0,
					}}
					renderDropdownImage={<Icon name="arrow-drop-down" size={18} color="#fff" />}
					codeTextStyle={{color: '#fff'}}
					flagButtonStyle={{backgroundColor: '#031B3B', borderRadius: 5}}
					textInputProps={{style: {color: '#fff', height: 40}, placeholderTextColor: '#fff'}}
					onChangeText={(text) => {
						setValue(text);
					}}
					onChangeFormattedText={(text) => {
						setMobile(text);
					}}
					autoFocus
					countryPickerProps={{
						theme: {backgroundColor: '#031B3B', onBackgroundTextColor: '#fff', filterPlaceholderTextColor: '#fff', primaryColorVariant: '#'}
					}}
				/>
				{/* <Input
					style={styles.input}
					value={mobile}
					placeholder="Enter phone number with country code"
					onChange={(value) => setMobile(value)}
				/> */}
				{sent && (
					<Input
						style={styles.input}
						value={otp}
						placeholder="OTP"
						secureTextEntry={true}
						onChange={(value) => setOtp(value)}
					/>
				)}
				{sent && (
					<View style={{display: 'flex', flexDirection: 'row'}}>
						<TouchableOpacity
							style={styles.forgotLink}
							disabled={timer > 0}
							onPress={() => sendOtp(true)}>
							<Typography variant="body" style={styles.forgotText}>
								Resend OTP
							</Typography>
						</TouchableOpacity>
						{timer > 0 && (
							<Typography
								variant="tiny1"
								style={{
									marginTop: 3,
									marginLeft: 5,
								}}>{`in 00:${timer}`}</Typography>
						)}
					</View>
				)}
				<View style={{marginBottom: 20}} />
				{!sent && (
					<Button disabled={!mobile} title="Send OTP" onPress={sendOtp} />
				)}
				{sent && (
					<Button
						disabled={!Boolean(otp) && (otp || '').length < 6}
						title="Verify OTP"
						onPress={verifyOtp}
					/>
				)}
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
	imageLogo: {width: 64, height: 64, alignSelf: 'center'},
	input: {marginTop: 10, marginBottom: 10},
	forgotLink: {marginBottom: 20},
	forgotText: {textDecorationLine: 'underline', fontWeight: 'normal'},
	signupLinkContainer: {
		display: 'flex',
		flexDirection: 'row',
		marginBottom: 15,
		// position: 'absolute',
		marginTop: 75,
		alignSelf: 'center',
	},
	welcomeText: {alignSelf: 'center', marginTop: 20, marginBottom: 20},
	dontHaveAccount: {opacity: 0.5, marginRight: 5},
	signup: {textDecorationLine: 'underline', fontWeight: 'bold'},
});
export default MobileLogin;

{
	/* <OTPInputView
						style={{width: '80%', height: 200}}
						pinCount={6}
						// code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
						// onCodeChanged = {code => { this.setState({code})}}
						autoFocusOnLoad
						codeInputFieldStyle={styles.underlineStyleBase}
						codeInputHighlightStyle={styles.underlineStyleHighLighted}
						onCodeFilled={(code) => {
							console.log(`Code is ${code}, you are good to go!`);
							setOtp(code);
						}}
					/> */
}
