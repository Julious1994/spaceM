import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import Typography from '../../components/Typography';
import Button from '../../components/Button';
import ScrollablePageView from '../../components/ScrollablePageView';
import commonStyles from '../../commonStyles';
import imageMapper from '../../images/imageMapper';
import StatusView from './StatusView';
import {StackActions} from '@react-navigation/native';
import Popup from './PopupOption';
import {getUri} from '../../utils';

const Header = ({navigation}) => (
	<View style={styles.headerContainer}>
		<TouchableOpacity
			style={styles.backButton}
			onPress={() => navigation.goBack()}>
			<Image
				source={imageMapper.leftArrow.source}
				style={styles.backButtonIcon}
			/>
		</TouchableOpacity>
		<Typography variant="title3">Confirm Purchase</Typography>
	</View>
);

const PaymentCard = ({onPress, payment}) => (
	<TouchableOpacity style={styles.paymentCardView}>
		<Image source={imageMapper.pencil.source} style={styles.edit} />
		<View>
			<Typography variant="tiny1">Payment</Typography>
			<Typography variant="title3">MasterCard ****6243</Typography>
		</View>
		<Image />
	</TouchableOpacity>
);

function PaymentForm(props) {
	const {navigation, route} = props;
	const {params = {}} = route;
	const {video} = params;
	const [status, setStatus] = React.useState();
	const [payment, setPayment] = React.useState('');
	const [showCoupen, setShowCoupen] = React.useState(false);
	const handleShowCoupen = React.useCallback((value) => {
		// setEmail(value);
	}, []);

	const handlePayment = React.useCallback(() => {
		// if (email) {
		setStatus('success');
		// } else {
		// }
	}, []);

	const handleChangePlan = React.useCallback(() => {
		navigation.dispatch(StackActions.replace('Plan'));
	}, [navigation]);

	const handleHome = React.useCallback(() => {
		navigation.dispatch(StackActions.popToTop());
	}, [navigation]);

	if (status) {
		return (
			<StatusView
				status={status}
				onClose={() => setStatus()}
				onHome={handleHome}
			/>
		);
	}

	return (
		<ScrollablePageView
			header={<Header navigation={navigation} />}
			bottomBar={
				<Button
					style={styles.resetButton}
					title="PAY NOW"
					onPress={handlePayment}
				/>
			}>
			<Popup open={showCoupen} onClose={() => setShowCoupen(false)} />
			<View style={[commonStyles.pageStyle, styles.container]}>
				<View style={styles.row}>
					<Typography variant="body" style={{fontWeight: 'normal'}}>
						Movies list
					</Typography>
					{/* <TouchableOpacity onPress={handleChangePlan}>
						<Typography variant="body" style={{color: '#159AEA'}}>
							Change Plan
						</Typography>
					</TouchableOpacity> */}
				</View>
				<View style={styles.planViewContainer}>
					<Image
						source={getUri(video)}
						style={styles.movieImage}
					/>
					<View style={{marginTop: 10}}>
						<Typography variant="description" lines={1}>
							{video.Title}
						</Typography>
						{/* <Typography variant="body" style={{fontWeight: '100'}}>
							Watch on 4 screens
						</Typography> */}
					</View>
					<View style={styles.priceView}>
						<Typography variant="title2">{`$${video.Amount}`}</Typography>
						{/* <Typography variant="title3" style={styles.priceMonth}>
							/m
						</Typography> */}
					</View>
				</View>
				{/* <TouchableOpacity onPress={() => setShowCoupen(true)} style={styles.coupenView}>
					<Typography variant="body" style={{color: '#159AEA'}}>
						Use Coupen
					</Typography>
				</TouchableOpacity> */}
				{/* <View style={styles.separator} />
				<View>
					<Typography style={styles.myCardText} variant="body">
						My Card
					</Typography>
					<View>
						<PaymentCard />
					</View>
				</View>
				<TouchableOpacity style={styles.addNewCardContainer}>
					<Image source={imageMapper.plus.source} style={styles.plusImage} />
					<Typography variant="body" style={styles.addNewCard}>
						Add new card
					</Typography>
				</TouchableOpacity> */}
			</View>
		</ScrollablePageView>
	);
}

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		marginLeft: '5%',
		marginRight: '5%',
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
	resetButton: {
		marginBottom: 25,
		marginLeft: '5%',
		marginRight: '5%',
	},
	headerContainer: {
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
	row: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	planViewContainer: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		backgroundColor: '#041D3E',
		borderRadius: 5,
		marginTop: 20,
		// padding: 25,
	},
	priceView: {
		display: 'flex',
		flexDirection: 'row',
		marginTop: 23,
		marginRight: 15,
	},
	priceMonth: {
		lineHeight: 24,
		marginLeft: 2,
		opacity: 0.5,
	},
	coupenView: {
		marginTop: 15,
	},
	separator: {
		borderBottomColor: 'rgba(102, 111, 123, 0.5)',
		borderBottomWidth: 1,
		marginTop: 20,
		marginBottom: 10,
	},
	addNewCardContainer: {
		display: 'flex',
		flexDirection: 'row',
		alignSelf: 'flex-end',
		marginTop: 10,
		paddingTop: 5,
	},
	plusImage: {
		height: 12,
		width: 12,
		marginTop: 3,
	},
	addNewCard: {
		color: '#159AEA',
		marginLeft: 5,
		fontWeight: '100',
	},
	myCardText: {
		fontWeight: '100',
		marginTop: 10,
		marginBottom: 10,
	},
	paymentCardView: {
		backgroundColor: '#041D3E',
		borderRadius: 5,
		padding: 25,
	},
	edit: {
		position: 'absolute',
		width: 12,
		height: 12,
		right: 10,
		top: 10,
	},
	movieImage: {
		width: 110,
		height: 75,
	},
});

export default PaymentForm;
