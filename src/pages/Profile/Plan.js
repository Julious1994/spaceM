import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import Typography from './../../components/Typography';
import Input from './../../components/Input';
import Button from './../../components/Button';
import commonStyles from './../../commonStyles';
import imageMapper from './../../images/imageMapper';
import LinearGradiant from 'react-native-linear-gradient';

function Plan(props) {
	const [email, setEmail] = React.useState({});

	const handleEmail = React.useCallback((value) => {
		setEmail(value);
	}, []);

	const handlePrivacy = React.useCallback(() => {
	}, []);

	const handleResetPassword = React.useCallback(() => {
		if (email) {
			console.log('login');
		} else {
		}
	}, [email]);

	return (
		<View
			style={[
				commonStyles.pageStyle,
				styles.container,
			]}>
			{/* <LinearGradiant
				start={{x: 0, y: 0}}
				end={{x: 0.35, y: 0}}
				styles={{
					borderRadius: '10px',
					padding: 10,
				}}
				colors={['#1C4071', '#062B5E', '#000F24']}>
				<View styles={{transform: [{rotate: '180deg'}], borderRadius: 10}}>
					<Text>$6.99 /m</Text>
				</View>
			</LinearGradiant> */}
			<View style={{marginBottom: 15,}}>
				<View style={[styles.pageTitleInfo, commonStyles.largePageSize]}>
					<Typography variant="title3" style={[styles.titleText]}>
						Watch latest movies & TV shows online or stream right now.
					</Typography>
					<Typography variant="body" style={[styles.titleText, styles.commitMentText]}>
						No commitment. Cancel anytime
					</Typography>
				</View>
				<View style={styles.planContainer}>
					<View style={styles.planInfo}>
						<Typography variant="body" style={styles.planName}>
							Premium Plan
						</Typography>
						<Typography variant="description" style={styles.watchInfo}>Watch on 2 screens</Typography>
					</View>
					<View style={styles.priceView}>
						<Typography variant="title3">$6.99</Typography>
						<Typography variant="body" style={styles.planType}>
							/m
						</Typography>
					</View>
				</View>
				<View style={styles.planContainer}>
					<View style={styles.planInfo}>
						<Typography variant="body" style={styles.planName}>
							Premium Plan
						</Typography>
						<Typography variant="description" style={styles.watchInfo}>Watch on 2 screens</Typography>
					</View>
					<View style={styles.priceView}>
						<Typography variant="title3">$6.99</Typography>
						<Typography variant="body" style={styles.planType}>
							/m
						</Typography>
					</View>
				</View>
				<View style={styles.planContainer}>
					<View style={styles.planInfo}>
						<Typography variant="body" style={styles.planName}>
							Premium Plan
						</Typography>
						<Typography variant="description" style={styles.watchInfo}>Watch on 2 screens</Typography>
					</View>
					<View style={styles.priceView}>
						<Typography variant="title3">$6.99</Typography>
						<Typography variant="body" style={styles.planType}>
							/m
						</Typography>
					</View>
				</View>
				<Typography variant="description" style={styles.renewText}>Plan automatically renews monthly</Typography>
				{/* <Button title="Try it Now" /> */}
			</View>
			<TouchableOpacity style={styles.privacyContainer} onPress={handlePrivacy}>
				<Typography style={styles.privacyText} variant="description">Privacy & Terms</Typography>
			</TouchableOpacity>
		</View>
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
	priceView: {
		display: 'flex',
		flexDirection: 'row',
		marginTop: 5,
	},
	planName: {
		color: '#fff',
		fontWeight: 'normal',
		marginBottom: 3,
	},
	planContainer: {
		display: 'flex',
		flexDirection: 'row',
		marginBottom: 20,
		backgroundColor: '#041D3E',
		padding: 18,
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
		display: 'flex',
		justifyContent: 'space-between',
		paddingTop: 3,
		paddingBottom: 4,
	},
	planType: {
		paddingLeft: 4,
		marginTop: 5,
		color: '#fff',
		fontWeight: 'normal',
	},
	watchInfo: {
		opacity: 0.5,
	},
	pageTitleInfo: {
		alignSelf: 'center',
	},
	commitMentText: {
		fontWeight: '100',
		marginBottom: 20,
	},
	titleText: {
		textAlign: 'center',
		lineHeight: 24,
	},
	renewText: {
		textAlign: 'center',
		opacity: 0.5,
	},
	privacyContainer: {
		alignSelf: 'center',
		position: 'absolute',
		bottom: 15,
		// borderBottomColor: ''
	},
	privacyText: {
		color: '#666F7B',
		textDecorationLine: 'underline',
	},
});

export default Plan;
