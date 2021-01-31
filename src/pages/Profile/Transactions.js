import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import Typography from './../../components/Typography';
import ScrollablePageView from './../../components/ScrollablePageView';
import Input from './../../components/Input';
import Button from './../../components/Button';
import commonStyles from './../../commonStyles';
import imageMapper from './../../images/imageMapper';
import LinearGradiant from 'react-native-linear-gradient';
import Service from '../../services/http';
import {useStateValue} from '../../store/store';
import moment from 'moment';

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
		<Typography variant="title3">Transactions</Typography>
	</View>
);

const getUri = (item, i) => {
	return item.ThumbnailPath
		? {uri: `https://spacem.in/${item.ThumbnailPath}`}
		: imageMapper.landscapeMovie.source;
};

function Transactions(props) {
	const [list, setList] = React.useState([]);
	const [state, dispatch] = useStateValue();

	const handleEmail = React.useCallback((value) => {
		// setEmail(value);
	}, []);

	useEffect(() => {
		services
			.post(`PurchaseVideoList?CustomerId=${state.user.CustomerId}`)
			.then((res) => {
				console.log('list', res);
				setList([...res.res]);
			});
	}, [state.user]);
	return (
		<ScrollablePageView
			navigation={props.navigation}
			header={<Header navigation={props.navigation} />}>
			<View
				style={[
					commonStyles.pageStyle,
					styles.container,
					commonStyles.compactPageStyle,
				]}>
				{/* <LinearGradiant
					start={{x: 0, y: 0}}
					end={{x: 1, y: 0}}
					style={styles.currentPlanContainer}
					colors={['#041D3E', '#22497D']}>
					<Typography variant="body" style={styles.currentPlanText}>
						Current Plan
					</Typography>
					<View style={styles.priceView}>
						<Typography variant="title1">$6.99</Typography>
						<Typography variant="body" style={styles.priceMonth}>
							/m
						</Typography>
					</View>
					<Typography variant="title3">Family Plan</Typography>
					<Typography variant="description" style={styles.expiredText}>
						Expired on 24-11-2020
					</Typography>
				</LinearGradiant> */}
				<View>
					{list.map((item, i) => (
						<View key={i} style={styles.planContainer}>
							{/* <View style={styles.planImageView}>
									<Image
										source={imageMapper.crown.source}
										style={styles.planImage}
									/>
								</View> */}
							<Image source={getUri(item)} style={styles.movieImage} />
							<View style={styles.planInfo}>
								<Typography variant="body" style={styles.planName}>
									{item.Title}
								</Typography>
								<Typography variant="tiny1">
									{moment(item.PurchasedDate).format('DD MMM, hh:mm A')}
								</Typography>
							</View>
							<View style={styles.priceView}>
								<Typography variant="title3">${item.Amount}</Typography>
							</View>
						</View>
					))}
					{/* <View style={styles.planContainer}>
						<View style={styles.planImageView}>
							<Image
								source={imageMapper.crown.source}
								style={styles.planImage}
							/>
						</View>
						<Image
							source={imageMapper.landscapeMovie_2.source}
							style={styles.movieImage}
						/>
						<View style={styles.planInfo}>
							<Typography variant="body" style={styles.planName}>
								Hush
							</Typography>
							<Typography variant="tiny1">24 Sep, 05:09 PM</Typography>
						</View>
						<View style={styles.priceView}>
							<Typography variant="title3">$8.99</Typography>
							<Typography variant="body" style={styles.planType}>
								/m
							</Typography>
						</View>
					</View> */}
				</View>
			</View>
		</ScrollablePageView>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingTop: 10,
	},
	imageLogo: {
		width: 64,
		height: 64,
		alignSelf: 'center',
	},
	priceView: {
		display: 'flex',
		flexDirection: 'row',
		marginTop: 15,
	},
	planName: {
		color: '#fff',
		fontWeight: 'normal',
	},
	planContainer: {
		display: 'flex',
		flexDirection: 'row',
		marginBottom: 20,
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
		paddingLeft: 20,
		display: 'flex',
		justifyContent: 'space-around',
		// paddingTop: 3,
		paddingBottom: 4,
	},
	planType: {
		paddingLeft: 4,
		marginTop: 5,
		color: '#fff',
		fontWeight: 'normal',
	},
	priceMonth: {
		color: '#fff',
		lineHeight: 30,
		marginLeft: 2,
		opacity: 0.9,
	},
	currentPlanText: {
		fontWeight: '100',
		marginBottom: 5,
	},
	expiredText: {
		opacity: 0.7,
		alignSelf: 'flex-end',
	},
	currentPlanContainer: {
		borderRadius: 10,
		paddingTop: 25,
		paddingBottom: 25,
		paddingLeft: 20,
		paddingRight: 20,
		marginBottom: 20,
	},
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
	movieImage: {
		width: 110,
		height: 70,
	},
});

export default Transactions;
