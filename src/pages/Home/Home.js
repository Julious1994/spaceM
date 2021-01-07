import React from 'react';
import {
	SafeAreaView,
	StyleSheet,
	ScrollView,
	View,
	Text,
	StatusBar,
	Image,
	ImageBackground,
	TouchableOpacity,
	Dimensions,
	ActivityIndicator,
	Alert,
} from 'react-native';
import commonStyles from './../../commonStyles';
import Typography from './../../components/Typography';
import Input from './../../components/Input';
import Button from './../../components/Button';
import HorizontalList from './../../components/HorizontalList';
import ScrollablePageView from './../../components/ScrollablePageView';
import Tab from './../../components/Tab';
import Page from './../../components/Page';
import BottomBar from './../BottomBar';
import imageMapper from './../../images/imageMapper';
import {StackActions} from '@react-navigation/native';
import Slider from 'react-native-banner-carousel';
import {useStateValue} from '../../store/store';
import Service from '../../services/http';
import {getUri, isLandscape} from '../../utils';

const services = new Service();
const getBannerWidth = () => Dimensions.get('window').width;

const BannerHeight = 260;
const tabs = [
	{title: 'Home'},
	{title: 'Movies'},
	{title: 'Series'},
	{title: 'New'},
];

function Header(props) {
	return (
		<React.Fragment>
			<View style={styles.headerContainer}>
				<TouchableOpacity style={styles.menu} onPress={props.handleMenu}>
					<Image source={imageMapper.menu.source} style={styles.menuImage} />
				</TouchableOpacity>
				<Image source={imageMapper.spaceMLogo.source} style={styles.homeLogo} />
				<TouchableOpacity
					style={styles.bell}
					onPress={props.handleNotification}>
					<Image source={imageMapper.bell.source} style={styles.bellImage} />
				</TouchableOpacity>
			</View>
			<View style={[commonStyles.compactPageStyle, styles.tabContainer]}>
				{tabs.map((tab, i) => (
					<Tab
						key={i}
						title={tab.title}
						active={i === props.activeTab}
						onPress={() => props.handleTab(i)}
					/>
				))}
			</View>
		</React.Fragment>
	);
}

