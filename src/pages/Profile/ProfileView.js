import React from 'react';
import {
	View,
	Text,
	StyleSheet,
	Image,
	TouchableOpacity,
	Alert,
} from 'react-native';
import Typography from './../../components/Typography';
import Input from './../../components/Input';
import Button from './../../components/Button';
import commonStyles from './../../commonStyles';
import imageMapper from './../../images/imageMapper';
import Service from '../../services/http';
import {StackActions} from '@react-navigation/native';
import Page from '../../components/Page';
import {useStateValue} from '../../store/store';

const services = new Service();

function ProfileView(props) {
	const {navigation, route} = props;
	const {params = {}} = route;
	const [state, dispatch] = useStateValue();
	const {user} = state;
	const {profile = {}} = params;
	const [credential, setCredential] = React.useState({});

	const handleChange = React.useCallback((key, value) => {
		setCredential((c) => {
			return {...c, [key]: value};
		});
	}, []);
	const handleSignup = React.useCallback(() => {
		if (
			credential.UserName &&
			credential.Password &&
			credential.confirmPassword &&
			credential.Email
		) {
			if (credential.Password === credential.confirmPassword) {
				const data = {...credential};
				delete data.confirmPassword;
				dispatch({type: 'SET_LOADING', loading: true});
				services.post('Registration', data).then((res) => {
					dispatch({type: 'SET_LOADING', loading: false});

					Alert.alert('Success', 'Registration is successful', [
						{
							text: 'OK',
							onPress: () => {
								navigation.dispatch(StackActions.replace('Login'));
							},
						},
					]);
				});
			} else {
				Alert.alert('Validation Error', 'Confirm password is different');
			}
			console.log('login');
		} else {
			Alert.alert('Validation Error', 'All fields are required');
		}
	}, [credential, navigation, dispatch]);

	const handleLogin = React.useCallback(() => {
		navigation.dispatch(StackActions.replace('Login'));
	}, [navigation]);

	return (
		<Page>
			<View
				style={[
					commonStyles.pageStyle,
					styles.container,
					commonStyles.largePageSize,
				]}>
				<Input
					style={styles.input}
					value={profile.UserName}
					placeholder="Enter your name"
					onChange={(value) => handleChange('UserName', value)}
				/>
				<Input
					style={styles.input}
					value={profile.Email}
					placeholder="Enter your email id"
					onChange={(value) => handleChange('Email', value)}
				/>
				<Input
					style={styles.input}
					value={profile.MobileNumber}
					placeholder="Phone number"
					onChange={(value) => handleChange('MobileNumber', value)}
				/>
				<Button
					style={styles.signupButton}
					title="Save"
					onPress={handleSignup}
				/>
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
	signupButton: {
		marginTop: 10,
	},
});

export default ProfileView;
