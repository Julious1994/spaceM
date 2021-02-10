import React from 'react';
import {StyleSheet} from 'react-native';
import {StackActions} from '@react-navigation/native';
import {WebView} from 'react-native-webview';
import Service from '../../services/http';
import {useStateValue} from '../../store/store';
import StatusView from './StatusView';

const services = new Service();

function PaymentView(props) {
	const {navigation, route} = props;
	const [state, dispatch] = useStateValue();
	const {params = {}} = route;
	const {video, gateway} = params;
	const [status, setStatus] = React.useState();

	function handlePaymentSubmit(event) {
		console.log(event);
		if (event.nativeEvent.data) {
            console.log('jjjjjj', event.nativeEvent.data);
            const paymentData = event.nativeEvent.data.split('|');
			const data = {
				CustomerId: state.user.CustomerId,
				VideoId: video.VideoId,
				TransactionId: gateway === 'Paypal' ? event.nativeEvent.data : paymentData[16],
				PaymentMethod: 'Net',
				// Bank: 'SBI',
			};
			services.post('PurchaseVideo', data).then((res) => {
				console.log('res', res);
				setStatus('success');
			});
		} else {
			setStatus('fail');
		}
	}

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
	//spacem.techymau.games/Mobile/Paypal
	return (
		<WebView
			style={styles.webview}
			onMessage={(event) => handlePaymentSubmit(event)}
			onNavigationStateChange={(e) => console.log(e)}
			source={{
				uri: `https://spacem.in/Mobile/${gateway}`,
				method: 'POST',
				body: `customerId=${state.user.CustomerId}&amount=${video.Amount}&mobileNumber=${state.user.MobileNumber || ''}&email=${state.user.Email}&UserName=${state.user.UserName}`,
			}}
		/>
	);
}

const styles = StyleSheet.create({
	webview: {
		flex: 1,
		// backgroundColor: 'red',
	},
});

export default PaymentView;
