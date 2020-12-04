import React from 'react';
import {
	View,
	Text,
	FlatList,
	StyleSheet,
	Image,
	TouchableOpacity,
	ScrollView,
	ImageBackground,
	Dimensions,
	Alert,
} from 'react-native';
import LinearGradiant from 'react-native-linear-gradient';
import ScrollablePageView from '../../components/ScrollablePageView';
import Typography from '../../components/Typography';
import commonStyles from '../../commonStyles';
import imageMapper from '../../images/imageMapper';
import Button from '../../components/Button';
import Tab from '../../components/Tab';
import {StackActions} from '@react-navigation/native';
import Service from '../../services/http';
import Page from '../../components/Page';
import {useStateValue} from '../../store/store';
import moment from 'moment';
import {sharePDFWithAndroid} from '../../utils';
import Share from 'react-native-share';

const services = new Service();
const ScreenWidth = Dimensions.get('window').width;
const moreVideoLength = (ScreenWidth - 54) / 3;

const getUri = (item, i) => {
	return item.SubTitlePath
		? {uri: `http://spacem.techymau.games/${item.SubTitlePath}`}
		: imageMapper.landscapeMovie.source;
};

function VideoDetail(props) {
	const {navigation, route} = props;
	const {params = {}} = route;
	const [state, dispatch] = useStateValue();
	const {user} = state;
	const {video: videoDetails = {}} = params;
	const data = [...Array(15).keys()];
	const [activeTab, setActiveTab] = React.useState(0);
	const [inWatchList, setInWatchList] = React.useState(false);

	const handleTabClick = React.useCallback((i) => {
		setActiveTab(i);
	}, []);

	const handleVideoClick = React.useCallback((video) => {}, []);
	const handleBack = React.useCallback(() => {
		navigation.goBack();
	}, [navigation]);
	const BuyButton = ({onPress, isPaid, amount}) => {
		let title = 'Play Now';
		if (isPaid === 'Paid') {
			title = `Buy Movie $${amount}`;
		}
		return (
			<LinearGradiant
				style={styles.buyButtonContainer}
				colors={[
					'rgba(1, 20, 46, 0)',
					'rgba(1, 20, 46, 0.74)',
					'rgba(1, 20, 46, 0.9)',
				]}>
				<Button title={title} onPress={onPress} />
			</LinearGradiant>
		);
	};

	const renderMoreView = () => {
		return (
			<View style={[styles.moreViewContainer]}>
				{data.map((v, i) => (
					<TouchableOpacity key={i} onPress={() => handleVideoClick(v)}>
						<Image
							source={
								imageMapper[i % 2 === 0 ? 'moviePhoto' : 'moviePhoto_2'].source
							}
							style={[styles.videoThumbnail, {width: moreVideoLength}]}
						/>
					</TouchableOpacity>
				))}
			</View>
		);
	};

	const renderInfoView = () => {
		return (
			<ScrollView>
				<View style={styles.infoViewContainer}>
					<View style={styles.infoItemView}>
						<Typography variant="body" style={styles.infoTitle}>
							Studio
						</Typography>
						<Typography variant="description" style={styles.infoText}>
							{videoDetails.MovieStudio}
						</Typography>
					</View>
					<View style={styles.infoItemView}>
						<Typography variant="body" style={styles.infoTitle}>
							Directors
						</Typography>
						<Typography variant="description" style={styles.infoText}>
							Christopher Nolan
						</Typography>
					</View>
					<View style={[styles.infoItemView]}>
						<Typography variant="body" style={styles.infoTitle}>
							Maturity Rating
						</Typography>
						<Typography variant="description" style={styles.infoText}>
							13+
						</Typography>
					</View>
					<View style={[styles.infoItemView]}>
						<Typography variant="body" style={styles.infoTitle}>
							Content Advisory
						</Typography>
						<Typography variant="description" style={styles.infoText}>
							Off beat, sci-fi
						</Typography>
					</View>
					<View style={[styles.infoItemView]}>
						<Typography variant="body" style={styles.infoTitle}>
							Customer Reviews
						</Typography>
						<Typography variant="description" style={styles.infoText}>
							No customer review yet
						</Typography>
					</View>
					<View style={[styles.infoItemView, styles.noBottomBorder]}>
						<Typography variant="body" style={styles.infoTitle}>
							Did you know?
						</Typography>
						<Typography variant="description" style={styles.infoText}>
							Todd Phillips helms a gritty origin story starring Joaquin Phoenix
							and Robert De Niro that centers around the iconic arch nemesis in
							an original, standalone story not seen before on screen. Phillips'
							exploration of Arthur Fleck, a man disregarded by society, is not
							only a harsh character study, but also a broader cautionary tale.
						</Typography>
					</View>
				</View>
			</ScrollView>
		);
	};

	const playVideo = React.useCallback(() => {
		navigation.dispatch(StackActions.push('Video', {video: {...videoDetails}}));
	}, [navigation, videoDetails]);

	const handleBuy = React.useCallback(() => {
		if (videoDetails.IsPaid === 'Paid') {
			navigation.dispatch(
				StackActions.push('PaymentForm', {video: {...videoDetails}}),
			);
		} else {
			playVideo();
		}
	}, [navigation, playVideo, videoDetails]);

	const handleAddWatchList = React.useCallback(() => {
		const watchListData = {
			VideoId: videoDetails.VideoId,
			CustomerId: user.CustomerId,
		};
		services.post('AddWatchList', watchListData).then((res) => {
			if (res.status === 200) {
				setInWatchList(true);
				Alert.alert('Success', res.res);
			} else {
				Alert.alert('Server problem', res.res);
			}
		});
	}, [videoDetails, user]);

	const handleShare = React.useCallback(() => {
		const type = videoDetails.SubTitlePath.split('.')[1];
		sharePDFWithAndroid(
			`http://spacem.techymau.games${videoDetails.SubTitlePath}`,
			`image/${type === 'jpg' ? 'jpeg' : type}`,
		).then((base64Data) => {
			console.log(base64Data, videoDetails.SubTitlePath);
			const options = {
				title: 'Share movie',
				message: `Please watch this movie
				Download app from here: ${'http://spacem.techymau.games'}`,
				url: base64Data,
				subject: 'share it',
			};
			// console.log(options);
			Share.open(options).then((res) => {
				console.log(res);
			});
		});
	}, [videoDetails]);

	const handleRate = React.useCallback(() => {

	}, []);

	return (
		<React.Fragment>
			<ScrollablePageView style={{marginBottom: 96}}>
				<ImageBackground
					style={styles.imgBackground}
					resizeMode="stretch"
					source={imageMapper.moviePhoto2.source}>
					<TouchableOpacity style={styles.backButton} onPress={handleBack}>
						<Image
							source={imageMapper.leftArrow.source}
							style={styles.backButtonIcon}
						/>
					</TouchableOpacity>
					<TouchableOpacity onPress={playVideo}>
						<Image
							source={imageMapper.roundPlay.source}
							style={styles.roundPlay}
						/>
					</TouchableOpacity>
				</ImageBackground>
				<View style={[commonStyles.compactPageStyle]}>
					<Typography variant="title1">{videoDetails.Title}</Typography>
					<View style={styles.movieSmallInfo}>
						<Typography variant="tiny1">IMDb 8.6</Typography>
						<View style={styles.dotSeparator} />
						<Typography variant="tiny1">Drama, Sci-fi</Typography>
						<View style={styles.dotSeparator} />
						<Typography variant="tiny1">
							{moment(videoDetails.LaunchDate).format('yyyy')}
						</Typography>
						<View style={styles.dotSeparator} />
						<Typography variant="tiny1">2h 49min</Typography>
						<View style={styles.ageView}>
							<Typography variant="tiny1">18+</Typography>
						</View>
					</View>
					<Typography variant="description">
						{videoDetails.Description ||
							`Todd Phillips helms a gritty origin story starring Joaquin Phoenix
							and Robert De Niro that centers around the iconic arch nemesis in an
							original, standalone story not seen before on screen. Phillips'
							exploration of Arthur Fleck, a man disregarded by society, is not
							only a harsh character study, but also a broader cautionary tale.`}
					</Typography>
					<View style={styles.actionView}>
						<TouchableOpacity
							style={styles.actionItem}
							onPress={handleAddWatchList}>
							<Image
								source={imageMapper.plusRound.source}
								style={[
									styles.actionImage,
									inWatchList && styles.activeWathcListImage,
								]}
							/>
							<Typography
								variant="tiny2"
								style={[
									styles.actionText,
									inWatchList && styles.activeWathcListText,
								]}>
								Watchlist
							</Typography>
						</TouchableOpacity>
						<TouchableOpacity style={styles.actionItem} onPress={handleRate}>
							<Image
								source={imageMapper.favourite.source}
								style={styles.actionImage}
							/>
							<Typography variant="tiny2" style={styles.actionText}>
								Rate
							</Typography>
						</TouchableOpacity>
						<TouchableOpacity style={styles.actionItem} onPress={handleShare}>
							<Image
								source={imageMapper.share.source}
								style={styles.actionImage}
							/>
							<Typography variant="tiny2" style={styles.actionText}>
								Share
							</Typography>
						</TouchableOpacity>
					</View>
				</View>
				<View style={styles.tabContainer}>
					<Tab
						title="MORE LIKE THIS"
						active={activeTab === 0}
						onPress={() => handleTabClick(0)}
					/>
					<Tab
						title="MORE DETAILS"
						active={activeTab === 1}
						onPress={() => handleTabClick(1)}
					/>
				</View>
				{activeTab === 0 && renderMoreView()}
				{activeTab === 1 && renderInfoView()}
			</ScrollablePageView>
			<BuyButton
				onPress={handleBuy}
				isPaid={videoDetails.IsPaid}
				amount={videoDetails.Amount}
			/>
		</React.Fragment>
	);
}

