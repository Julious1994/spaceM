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
import Tab from './../../components/Tab';
import {ScrollView} from 'react-native-gesture-handler';

const services = new Service();

const status = {
	0: 'Pending',
	1: 'Closed',
};

const Header = ({navigation}) => (
	<View style={[commonStyles.pageStyle, styles.headerContainer]}>
		<TouchableOpacity
			style={styles.backButton}
			onPress={() => navigation.goBack()}>
			<Image
				source={imageMapper.leftArrow.source}
				style={styles.backButtonIcon}
			/>
		</TouchableOpacity>
		<Typography variant="title3">Tickets</Typography>
	</View>
);

function TicketList(props) {
	const {navigation} = props;
	const [state, dispatch] = useStateValue();
	const [activeTab, setActiveTab] = React.useState(0);
	const [list, setList] = React.useState([]);
	const [loading, setLoading] = React.useState(false);
	const [filteredList, setFilteredList] = React.useState([]);

	const cancelTicket = React.useCallback(
		(ticket) => {
			const options = {joiner: '/AdminApi'};
			const data = {
				CustomerId: state.user.CustomerId,
				TicketId: ticket.TicketId,
			};
			services.post('CancelTicket', data, options).then((res) => {
				console.log(res);
				if (res.status === 200) {
					setList((lst) => {
						const index = lst.findIndex((l) => l.TicketId === ticket.TicketId);
						lst.splice(index);
						return [...lst];
					});
				}
			});
		},
		[state.user],
	);

	const handleCancel = React.useCallback(
		(ticket) => {
			Alert.alert('Confirmation', 'Are you sure, do you want to cancel?', [
				{text: 'No'},
				{text: 'Yes', onPress: () => cancelTicket(ticket)},
			]);
		},
		[cancelTicket],
	);

	const fetchList = React.useCallback(() => {
		setLoading(true);
		setFilteredList([]);
		services
			.get(`DisplayTciketByUserID?CustomerId=${state.user.CustomerId}`, {
				joiner: '/AdminApi',
			})
			.then((res) => {
				console.log(res);
				setList([...res]);
				const lst = res.filter((i) => i.Status === status[activeTab]);
				setFilteredList([...lst]);
				setLoading(false);
			});
	}, [activeTab, state.user]);

	const handleTab = React.useCallback((i) => {
		setActiveTab(i);
	}, []);

	const handleTicketView = React.useCallback(
		(ticket) => {
			navigation.dispatch(StackActions.push('TicketView', {ticket}));
		},
		[navigation],
	);

	React.useEffect(() => {
		fetchList();
	}, [fetchList]);
	console.log(filteredList);
	return (
		<ScrollablePageView
			scrollable={false}
			header={<Header navigation={navigation} />}>
			<View style={[commonStyles.pageStyle]}>
				<View style={[commonStyles.compactPageStyle, styles.tabContainer]}>
					{Object.keys(status).map((tabKey, i) => (
						<Tab
							key={i}
							title={status[tabKey]}
							active={i === activeTab}
							onPress={() => handleTab(i)}
						/>
					))}
				</View>
				{loading && (
					<ActivityIndicator
						size="large"
						color="#159AEA"
						style={commonStyles.loader}
					/>
				)}
				<ScrollView>
					{filteredList.map((ticket, i) => (
						<TouchableOpacity
							key={i}
							style={styles.planContainer}
							onPress={() => handleTicketView(ticket)}>
							<View style={styles.planInfo}>
								<Typography lines={1} variant="body" style={styles.planName}>
									{ticket.Title}
								</Typography>
								<Typography
									lines={1}
									variant="description"
									style={styles.watchInfo}>
									{ticket.Message}
								</Typography>
							</View>
							<View style={styles.priceView}>
								{ticket.UnreadMessageCount > 0 && (
									<Typography variant="body" style={styles.planType}>
										{ticket.UnreadMessageCount}
									</Typography>
								)}
								{/* <TouchableOpacity
									style={styles.cancelView}
									onPress={() => handleCancel(ticket)}>
									<Typography variant="title3">Cancel</Typography>
								</TouchableOpacity> */}
							</View>
						</TouchableOpacity>
					))}
				</ScrollView>
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
		padding: 10,
		paddingTop: 3,
		paddingBottom: 3,
		borderRadius: 50,
		marginTop: 5,
		color: '#fff',
		fontSize: 10,
		fontWeight: 'bold',
		backgroundColor: '#000F24',
	},
	watchInfo: {
		opacity: 0.5,
	},
	cancelView: {
		marginLeft: 7,
	},
	tabContainer: {
		display: 'flex',
		flexDirection: 'row',
		marginBottom: 16,
	},
});

export default TicketList;
