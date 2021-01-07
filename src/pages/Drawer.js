import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import Typography from './../components/Typography';
import Input from './../components/Input';
import Button from './../components/Button';
import commonStyles from './../commonStyles';
import imageMapper from './../images/imageMapper';
import {StackActions} from '@react-navigation/native';
import Service from '../services/http';
import Page from '../components/Page';
import {useStateValue} from '../store/store';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {logout} from './Profile/Logout';

function Drawer(props) {
	const {dispatch, navigation} = props;

	const handleClose = React.useCallback(() => {
		dispatch({type: 'TOGGELE_DRAWER'});
	}, [dispatch]);

	const handleLogout = React.useCallback(() => {
		handleClose();
		logout(navigation);
	}, [navigation, handleClose]);

	const handleBooks = React.useCallback(() => {
		handleClose();
		navigation.dispatch(StackActions.push('WatchList'));
	}, [navigation, handleClose]);

	return (
		<View style={styles.container}>
			<TouchableOpacity
				style={styles.layer}
				activeOpacity={0.5}
				onPress={handleClose}
			/>
			<View style={styles.contentView}>
				<Image source={imageMapper.logoIcon.source} style={styles.logo} />
				<TouchableOpacity style={styles.menuItem} onPress={handleBooks}>
					<Icon
						name="turned-in-not"
						size={24}
						color="rgba(255, 255, 255, 0.35)"
					/>
					<Typography variant="body" style={styles.menuText}>
						My Watchlist
					</Typography>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.menuItem, styles.noBorder]}
					onPress={handleLogout}>
					<Icon
						name="exit-to-app"
						size={24}
						color="rgba(255, 255, 255, 0.35)"
					/>
					<Typography variant="body" style={styles.menuText}>
						Logout
					</Typography>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		zIndex: 1001,
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
	},
	layer: {
		backgroundColor: 'rgba(0,0,0,0.5)',
		position: 'absolute',
		opacity: 0.5,
		width: '100%',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
	},
	contentView: {
		width: '70%',
		height: '100%',
		backgroundColor: '#01142E',
	},
	logo: {
		width: 75,
		height: 75,
		alignSelf: 'center',
		marginTop: 15,
		marginBottom: 15,
	},
	menuItem: {
		display: 'flex',
		flexDirection: 'row',
		padding: 10,
		borderBottomColor: '#142C4B',
		borderBottomWidth: 0.5,
	},
	menuText: {
		color: 'rgba(255, 255, 255, 0.35);',
		flex: 1,
		paddingLeft: 20,
		marginTop: 2,
	},
	noBorder: {
		borderBottomWidth: 0,
	},
});

export default Drawer;
