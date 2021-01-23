import React, {useEffect} from 'react';
import {
	View,
	Text,
	StyleSheet,
	Image,
	TouchableOpacity,
	Alert,
} from 'react-native';
import Typography from './../../components/Typography';
import ScrollablePageView from './../../components/ScrollablePageView';
import Input from './../../components/Input';
import Button from './../../components/Button';
import commonStyles from './../../commonStyles';
import imageMapper from './../../images/imageMapper';
import LinearGradiant from 'react-native-linear-gradient';
import Service from '../../services/http';
import {useStateValue} from '../../store/store';
import moment from 'moment';
import {StackActions} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const services = new Service();

const Header = ({navigation}) => (
	<View style={[commonStyles.pageStyle, styles.headerContainer]}>
		<TouchableOpacity
			style={styles.backButton}
			onPress={() => navigation.goBack()}>
			<Image
				source={imageMapper.leftArrow.source}
				style={styles.backButtonIcon}
			/>
		</TouchableOpacity>
		<Typography variant="title3">Change Password</Typography>
	</View>
);

const getUri = (item, i) => {
	return item.ThumbnailPath
		? {uri: `https://spacem.azurewebsites.net/${item.ThumbnailPath}`}
		: imageMapper.landscapeMovie.source;
};

function ChangePassword(props) {
	const {navigation} = props;
	const [list, setList] = React.useState([]);
	const [state, dispatch] = useStateValue();
	const [passwordDetails, setPasswordDetails] = React.useState({});

	const handleChange = React.useCallback((key, value) => {
		setPasswordDetails((d) => {
			return {...d, [key]: value};
		});
	}, []);

	const handleLogin = React.useCallback(() => {
		AsyncStorage.removeItem('user');
		navigation.dispatch(StackActions.replace('Login'));
	}, [navigation]);

	const handleSubmit = React.useCallback(() => {
		console.log(passwordDetails, state.user);
		if (
			passwordDetails.oldPassword &&
			passwordDetails.password &&
			passwordDetails.confirmPassword
		) {
			if (passwordDetails.password === passwordDetails.confirmPassword) {
				const data = {
					UserId: state.user.CustomerId,
					Password: passwordDetails.password,
					UserName: state.user.UserName,
				};
				services.post('ChangePassword', data).then((res) => {
					if (res.status === 200) {
						Alert.alert('Success', res.res, [
							{text: 'OK', onPress: handleLogin},
						]);
					}
				});
			} else {
				Alert.alert('Validation Error', 'Confirm password is different');
			}
		} else {
			Alert.alert('Validation Error', 'All fields are required');
		}
	}, [passwordDetails, state.user, handleLogin]);

	useEffect(() => {
		services
			.post(`PurchaseVideoList?CustomerId=${state.user.CustomerId}`)
			.then((res) => {
				console.log('list', res);
				setList([...res.res]);
			});
	}, [state.user]);

	return (
		<ScrollablePageView
			header={<Header navigation={props.navigation} />}
			navigation={props.navigation}>
			<View style={[commonStyles.pageStyle, styles.container]}>
				<Input
					style={styles.input}
					secureTextEntry={true}
					value={passwordDetails.oldPassword}
					placeholder="Enter old password"
					onChange={(value) => handleChange('oldPassword', value)}
				/>
				<Input
					style={styles.input}
					secureTextEntry={true}
					value={passwordDetails.password}
					placeholder="Enter new password"
					onChange={(value) => handleChange('password', value)}
				/>
				<Input
					style={styles.input}
					secureTextEntry={true}
					value={passwordDetails.confirmPassword}
					placeholder="Retype password"
					onChange={(value) => handleChange('confirmPassword', value)}
				/>
				<Button
					style={styles.signupButton}
					title="Change password"
					onPress={handleSubmit}
				/>
			</View>
		</ScrollablePageView>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingTop: '10%',
		paddingLeft: '10%',
		paddingRight: '10%',
		paddingBottom: '5%',
	},
	imageLogo: {
		width: 64,
		height: 64,
		alignSelf: 'center',
	},
	priceView: {
		display: 'flex',
		flexDirection: 'row',
		marginTop: 15,
	},
	planName: {
		color: '#fff',
		fontWeight: 'normal',
	},
	planContainer: {
		display: 'flex',
		flexDirection: 'row',
		marginBottom: 20,
	},
	planImage: {
		height: 23,
		width: 23,
	},
	planImageView: {
		width: 45,
		height: 45,
		backgroundColor: '#041D3E',
		borderRadius: 5,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	planInfo: {
		flex: 1,
		paddingLeft: 20,
		display: 'flex',
		justifyContent: 'space-around',
		// paddingTop: 3,
		paddingBottom: 4,
	},
	planType: {
		paddingLeft: 4,
		marginTop: 5,
		color: '#fff',
		fontWeight: 'normal',
	},
	priceMonth: {
		color: '#fff',
		lineHeight: 30,
		marginLeft: 2,
		opacity: 0.9,
	},
	currentPlanText: {
		fontWeight: '100',
		marginBottom: 5,
	},
	expiredText: {
		opacity: 0.7,
		alignSelf: 'flex-end',
	},
	currentPlanContainer: {
		borderRadius: 10,
		paddingTop: 25,
		paddingBottom: 25,
		paddingLeft: 20,
		paddingRight: 20,
		marginBottom: 20,
	},
	headerContainer: {
		height: 'auto',
		position: 'relative',
		alignItems: 'center',
		paddingTop: 10,
		paddingBottom: 10,
	},
	backButton: {
		position: 'absolute',
		left: 10,
		top: 10,
		padding: 10,
	},
	backButtonIcon: {
		width: 10,
		height: 16,
	},
	movieImage: {
		width: 110,
		height: 70,
	},
	input: {
		marginTop: 10,
		marginBottom: 10,
	},
	signup: {
		textDecorationLine: 'underline',
		fontWeight: 'bold',
	},
	signupButton: {
		marginTop: '20%',
	},
});

export default ChangePassword;
