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
	ActivityIndicator,
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
import LoaderView from '../../components/Loader';
import Icon from 'react-native-vector-icons/MaterialIcons';

const services = new Service();
const ScreenWidth = Dimensions.get('window').width;
const videoImageLength = (ScreenWidth - 54) / 3;

console.log({ScreenWidth, videoImageLength});

const getUri = (item, i) => {
	return item.ThumbnailPath
		? {uri: `https://spacem.in/${item.PosterPath}`}
		: imageMapper.landscapeMovie.source;
};

function VideoDetail(props) {
	const {navigation, route} = props;
	const {params = {}} = route;
	const [state, dispatch] = useStateValue();
	const {user, watchList} = state;
	const {video: videoParamDetails = {}, videos: moreVideos = []} = params;
	const data = [...Array(15).keys()];
	const [activeTab, setActiveTab] = React.useState(0);
	const [inWatchList, setInWatchList] = React.useState(false);
	const [relatedLoading, setRelatedLoading] = React.useState(false);
	const [relatedList, setRelatedList] = React.useState([]);
	const [shareLoading, setShareLoading] = React.useState(false);
	const [loading, setLoading] = React.useState(true);
	const [videoDetails, setVideoDetails] = React.useState({});
	const moreVideoLength = React.useRef(videoImageLength);

	const handleTabClick = React.useCallback((i) => {
		setActiveTab(i);
	}, []);

	const fetchRelated = React.useCallback(() => {
		if (videoDetails.CategoryId) {
			setRelatedLoading(true);
			services
				.get(`DisplayVideoList?CategoryId=${videoDetails.CategoryId}`)
				.then((res) => {
					if (res && Array.isArray(res)) {
						setRelatedLoading(false);
						setRelatedList([...res]);
					}
				});
		}
	}, [videoDetails.CategoryId]);

	const handleVideoClick = React.useCallback(
		(item) => {
			navigation.dispatch(
				StackActions.replace('VideoDetail', {
					video: {...item},
				}),
			);
		},
		[navigation],
	);
	const handleBack = React.useCallback(() => {
		navigation.goBack();
	}, [navigation]);
	const BuyButton = ({onPress, isPaid, amount, expires}) => {
		let title = 'Play Now';
		if (`${isPaid}` === 'false' && Number(amount) > 0) {
			title = `Buy Movie $${amount}`;
		}
		const getTime = (seconds) => {
			if(seconds > 3600) {
				return `${(seconds/3600).toFixed(0)} hour`;
			} else if(seconds > 60) {
				return `${(seconds / 60).toFixed(0)} mins`;
			} else {
				return `${(seconds).toFixed(0)} sec`;
			}
		}
		return (
			<LinearGradiant
				style={styles.buyButtonContainer}
				colors={[
					'rgba(1, 20, 46, 0)',
					'rgba(1, 20, 46, 0.74)',
					'rgba(1, 20, 46, 0.9)',
				]}>
				<Button textStyle={{fontSize: 18}} title={title} onPress={onPress}>
					{expires?.TimeRemainingInSec && <Typography variant="description" style={styles.remainTimeStyle}>{`(expires in ${getTime(Number(expires?.TimeRemainingInSec || 0))})`}</Typography>}
				</Button>
			</LinearGradiant>
		);
	};

	const removeItem = React.useCallback(() => {
		const item = watchList.find((w) => w.VideoId === videoDetails.VideoId);
		if (item && item.WatchId) {
			services.post('RemoveWatchList', {Id: item.WatchId}).then((res) => {
				Alert.alert('Delete Watch item', res.res);
				if (res.status === 200) {
					dispatch({type: 'REMOVE_WATCHLIST', id: item.VideoId});
					setInWatchList(false);
				}
			});
		}
	}, [dispatch, videoDetails, watchList]);

	React.useEffect(() => {
		fetchRelated();
	}, [fetchRelated]);

	React.useEffect(() => {
		if (videoDetails.VideoId) {
			const index = watchList.findIndex(
				(w) => w.VideoId === videoDetails.VideoId,
			);
			if (index !== -1) {
				setInWatchList(true);
			}
		}
	}, [videoDetails, watchList]);

	const renderMoreView = () => {
		if (relatedLoading) {
			return (
				<ActivityIndicator
					size="large"
					color="#159AEA"
					style={commonStyles.loader}
				/>
			);
		}
		return (
			<View style={[styles.moreViewContainer]}>
				{relatedList.map(
					(v, i) =>
						v.VideoId !== videoDetails.VideoId && (
							<TouchableOpacity key={i} onPress={() => handleVideoClick(v)}>
								<Image
									source={{
										uri: `https://spacem.in/${v.ThumbnailPath}`,
									}}
									style={[styles.videoThumbnail, {width: moreVideoLength.current}]}
								/>
							</TouchableOpacity>
						),
				)}
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
					{videoDetails.Director && (
						<View style={styles.infoItemView}>
							<Typography variant="body" style={styles.infoTitle}>
								Starring
							</Typography>
							<Typography variant="description" style={styles.infoText}>
								{videoDetails.Actor}
							</Typography>
						</View>
					)}
					{videoDetails.Director && (
						<View style={styles.infoItemView}>
							<Typography variant="body" style={styles.infoTitle}>
								Directors
							</Typography>
							<Typography variant="description" style={styles.infoText}>
								{videoDetails.Director}
							</Typography>
						</View>
					)}
					{/* <View style={[styles.infoItemView]}>
						<Typography variant="body" style={styles.infoTitle}>
							Customer Reviews
						</Typography>
						<Typography variant="description" style={styles.infoText}>
							No customer review yet
						</Typography>
					</View> */}
				</View>
			</ScrollView>
		);
	};

	const playVideo = React.useCallback(() => {
		navigation.dispatch(StackActions.push('Video', {video: {...videoDetails}}));
	}, [navigation, videoDetails]);

	const handleBuy = React.useCallback(() => {
		if (!videoDetails.ExpireDetail?.IsValid && Number(videoDetails.Amount) > 0) {
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
		services.post('AddWatchList', watchListData).then(async (res) => {
			if (res.status === 200) {
				setInWatchList(true);
				const result = await services.get(
					`WatchListVideo?CustomerId=${state.user.CustomerId}`,
				);
				dispatch({type: 'SET_WATCHLIST', data: [...result]});
				Alert.alert('Success', res.res);
			} else {
				Alert.alert('Server problem', res.res);
			}
		});
	}, [videoDetails, user, dispatch, state.user]);

	const handleShare = React.useCallback(() => {
		const type = videoDetails.ThumbnailPath?.split('.')[1];
		setShareLoading(true);
		sharePDFWithAndroid(
			`https://spacem.in${videoDetails?.ThumbnailPath}`,
			`image/${type === 'jpg' ? 'jpeg' : type}`,
		).then((base64Data) => {
			setShareLoading(false);
			const options = {
				title: 'Share movie',
				message: `Please watch this movie
				Download app from here: ${'https://spacem.in'}`,
				url: base64Data,
				subject: 'share it',
			};
			// console.log(options);
			Share.open(options).then((res) => {
				console.log(res);
			});
		});
	}, [videoDetails]);

	React.useEffect(() => {
		Dimensions.addEventListener('change', () => {
			const ScreenWidth = Dimensions.get('window').width;
			const imageLength = (ScreenWidth - 54) / 3;
			moreVideoLength.current = imageLength;
		})
	}, []);

	React.useEffect(() => {
		setLoading(true);
		services.get(`DisplayVideoDetail?VideoId=${videoParamDetails.VideoId}&CustomerId=${state.user.CustomerId}`).then((res) => {
			console.log(res);
			setLoading(false);
			if (res && res.Body && res.VideoQualityList) {
				setVideoDetails({...res.Body[0], ExpireDetail: {...res.ExpireDetail}, VideoQualityList: [...res.VideoQualityList]});
			}
		});
	}, [videoParamDetails, state.user, videoParamDetails]);

	return (
		<React.Fragment>
			{shareLoading && <LoaderView />}
			<ScrollablePageView style={{marginBottom: 96}}>
				{
					loading ? 
					<ActivityIndicator size="large" color="#159AEA" style={commonStyles.loader} />
					:
				
				<React.Fragment>

					<ImageBackground
						style={styles.imgBackground}
						resizeMode="stretch"
						source={getUri(videoDetails)}>
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
							<Typography variant="tiny1">{videoDetails.Genre}</Typography>
							<View style={styles.dotSeparator} />
							<Typography variant="tiny1">
								{moment(videoDetails.LaunchDate).format('yyyy')}
							</Typography>
							<View style={styles.dotSeparator} />
							<Typography variant="tiny1">2h 49min</Typography>
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
							{inWatchList ? (
								<TouchableOpacity style={styles.actionItem} onPress={removeItem}>
									<View style={styles.closeView}>
										<Icon name="close" size={16} color="#fff" />
									</View>
									<Typography
										variant="tiny2"
										style={[
											styles.actionText,
											inWatchList && styles.activeWathcListText,
										]}>
										Watchlist
									</Typography>
								</TouchableOpacity>
							) : (
								<TouchableOpacity
									style={styles.actionItem}
									onPress={handleAddWatchList}>
									<Image
										source={imageMapper.plusRound.source}
										style={[
											styles.actionImage,
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
							)}
							{/* <TouchableOpacity style={styles.actionItem} onPress={handleRate}>
								<Image
									source={imageMapper.favourite.source}
									style={styles.actionImage}
								/>
								<Typography variant="tiny2" style={styles.actionText}>
									Rate
								</Typography>
							</TouchableOpacity> */}
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
				</React.Fragment>
				}
			</ScrollablePageView>
			{!loading && <BuyButton
				onPress={handleBuy}
				isPaid={videoDetails.ExpireDetail?.IsValid}
				expires={videoDetails.ExpireDetail}
				amount={videoDetails.Amount}
			/>}
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
		alignItems: 'center',
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
		// tintColor: '#159AEA',
	},
	activeWathcListText: {
		// color: '#159AEA',
		marginTop: 7,
	},
	closeView: {
		height: 32,
		width: 32,
		borderColor: '#666F7B',
		borderRadius: 32,
		borderWidth: 0.5,
		backgroundColor: 'rgba(255, 255, 255, 0.1)',
		display:'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	},
	remainTimeStyle: {
		marginTop: 8,
		marginLeft: 5,
		position: 'absolute',
		fontWeight: 'normal',
		color: '#666F7B',
	}
});

export default VideoDetail;
