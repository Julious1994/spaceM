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
import ScrollablePageView from './../../components/ScrollablePageView';
import Input from './../../components/Input';
import Button from './../../components/Button';
import commonStyles from './../../commonStyles';
import imageMapper from './../../images/imageMapper';
import Service from '../../services/http';
import {StackActions} from '@react-navigation/native';
import Page from '../../components/Page';
import {useStateValue} from '../../store/store';
import PhoneInput from 'react-native-phone-number-input';
import Icon from "react-native-vector-icons/MaterialIcons";

const services = new Service();

const Header = ({navigation}) => (
	<View style={[styles.headerContainer]}>
		<TouchableOpacity
			style={styles.backButton}
			onPress={() => navigation.goBack()}>
			<Image
				source={imageMapper.leftArrow.source}
				style={styles.backButtonIcon}
			/>
		</TouchableOpacity>
		<Typography variant="title3">Edit Profile</Typography>
	</View>
);

function ProfileView(props) {
	const {navigation, route} = props;
	const {params = {}} = route;
	const [state, dispatch] = useStateValue();
	const {user} = state;
	const {profile = {}, updateProfile} = params;
	const [credential, setCredential] = React.useState({});
	const [value, setValue] = React.useState('');
	const phoneInput = React.useRef(null);

	const handleChange = React.useCallback((key, value) => {
		setCredential((c) => {
			return {...c, [key]: value};
		});
	}, []);
	const handleSignup = React.useCallback(() => {
		console.log(credential);
		if (credential.UserName && credential.Email && credential.MobileNumber) {
			const data = {...credential, UserId: credential.CustomerId};
			dispatch({type: 'SET_LOADING', loading: true});
			services.post('UpdateProfile', data).then((res) => {
				dispatch({type: 'SET_LOADING', loading: false});
				console.log('res', res);
				if (`${res.status}` === '200') {
					updateProfile({...credential});
					Alert.alert('Success', res.res);
				} else {
					Alert.alert('Failure', res?.res || 'Failed to update');
				}
			});
		} else {
			Alert.alert('Validation Error', 'All fields are required');
		}
	}, [credential, dispatch, updateProfile]);

	React.useEffect(() => {
		if (profile) {
			setCredential({...profile});
		}
	}, [profile]);

	return (
		<ScrollablePageView
			navigation={navigation}
			header={<Header navigation={navigation} />}>
			<View
				style={[
					commonStyles.pageStyle,
					styles.container,
					commonStyles.largePageSize,
				]}>
				<Input
					style={styles.input}
					value={credential.UserName}
					disabled={true}
					placeholder="Enter your name"
					onChange={(value) => handleChange('UserName', value)}
				/>
				<Input
					style={styles.input}
					value={credential.Email}
					disabled={true}
					placeholder="Enter your email id"
					onChange={(value) => handleChange('Email', value)}
				/>
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
					textInputProps={{style: {color: '#fff', height: 40}, placeholderTextColor: 'gray', placeholder: 'Phone number'}}
					onChangeText={(text) => {
						setValue(text);
					}}
					onChangeFormattedText={(text) => {
						handleChange('MobileNumber', value);
					}}
					countryPickerProps={{
						theme: {backgroundColor: '#031B3B', onBackgroundTextColor: '#fff', filterPlaceholderTextColor: '#fff', primaryColorVariant: '#'}
					}}
				/>
				{/* <Input
					style={styles.input}
					value={credential.MobileNumber}
					placeholder="Phone number"
					onChange={(value) => handleChange('MobileNumber', value)}
				/> */}
				<Button
					style={styles.signupButton}
					title="Save"
					onPress={handleSignup}
				/>
			</View>
		</ScrollablePageView>
	);
}

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		flexDirection: 'column',
		paddingTop: '10%',
		paddingBottom: '5%',
		// height: '92%',
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
	headerContainer: {
		height: 'auto',
		position: 'relative',
		alignItems: 'center',
		paddingTop: 10,
		paddingBottom: 10,
		backgroundColor: '#000F24',
	},
});

export default ProfileView;
