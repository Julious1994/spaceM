import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import commonStyles from '../../commonStyles';
import Typography from '../../components/Typography';
import imageMapper from '../../images/imageMapper';
import {StackActions} from '@react-navigation/native';

function ProfileView({active}) {
	return (
		<View style={[styles.profileImageView]}>
			<Image
				style={[styles.profileImage, active && styles.activeProfileImage]}
				resizeMode="cover"
				source={imageMapper.moviePhoto2.source}
			/>
		</View>
	);
}

function MenuItem(props) {
	const Component = props.component;
	return (
		<TouchableOpacity style={[styles.menuItem]} onPress={props.onPress}>
			{props.image && (
				<Image
					source={imageMapper[props.image].source}
					style={[styles.menuImage, props.active && styles.activeMenu]}
					resizeMode="contain"
				/>
			)}
			{props.component && <Component active={props.active} />}
			<Typography variant="tiny2" style={[styles.menuTitle, props.active && styles.activeTitle]}>
				{props.title}
			</Typography>
		</TouchableOpacity>
	);
}

const menus = [
	{title: 'Home', page: 'Home', image: 'home'},
	{title: 'Search', page: 'SearchView', image: 'search'},
	{title: 'WatchList', page: 'WatchList', image: 'watchListMenu'},
	{title: 'Profile', page: 'Profile', Component: ProfileView},
];

function BottomBar(props) {
	const {navigation} = props;
	const handleRedirect = React.useCallback(
		(page) => {
			navigation.dispatch(StackActions.push(page));
		},
		[navigation],
	);

	return (
		<View style={styles.container}>
			{menus.map((menu, i) => (
				<MenuItem
					key={i}
					image={menu.image}
					component={menu.Component}
					active={props.active === i}
					title={menu.title}
					onPress={() => handleRedirect(menu.page)}
				/>
			))}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		backgroundColor: '#01142E',

		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 12,
		},
		shadowOpacity: 0.58,
		shadowRadius: 16.0,

		elevation: 24,
	},
	menuImage: {
		width: 24,
		height: 24,
		tintColor: 'rgba(255, 255, 255, 0.3)',
	},
	menuTitle: {
		fontSize: 9,
		marginTop: 5,
	},
	menuItem: {
		flex: 1,
		alignItems: 'center',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		paddingTop: 5,
		paddingBottom: 5,
	},
	profileImageView: {
		alignSelf: 'center',
	},
	profileImage: {
		borderRadius: 76,
		width: 24,
		height: 24,
		borderColor: 'rgba(255, 255, 255, 0.3)',
		borderWidth: 1,
	},
	activeProfileImage: {
		borderColor: '#159AEA',
	},
	activeMenu: {
		tintColor: '#159AEA',
	},
	activeTitle: {
		color: '#159AEA',
		opacity: 0.5,
	},
});

export default BottomBar;
