import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, Alert} from 'react-native';
import Typography from './../../components/Typography';
import Input from './../../components/Input';
import Button from './../../components/Button';
import commonStyles from './../../commonStyles';
import imageMapper from './../../images/imageMapper';
import LinearGradient from 'react-native-linear-gradient';
import {StackActions} from '@react-navigation/native';
import BottomBar from '../BottomBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useStateValue} from '../../store/store';
import Service from '../../services/http';

const services = new Service();

function Profile(props) {
	const {navigation} = props;
	const [state, dispatch] = useStateValue();
	const [profile, setProfile] = React.useState({});

	const handleTransactions = React.useCallback(() => {
		navigation.dispatch(StackActions.push('Transactions'));
	}, [navigation]);

	const handleProfile = React.useCallback(() => {
		navigation.dispatch(StackActions.push('ProfileView', {profile}));
	}, [navigation, profile]);

	const handlePlan = React.useCallback(() => {
		navigation.dispatch(StackActions.push('Plan'));
	}, [navigation]);

	const handleLogout = React.useCallback(() => {
		AsyncStorage.removeItem('user').then(() => {
			dispatch({type: 'SET_USER', user: undefined});
			navigation.dispatch(StackActions.replace('Login'));
		});
	}, [navigation, dispatch]);

	useEffect(() => {
		const data = {
			UserId: state.user.CustomerId,
		};
		services.post('GetUserDetailByID', data).then((res) => {
			console.log('user data', res);
			if (res.status === 200) {
				setProfile({...res.res});
			} else {
				Alert.alert('Network error', 'Try again later');
			}
		});
	}, [state.user]);
	console.log(profile);
	return (
		<View>
			<View
				style={[
					commonStyles.pageStyle,
					styles.container,
					commonStyles.compactPageStyle,
				]}>
				<View style={styles.profileImageView}>
					<Image
						style={styles.profileImage}
						resizeMode="cover"
						source={imageMapper.moviePhoto2.source}
					/>
				</View>
				<Typography variant="title3" style={styles.profileName}>
					{profile.UserName}
				</Typography>
				{/* <TouchableOpacity style={[styles.container, props.style]} onPress={handlePlan}>
				<LinearGradient
					start={{x: 0, y: 0}}
					end={{x: 0.55, y: 0}}
					colors={['#041D3E', '#22497D']}
					style={styles.premiumView}>
					<View style={styles.premiumContainer}>
						<View style={styles.premiumSide}>
							<Image
								source={imageMapper.crown.source}
								style={styles.crownStyle}
							/>
						</View>

						<View>
							<Typography variant="body" style={styles.premiumVideoText}>
								To watch Premium Videos
							</Typography>
							<Typography variant="title3">Go Premium</Typography>
						</View>
						<View style={styles.premiumSide}>
							<Image
								source={imageMapper.rightArrow.source}
								style={styles.rightArrowPremium}
							/>
						</View>
					</View>
				</LinearGradient>
			</TouchableOpacity> */}
				<TouchableOpacity style={styles.menuItemView} onPress={handleProfile}>
					<Typography variant="body">Edit Profile</Typography>
					<Image
						source={imageMapper.rightArrow.source}
						style={styles.rightArrow}
					/>
				</TouchableOpacity>
				<TouchableOpacity style={styles.menuItemView}>
					<Typography variant="body">Change Password</Typography>
					<Image
						source={imageMapper.rightArrow.source}
						style={styles.rightArrow}
					/>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.menuItemView}
					onPress={handleTransactions}>
					<Typography variant="body">Transactions</Typography>
					<Image
						source={imageMapper.rightArrow.source}
						style={styles.rightArrow}
					/>
				</TouchableOpacity>
				<TouchableOpacity style={styles.menuItemView}>
					<Typography variant="body">FAQ & Support</Typography>
					<Image
						source={imageMapper.rightArrow.source}
						style={styles.rightArrow}
					/>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.menuItemView, styles.noBottomBorder]}
					onPress={handleLogout}>
					<Typography variant="body">Sign out</Typography>
					<Image
						source={imageMapper.rightArrow.source}
						style={styles.rightArrow}
					/>
				</TouchableOpacity>
			</View>
			<View style={styles.bottomBar}>
				<BottomBar active={3} navigation={navigation} />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
	},
	profileImageView: {
		alignSelf: 'center',
	},
	profileImage: {
		borderRadius: 76,
		width: 76,
		height: 76,
		borderColor: '#159AEA',
		borderWidth: 1,
	},
	profileName: {
		alignSelf: 'center',
		marginTop: 15,
		marginBottom: 15,
	},
	rightArrow: {
		width: 7,
		height: 12,
		tintColor: '#666F7B',
	},
	menuItemView: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		borderBottomColor: '#666F7B',
		borderBottomWidth: 0.5,
		paddingTop: 20,
		paddingBottom: 20,
		paddingRight: 2,
		paddingLeft: 2,
	},
	noBottomBorder: {
		borderBottomWidth: 0,
	},
	crownStyle: {
		width: 27,
		height: 27,
	},
	rightArrowPremium: {
		width: 9,
		height: 16,
	},
	premiumContainer: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-around',
		padding: 10,
	},
	premiumView: {
		borderRadius: 5,
	},
	premiumVideoText: {
		fontWeight: 'normal',
	},
	premiumSide: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
	},
	bottomBar: {
		position: 'absolute',
		bottom: 0,
		width: '100%',
	},
});

export default Profile;