function Home(props) {
	const {navigation} = props;
	const [state, dispatch] = useStateValue();
	const [bannerList, setBannerList] = React.useState([]);
	const [upcomingList, setUpcomingList] = React.useState([]);
	const [top10List, setTop10List] = React.useState([]);
	const [releaseList, setReleaseList] = React.useState([]);
	const [orientation, setOrientation] = React.useState('portrait');
	const [bannerWidth, setBannerWidth] = React.useState(getBannerWidth());

	const [videoList, setVideoList] = React.useState([]);
	const data = [...Array(10).keys()];
	const banner = [...Array(4).keys()];
	const [activeTab, setActiveTab] = React.useState(0);
	const [loading, setLoading] = React.useState(false);
	const handleTab = React.useCallback((index) => {
		setActiveTab(index);
	}, []);

	const handleVideoClick = React.useCallback(
		(item) => {
			console.log('click');
			navigation.dispatch(
				StackActions.push('VideoDetail', {
					video: {...item},
				}),
			);
		},
		[navigation],
	);

	const handleContinueVideoClick = React.useCallback(
		(item) => {
			navigation.dispatch(
				StackActions.push('Video', {
					video: {...item},
				}),
			);
		},
		[navigation],
	);

	const fetchData = React.useCallback(async () => {
		// dispatch({type: 'SET_LOADING', loading: false});

		const categories = await services.get('DisplayCategoryList');
		const list = [];
		for (let i = 0; i < categories.length; i++) {
			const category = categories[i];
			const videos = await services.get(
				`DisplayVideoList?CategoryId=${category.CategoryId}`,
			);
			if (videos.length) {
				list.push({
					...category,
					videos,
				});
			}
		}
		setBannerList(list[0] ? list[0].videos : []);
		setVideoList([...list]);
	}, []);

	const fetchWatchList = React.useCallback(async () => {
		if (state.user) {
			const res = await services.get(
				`WatchListVideo?CustomerId=${state.user.CustomerId}`,
			);
			dispatch({type: 'SET_WATCHLIST', data: [...res]});

		}
	}, [state.user, dispatch]);

	const fetchContinuelist = React.useCallback(async () => {
		if (state.user) {
			const res = await services.get(
				`DisplayContiueWatchVideo?CustomerId=${state.user.CustomerId}`,
			);
			dispatch({type: 'SET_CONTINUE_WATCHING', data: [...res]});
		}
	}, [state.user, dispatch]);

	const handleMenu = React.useCallback(() => {
		dispatch({type: 'TOGGELE_DRAWER'});
	}, [dispatch]);

	const handleNotification = React.useCallback(() => {
		navigation.dispatch(StackActions.push('Notification'));
	}, [navigation]);

	const handleAddWatchList = React.useCallback(
		(videoDetails) => {
			if (state.user) {
				const watchListData = {
					VideoId: videoDetails.VideoId,
					CustomerId: state.user.CustomerId,
				};
				services.post('AddWatchList', watchListData).then((res) => {
					if (res.status === 200) {
						Alert.alert('Success', res.res);
						fetchWatchList();
					} else {
						Alert.alert('Server problem', res.res);
					}
				});
			}
		},
		[state.user, fetchWatchList],
	);

	const fetchUpcoming = React.useCallback(async () => {
		const res = await services.get('UpcomimgMovie');
		setUpcomingList([...res]);
	}, []);
	const fetchTopMovies = React.useCallback(async () => {
		const res = await services.get('Top10Movies');

		setTop10List([...res]);
	}, []);

	const fetchNewRelease = React.useCallback(async () => {
		const res = await services.get('NewReleaseMovie');
		setReleaseList([...res]);
	}, []);

	const fetchPurchasedList = React.useCallback(async () => {
		if (state.user) {
			services
				.post(`PurchaseVideoList?CustomerId=${state.user.CustomerId}`)
				.then((res) => {
					dispatch({type: 'SET_PURCHASED', data: [...res.res]});
				});
		}
	}, [dispatch, state.user]);

	React.useEffect(() => {
		async function fetch() {
			setLoading(true);
			await fetchData();
			await fetchWatchList();
			await fetchNewRelease();
			await fetchTopMovies();
			await fetchUpcoming();
			await fetchContinuelist();
			setLoading(false);
			fetchPurchasedList();
		}
		fetch();
	}, [
		fetchWatchList,
		fetchData,
		fetchTopMovies,
		fetchUpcoming,
		fetchNewRelease,
		fetchPurchasedList,
		fetchContinuelist,
	]);

	React.useEffect(() => {
		setOrientation(isLandscape() ? 'landscape' : 'portrait');
		setBannerWidth(getBannerWidth());
		let orientationEvent = Dimensions.addEventListener('change', () => {
			setOrientation(isLandscape() ? 'landscape' : 'portrait');
			setBannerWidth(getBannerWidth());
		});
		return () => {
			Dimensions.removeEventListener('change');
		};
	}, []);

	return (
		<ScrollablePageView
			navigation={navigation}
			header={
				<Header
					activeTab={activeTab}
					handleTab={handleTab}
					handleMenu={handleMenu}
					handleNotification={handleNotification}
				/>
			}
			bottomBar={<BottomBar active={0} navigation={navigation} />}>
			<View style={[commonStyles.pageStyle]}>
				<Slider
					autoplay
					autoplayTimeout={5000}
					loop
					index={0}
					pageSize={bannerWidth}>
					{bannerList.map((b, i) => (
						<ImageBackground key={i} source={getUri(b)} style={[styles.banner]}>
							<Typography variant="title1">{b.Title}</Typography>
							<Typography variant="description">{`Geners: ${b.Genre}`}</Typography>
							<View style={styles.bannerActionButton}>
								<TouchableOpacity
									style={styles.actionItem}
									onPressIn={() => handleVideoClick(b)}>
									<Image
										source={imageMapper.playButton.source}
										style={styles.playButtonImage}
										resizeMode="contain"
									/>
								</TouchableOpacity>
								<TouchableOpacity
									onPressIn={() => handleAddWatchList(b)}
									style={[styles.actionItem, styles.watchListIcon]}>
									<Image
										source={imageMapper.plusRound.source}
										style={styles.actionImage}
									/>
								</TouchableOpacity>
							</View>
						</ImageBackground>
					))}
				</Slider>

				<HorizontalList
					type="historic"
					data={state.continueWatchingList}
					title="Continue Watching"
					onPress={handleContinueVideoClick}
				/>

				<HorizontalList
					data={state.watchList}
					title="Watchlist"
					onPress={handleVideoClick}
				/>
				<HorizontalList
					data={bannerList}
					title="Trending Now"
					onPress={handleVideoClick}
				/>
				<HorizontalList
					data={releaseList}
					title="New Release"
					onPress={handleVideoClick}
				/>
				<HorizontalList
					data={upcomingList}
					title="Upcoming"
					onPress={handleVideoClick}
				/>
				<HorizontalList
					data={top10List}
					title="Top 10 on SpaceM"
					onPress={handleVideoClick}
				/>
				{videoList.map((videoView, i) => (
					<HorizontalList
						key={i}
						data={videoView.videos}
						title={`${videoView.CategoryName} Movies`}
						onPress={handleVideoClick}
					/>
				))}
				{/* <Image
					resizeMode="contain"
					source={imageMapper.featureMoview.source}
					style={styles.featureMovieView}
				/> */}
				{/* <HorizontalList
					data={data}
					title="Romance Movies"
					onPress={handleVideoClick}
				/> */}
				{loading && (
					<ActivityIndicator
						color="#159AEA"
						style={commonStyles.loader}
						size="large"
					/>
				)}
			</View>
		</ScrollablePageView>
	);
}

const styles = StyleSheet.create({
	headerContainer: {
		alignItems: 'center',
		paddingTop: 20,
		paddingBottom: 20,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	homeLogo: {
		width: 86,
		height: 23,
		marginTop: 6,
	},
	tabContainer: {
		display: 'flex',
		flexDirection: 'row',
	},
	banner: {
		height: 200,
		// width: '100%',
		marginTop: 24,
		marginLeft: '3%',
		marginRight: '3%',
		paddingTop: 88,
		paddingLeft: 20,
	},
	actionImage: {
		width: 24,
		height: 24,
		marginBottom: 6,
		backgroundColor: 'rgba(255, 255, 255, 0.1)',
		tintColor: '#fff',
	},
	actionItem: {},
	playButtonImage: {
		width: 70,
		height: 32,
	},
	bannerActionButton: {
		display: 'flex',
		flexDirection: 'row',
		marginTop: 22,
	},
	watchListIcon: {
		marginLeft: 12,
	},
	featureMovieView: {
		height: 360,
		width: '100%',
	},
	menu: {
		paddingLeft: 15,
		// backgroundColor: 'red',
		paddingTop: 6,
		paddingRight: 5,
	},
	menuImage: {
		width: 18,
		height: 14,
	},
	bell: {
		paddingRight: 15,
		marginTop: -3,
		paddingTop: 6,
		// backgroundColor: 'red',
		paddingLeft: 5,
	},
	bellImage: {
		width: 16,
		height: 18,
	},
});

export default Home;
