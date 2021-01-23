import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import Typography from '../components/Typography';
import Button from '../components/Button';
import ScrollablePageView from '../components/ScrollablePageView';
import commonStyles from '../commonStyles';
import imageMapper from '../images/imageMapper';
import Service from '../services/http';
import {useStateValue} from '../store/store';
import moment from "moment";
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
		<Typography variant="title3">Notification</Typography>
	</View>
);

function Notification(props) {
	const {navigation} = props;
	const [state, dispatch] = useStateValue();

	React.useEffect(() => {
		const hasUnread = state.notificationList.findIndex(n => n.IsRead === false) !== -1;
		if (state.user.CustomerId && hasUnread) {
			services
				.get(`NotificationStatusChange?CustomerId=${state.user.CustomerId}`)
				.then((res) => {
					console.log('notification list status', res);
					const data = state.notificationList.map(n => {
						return {...n, IsRead: true}
					});
					dispatch({type: 'SET_NOTIFICATION', data: [...data]});
				});
		}
	}, [state.user, state.notificationList]);

	const notificationList = state.notificationList;
	console.log(state);
	return (
		<ScrollablePageView header={<Header navigation={navigation} />}>
			{notificationList.length <= 0 && <Typography
				variant="body"
				style={{
					fontWeight: 'normal',
					alignSelf: 'center',
					marginTop: 15,
					letterSpacing: 0.5,
				}}>
				No notifications currently
			</Typography>}
			{notificationList.map((notification, i) => (
				<View style={[styles.messageContainer]}>
					<Typography variant="description">{notification.Message}</Typography>
					<Typography variant="tiny2" style={styles.timeView}>
						{moment(notification.CreatedDate).format('DD/MM hh:mm')}
					</Typography>
				</View>
			))}
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
	messageContainer: {
		// minWidth: '10%',
		// maxWidth: '70%',
		padding: 10,
		backgroundColor: '#031B3B',
		margin: 15,
		marginTop: 3,
		marginBottom: 3,
		borderRadius: 3,
		// alignSelf: 'flex-end',
	},
	timeView: {
		alignSelf: 'flex-end',
		marginTop: 5,
	}
});

export default Notification;
