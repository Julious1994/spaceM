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
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradiant from 'react-native-linear-gradient';
import faqList from './faq';
import Accordion from '../../components/Accordion';

function Header(props) {
	const {navigation} = props;
	return (
		<View style={styles.headerContainer}>
			<TouchableOpacity
				style={styles.backButton}
				onPress={() => navigation.goBack()}>
				<Image
					source={imageMapper.leftArrow.source}
					style={styles.backButtonIcon}
				/>
			</TouchableOpacity>
			<Typography variant="title3" style={styles.headerTitle}>
				FAQ & Support
			</Typography>
			<TouchableOpacity style={styles.notes} onPress={props.handleTicketList}>
				<Icon name="notes" color="#fff" size={24} />
			</TouchableOpacity>
		</View>
	);
}

const BuyButton = ({onPress, isPaid, amount}) => {
	return (
		<LinearGradiant
			style={styles.buyButtonContainer}
			colors={[
				'rgba(1, 20, 46, 0)',
				'rgba(1, 20, 46, 0.74)',
				'rgba(1, 20, 46, 0.9)',
			]}>
			<Typography variant="description" style={styles.sendMessageDescription}>
				Still stuck? Help is a mail away
			</Typography>
			<Button title={'Send Message'} onPress={onPress} />
		</LinearGradiant>
	);
};

function SupportView(props) {
	const {navigation, route} = props;
	const {params = {}} = route;
	// const {ticket} = params;

	const handleTicketForm = React.useCallback(() => {
		navigation.dispatch(StackActions.push('TicketForm'));
	}, [navigation]);

	const handleTicketList = React.useCallback(() => {
		navigation.dispatch(StackActions.push('TicketList'));
	}, [navigation]);

	return (
		<ScrollablePageView
			header={
				<Header navigation={navigation} handleTicketList={handleTicketList} />
			}
			bottomBar={<BuyButton onPress={handleTicketForm} />}>
			<View style={[commonStyles.pageStyle, styles.container]}>
				<View style={styles.pageContent}>
					<Typography variant="title2">
						We’re here to help you with anthing on SpaceM
					</Typography>
					<Typography variant="description">
						At SpaceM everything we expact at a day’s start is you, better and
						happier than yersterday. we have got you covered. share your concern
						or check our frequently asked questions listed below.
					</Typography>
				</View>
				{faqList.map((faq, i) => (
					<Accordion key={i} label={faq.title} content={faq.description} />
				))}
			</View>
		</ScrollablePageView>
	);
}

const styles = StyleSheet.create({
	container: {
		marginBottom: 86,
	},
	headerContainer: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		// backgroundColor: 'red',
	},
	backButton: {
		// position: 'absolute',
		// left: 10,
		// top: 10,
		padding: 15,
	},
	backButtonIcon: {
		width: 10,
		height: 16,
	},
	ticketIcon: {
		width: 10,
		height: 16,
	},
	notes: {
		paddingRight: 10,
		paddingTop: 10,
	},
	headerTitle: {
		marginTop: 5,
	},
	buyButtonContainer: {
		height: 100,
		display: 'flex',
		justifyContent: 'center',
		position: 'absolute',
		width: '100%',
		bottom: 0,
		paddingLeft: '3%',
		paddingRight: '3%',
	},
	sendMessageDescription: {
		alignSelf: 'center',
		padding: 10,
	},
	pageContent: {
		padding: 10,
		paddingLeft: 15,
		paddingRight: 25,
	},
});

export default SupportView;
