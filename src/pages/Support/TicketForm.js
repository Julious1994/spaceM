import React from 'react';
import {
	View,
	Text,
	StyleSheet,
	Image,
	TouchableOpacity,
	Alert,
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
import {Picker} from '@react-native-picker/picker';
import axios from 'axios';

const services = new Service();

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
		<Typography variant="title3">New Ticket</Typography>
	</View>
);

function TicketForm(props) {
	const {navigation} = props;
	const [state, dispatch] = useStateValue();

	const [ticketForm, setTicketForm] = React.useState({TicketType: 'Complaint'});

	const handleChange = React.useCallback((key, value) => {
		setTicketForm((t) => {
			return {...t, [key]: value};
		});
	}, []);

	const handleSave = React.useCallback(() => {
		if (ticketForm.Title && ticketForm.Message) {
			const data = {
				...ticketForm,
				CustomerId: state.user.CustomerId,
			};
			const headers = {
				'Content-Type': 'application/x-www-form-urlencoded',
			};
			const formData = new URLSearchParams();
			formData.append('Title', ticketForm.Title);
			formData.append('Message', ticketForm.Message);
			formData.append('TicketType', ticketForm.TicketType);
			formData.append('CustomerId', data.CustomerId);

			console.log(data);
			axios
				.post(
					'http://spacem.techymau.games/api/AdminApi/CreateTicket',
					formData,
					{headers: {}},
				)
				.then((res) => {
					console.log(res);
					if (res.status === 200) {
						navigation.dispatch(
							StackActions.replace('TicketView', {ticket: {...res.data}}),
						);
					}
				});
			// services
			// 	.post('CreateTicket', formData, {
			// 		joiner: '/AdminApi',
			// 		headers,
			// 		formData: true,
			// 	})
			// 	.then((res) => {
			// 		console.log(res);
			// 		if (res.success) {
			// 			navigation.dispatch(
			// 				StackActions.replace('TicketView', {ticket: {}}),
			// 			);
			// 		} else {
			// 			Alert.alert('Failure', res?.res);
			// 		}
			// 	});
		} else {
			Alert.alert('Validation', 'Title & description required');
		}
	}, [ticketForm, state.user, navigation]);

	return (
		<ScrollablePageView header={<Header navigation={navigation} />}>
			<View style={[commonStyles.pageStyle, commonStyles.compactPageStyle]}>
				<View style={[styles.input, styles.pickerView]}>
					<Picker
						mode="dropdown"
						dropdownIconColor="#666F7B"
						selectedValue={ticketForm.TicketType}
						style={[styles.picker]}
						onValueChange={(itemValue, itemIndex) =>
							handleChange('TicketType', itemValue)
						}>
						<Picker.Item label="Complaint" value="Complaint" />
						<Picker.Item label="Support" value="Support" />
					</Picker>
				</View>
				<Input
					style={styles.input}
					value={ticketForm.Title}
					placeholder="Title"
					onChange={(value) => handleChange('Title', value)}
				/>
				<Input
					style={styles.input}
					value={ticketForm.Message}
					placeholder="Message"
					multiline={true}
					lines={3}
					onChange={(value) => handleChange('Message', value)}
				/>
				<Button
					title="Create Ticket"
					style={styles.saveButton}
					onPress={handleSave}
				/>
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
	input: {
		marginTop: 10,
		marginBottom: 10,
	},
	picker: {
		height: 60,
		width: '100%',
		color: '#fff',
		// backgroundColor: '#031B3B',
	},
	pickerView: {
		borderRadius: 5,
		backgroundColor: '#031B3B',
		// borderWidth: 1,
	},
	saveButton: {
		marginTop: 20,
	},
});

export default TicketForm;
