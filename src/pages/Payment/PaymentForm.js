import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, Alert} from 'react-native';
import Typography from '../../components/Typography';
import Button from '../../components/Button';
import ScrollablePageView from '../../components/ScrollablePageView';
import commonStyles from '../../commonStyles';
import imageMapper from '../../images/imageMapper';
import StatusView from './StatusView';
import {StackActions} from '@react-navigation/native';
import Popup from './PopupOption';
import {getUri} from '../../utils';
import {useStateValue} from '../../store/store';
import RazorpayCheckout from 'react-native-razorpay';
import Service from '../../services/http';

const services = new Service();

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
		{/* <Typography variant="title3">Confirm Purchase</Typography> */}
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
	const [state, dispatch] = useStateValue();

	const [status, setStatus] = React.useState();
	const [showCoupen, setShowCoupen] = React.useState(false);
	const [order, setOrder] = React.useState();

	const handleShowCoupen = React.useCallback((value) => {
		// setEmail(value);
	}, []);

	const handlePaypalPayment = React.useCallback(() => {
		// if (email) {
		// setStatus('success');
		// } else {
		// }
		// navigation.dispatch(StackActions.push('PaymentView'));
		navigation.dispatch(StackActions.push('PaymentView', {video, gateway: 'Paypal'}));
	}, []);

	const handlePayuPayment = React.useCallback(() => {
		// if (email) {
		// setStatus('success');
		// } else {
		// }
		navigation.dispatch(StackActions.push('PaymentView', {video, gateway: 'PayuMoney'}));
	}, [video]);

	const handleRazorpayPayment = React.useCallback(() => {
		console.log(video, state.user);
		if(order && order.id) {

			var options = {
				description: 'Payment for movie',
				image: `https://spacem.in${video.ThumbnailPath}`,
				currency: 'USD',
				key: 'rzp_live_JepCOgRVwybZVi',
				amount: video.Amount,
				name: video.Title,
				order_id: order.id,//Replace this with an order_id created using Orders API. Learn more at https://razorpay.com/docs/api/orders.
				prefill: {
				  email: state.user.Email,
				  contact: state.user.MobileNumber,
				  name: state.user.UserName,
				},
				theme: {backdrop_color: '#031B3B'}
			  }
			  RazorpayCheckout.open(options).then(async(data) => {
				// handle success
				console.log(`Success: ${data.razorpay_payment_id}`);
				// insert data here
				const _data = {
					CustomerId: state.user.CustomerId,
					VideoId: video.VideoId,
					TransactionId: data.razorpay_payment_id,
					// Bank: 'SBI',
				};
				services.post('PurchaseVideo', _data).then((res) => {
					console.log('res', res);
					setStatus('success');
				});
			  }).catch((error) => {
				// handle failure
				setStatus('failure');
				console.log(`Error: ${error.code} | ${error.description}`);
			  });
		}
	}, [order, video, state.user]);

	const handleChangePlan = React.useCallback(() => {
		navigation.dispatch(StackActions.replace('Plan'));
	}, [navigation]);

	const handleHome = React.useCallback(() => {
		navigation.dispatch(StackActions.popToTop());
	}, [navigation]);

	

	React.useEffect(() => {
		dispatch({type: 'SET_LOADING', loading: true});
		// const headers = {'Content-Type': 'application/json',};
		// const url = 'https://api.razorpay.com/v1/orders';
		const data = {
			amount: video.Amount,
			currency: 'USD',
		}
		//https://spacem.in/api/MobileRazor/
		services.post('RazorPayMobile', data, {joiner: '/MobileRazor'}).then(res => {
			console.log('res', res);
			dispatch({type: 'SET_LOADING', loading: false});
			if(res.status === 200) {
				setOrder(res.res.Attributes);
			} else {
				Alert.alert('Network error', JSON.stringify(res));
			}
			// setOrder(res);
		});
	}, [video]);

	React.useEffect(() => {
		handleRazorpayPayment();
	}, [handleRazorpayPayment]);

	// if (status) {
	// 	return (
	// 		<StatusView
	// 			status={status}
	// 			onClose={() => setStatus()}
	// 			onHome={handleHome}
	// 		/>
	// 	);
	// }

	return (
		<ScrollablePageView
			scrollable={false}
			header={<Header navigation={navigation} />}
			bottomBar={
				<React.Fragment>
					{/* <Button
						style={styles.resetButton}
						title="PAY with Paypal"
						onPress={handlePaypalPayment}
					/>
					<Button
						style={styles.resetButton}
						title="PAY with PayU"
						onPress={handlePayuPayment}
					/> */}
					{/* <Button
						style={styles.resetButton}
						title="Pay Now"
						onPress={handleRazorpayPayment}
					/> */}
				</React.Fragment>
			}>
			<View style={styles.paymentView}>
				{
					status && 
					<StatusView
						status={status}
						onClose={() => {
							setStatus();
							handleRazorpayPayment();
						}}
						onHome={handleHome}
					/>
				}
				{/* <Popup open={showCoupen} onClose={() => setShowCoupen(false)} /> */}
				{/* <View style={[commonStyles.pageStyle, styles.container]}>
					<View style={styles.row}>
						<Typography variant="body" style={{fontWeight: 'normal'}}>
							Movies list
						</Typography>
						<TouchableOpacity onPress={handleChangePlan}>
							<Typography variant="body" style={{color: '#159AEA'}}>
								Change Plan
							</Typography>
						</TouchableOpacity>
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
							<Typography variant="body" style={{fontWeight: '100'}}>
								Watch on 4 screens
							</Typography>
						</View>
						<View style={styles.priceView}>
							<Typography variant="title2">{`₹ ${video.Amount}`}</Typography>
							<Typography variant="title3" style={styles.priceMonth}>
								/m
							</Typography> 
						</View>
					</View>
					<TouchableOpacity onPress={() => setShowCoupen(true)} style={styles.coupenView}>
						<Typography variant="body" style={{color: '#159AEA'}}>
							Use Coupen
						</Typography>
					</TouchableOpacity>
					<View style={styles.separator} />
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
					</TouchableOpacity>
				</View> */}
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
		marginBottom: 20,
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
	paymentView: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
	}
});

export default PaymentForm;