const styles = StyleSheet.create({
	tabContainer: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		borderBottomColor: '#666F7B',
		borderBottomWidth: 0.5,
	},
	videoThumbnail: {
		height: 140,
		width: 102,
		marginTop: 10,
		marginLeft: 4,
		marginRight: 4,
	},
	moreViewContainer: {
		// backgroundColor: 'red',
		display: 'flex',
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginLeft: 15,
		marginRight: 15,
		// justifyContent: 'space-around',
	},
	infoViewContainer: {
		paddingLeft: '3%',
		paddingRight: '3%',
	},
	imgBackground: {
		width: '100%',
		height: 200,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 20,
	},
	roundPlay: {
		width: 64,
		height: 64,
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
	movieSmallInfo: {
		display: 'flex',
		flexDirection: 'row',
		marginTop: 10,
		marginBottom: 10,
	},
	dotSeparator: {
		width: 4,
		height: 4,
		backgroundColor: '#666F7B',
		borderRadius: 1,
		marginLeft: 12,
		marginRight: 12,
		marginTop: 5,
		transform: [{rotate: '45deg'}],
	},
	actionView: {
		display: 'flex',
		flexDirection: 'row',
		marginTop: 7,
	},
	actionItem: {
		padding: 12,
	},
	actionImage: {
		width: 32,
		height: 32,
		marginBottom: 6,
	},
	actionText: {
		alignSelf: 'center',
	},
	infoItemView: {
		borderBottomWidth: 0.5,
		borderBottomColor: 'rgba(102, 111, 123, 0.5)',
		paddingTop: 15,
		paddingBottom: 15,
	},
	infoText: {
		opacity: 0.5,
	},
	infoTitle: {
		color: '#fff',
	},
	noBottomBorder: {
		borderBottomWidth: 0,
	},
	buyButtonContainer: {
		height: 96,
		display: 'flex',
		justifyContent: 'center',
		position: 'absolute',
		width: '100%',
		bottom: 0,
		paddingLeft: '3%',
		paddingRight: '3%',
	},
	ageView: {
		marginLeft: 10,
		borderColor: '#666F7B',
		borderWidth: 0.5,
		padding: 0.5,
		borderRadius: 3,
		paddingLeft: 7,
		paddingRight: 7,
	},
	activeWathcListImage: {
		tintColor: '#159AEA',
	},
	activeWathcListText: {
		color: '#159AEA',
	},
});

export default VideoDetail;
