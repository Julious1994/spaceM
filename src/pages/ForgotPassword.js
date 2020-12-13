import React from 'react';
import {View, Text, Alert, StyleSheet, Image, TouchableOpacity} from 'react-native';
import Typography from './../components/Typography';
import Input from './../components/Input';
import Button from './../components/Button';
import commonStyles from './../commonStyles';
import imageMapper from './../images/imageMapper';
import Service from '../services/http';
import Page from '../components/Page';
import {useStateValue} from '../store/store';
import {StackActions} from '@react-navigation/native';

const services = new Service();

function ForgotPassword(props) {
	const {navigation} = props;
	const [email, setEmail] = React.useState('');
	const [state, dispatch] = useStateValue();

	const handleEmail = React.useCallback((value) => {
		setEmail(value);
	}, []);

	const handleResetPassword = React.useCallback(() => {
		if (email) {
			dispatch({type: 'SET_LOADING', loading: true});
			const data = {
				Email: email,
			};
			services.post('ForgotPassword', data).then((res) => {
				console.log(res);
				dispatch({type: 'SET_LOADING', loading: false});
				if (res.status === 200) {
					Alert.alert('Success', 'Email sent successfully. Check your email.', [
						{
							text: 'OK',
							onPress: () => {
								navigation.dispatch(StackActions.replace('Login'));
							},
						},
					]);
				} else {
					Alert.alert('Network Error', res.res[0]);
				}
			});
		} else {
			Alert.alert('Validation Error', 'Email/Number is required');
		}
	}, [email, navigation, dispatch]);

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
					Forgot Password
				</Typography>
				<Typography variant="body" style={styles.description}>
					Enter your e-mail address and we'll send you a link to reset your
					password.
				</Typography>
				<Input
					style={styles.input}
					value={email}
					placeholder="Enter your email id"
					onChange={handleEmail}
				/>
				<Button
					style={styles.resetButton}
					title="Reset Password"
					onPress={handleResetPassword}
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
	welcomeText: {
		alignSelf: 'center',
		marginTop: 20,
		marginBottom: 20,
	},
	description: {
		textAlign: 'center',
		marginLeft: 7,
		marginRight: 7,
		fontWeight: 'normal',
		marginBottom: 25,
	},
	resetButton: {
		marginTop: 25,
	},
});

export default ForgotPassword;
