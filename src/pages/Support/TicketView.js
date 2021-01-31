import React from 'react';
import {
	View,
	Text,
	StyleSheet,
	Image,
	TouchableOpacity,
	Alert,
	ActivityIndicator,
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
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import axios from 'axios';

const services = new Service();

const Header = ({navigation, title, handleCloseTicket}) => (
	<View style={[commonStyles.pageStyle, styles.headerContainer]}>
		<TouchableOpacity
			style={styles.backButton}
			onPress={() => navigation.goBack()}>
			<Image
				source={imageMapper.leftArrow.source}
				style={styles.backButtonIcon}
			/>
		</TouchableOpacity>
		<Typography variant="title3">{title}</Typography>
		<TouchableOpacity
			onPress={handleCloseTicket}
			style={styles.closeTicketView}>
			<Typography variant="title3">Close</Typography>
		</TouchableOpacity>
	</View>
);

const isDisabled = (message) => {
	return (
		['', undefined, null].includes(message.Message) &&
		['', undefined, null].includes(message.ImagePath)
	);
};

function TicketView(props) {
	const {navigation, route} = props;
	const [state, dispatch] = useStateValue();
	const {params = {}} = route;
	const {ticket} = params;
	const [loading, setLoading] = React.useState(false);
	const [ticketDetails, setTicketDetails] = React.useState();
	const [message, setMessage] = React.useState({
		CustomerId: state.user.CustomerId,
		TicketId: ticket.TicketId,
		UserType: 'Customer',
	});

	const closeTicket = React.useCallback(() => {
		const options = {joiner: '/AdminApi'};
		const data = {
			CustomerId: state.user.CustomerId,
			TicketId: ticket.TicketId,
		};
		services.post('CloseTicket', data, options).then((res) => {
			console.log(res);
		});
	}, [state.user, ticket]);

	const handleCloseTicket = React.useCallback(() => {
		Alert.alert('Confirmation', 'Are you sure, do you want to close?', [
			{text: 'No'},
			{text: 'Yes', onPress: () => closeTicket()},
		]);
	}, [closeTicket]);

	const fetchTicket = React.useCallback(async () => {
		setLoading(true);
		console.log(ticket);
		const joiner = '/AdminApi';
		services
			.get(`DisplayTciketDetailbyId?TicketId=${ticket.TicketId}`, {joiner})
			.then(async (res) => {
				await services.post(
					`CustomerReadMessage?TicketId=${ticket.TicketId}`,
					null,
					{
						joiner,
					},
				);
				setTicketDetails({
					...ticket,
					messages: [...res],
				});

				setLoading(false);
			});
	}, [ticket]);

	const sendMessage = React.useCallback(() => {
		//SendMessageByCustomer
		// joiner: '/AdminApi',
		const formData = new FormData();
		Object.keys(message).forEach((key) => {
			formData.append(key, message[key]);
		});
		axios
			.post(
				'https://spacem.in/api/AdminApi/SendMessageByCustomer',
				formData,
				{headers: {}},
			)
			.then((res) => {
				console.log(res);
				if (res.status === 200) {
					clearMessage();
					setTicketDetails((detail) => {
						return {
							...detail,
							messages: [...detail.messages, {...message}],
						};
					});
				}
			});
	}, [message, clearMessage]);

	const clearMessage = React.useCallback(() => {
		setMessage((msg) => {
			return {...msg, Message: '', ImagePath: null};
		});
	}, []);

	const handleChange = React.useCallback((key, value) => {
		setMessage((msg) => {
			return {...msg, [key]: value};
		});
	}, []);

	React.useEffect(() => {
		//AdminApi/DisplayTciketDetailbyId?TicketId=1
		fetchTicket();
	}, [fetchTicket]);

	const MessageView = ({msg}) => {
		return (
			<View
				style={[
					styles.messageContainer,
					msg.UserType === 'Admin' && styles.adminContainer,
				]}>
				<Typography variant="description">{msg.Message}</Typography>
				<Typography
					variant="tiny2"
					style={{
						alignSelf: msg.UserType === 'Admin' ? 'flex-start' : 'flex-end',
					}}>
					{moment(msg.ReplyDateTime).format('DD/MM hh:mm')}
				</Typography>
			</View>
		);
	};
	console.log(ticketDetails);
	return (
		<ScrollablePageView
			header={
				<Header
					navigation={navigation}
					handleCloseTicket={handleCloseTicket}
					title={ticketDetails?.Title || ''}
				/>
			}
			bottomBar={
				<View style={styles.chatView}>
					<Input
						value={message.Message}
						style={styles.chatInput}
						multiline={true}
						placeholder="type here..."
						onChange={(value) => handleChange('Message', value)}
					/>
					<TouchableOpacity
						style={styles.sendView}
						onPress={sendMessage}
						disabled={isDisabled(message)}>
						<Icon
							name="send"
							color={isDisabled(message) ? '#919191' : '#fff'}
							size={24}
						/>
					</TouchableOpacity>
				</View>
			}>
			<View style={[commonStyles.pageStyle]}>
				{loading && (
					<ActivityIndicator
						size="large"
						color="#159AEA"
						style={commonStyles.loader}
					/>
				)}
				{!loading && ticketDetails && (
					<View>
						<View style={[styles.ticketInfo, styles.messageContainer]}>
							{/* {ticketDetails.ImagePath && <Image
								source={{
									uri: `https://spacem.in/${ticketDetails.ImagePath}`,
								}}
								style={{width: 100, height: 100}}
							/>} */}
							<Typography variant="description">
								{ticketDetails.Message}
							</Typography>
							<Typography
								variant="tiny2"
								style={{
									alignSelf: 'flex-end',
								}}>
								{moment(ticketDetails.CreatedDate).format('DD/MM hh:mm')}
							</Typography>
						</View>
						<View style={styles.ticketChatView}>
							{ticketDetails.messages.map((msg, i) => (
								<MessageView key={i} msg={msg} />
							))}
						</View>
					</View>
				)}
			</View>
		</ScrollablePageView>
	);
}

const styles = StyleSheet.create({
	container: {},
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
	closeTicketView: {
		position: 'absolute',
		right: 10,
		top: 10,
		padding: 10,
		paddingTop: 0,
	},
	messageContainer: {
		minWidth: '10%',
		maxWidth: '70%',
		padding: 10,
		backgroundColor: '#031B3B',
		margin: 15,
		marginTop: 7,
		marginBottom: 7,
		borderRadius: 3,
		alignSelf: 'flex-end',
	},
	adminContainer: {
		alignSelf: 'flex-start',
		backgroundColor: '#01142E',
	},
	chatView: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		margin: 5,
	},
	chatInput: {
		flex: 1,
	},
	sendView: {
		padding: 8,
		paddingTop: 16,
		// backgroundColor: 'red'
	}
});

export default TicketView;
