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
// import Slider from 'react-native-banner-carousel';
import {useStateValue} from '../../store/store';
import Service from '../../services/http';

const services = new Service();

const BannerWidth = Dimensions.get('window').width;
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
				<TouchableOpacity style={styles.menu} onPress={() => {}}>
					<Image source={imageMapper.menu.source} style={styles.menuImage} />
				</TouchableOpacity>
				<Image source={imageMapper.spaceMLogo.source} style={styles.homeLogo} />
				<TouchableOpacity style={styles.bell} onPress={() => {}}>
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
	const [videoList, setVideoList] = React.useState([]);
	const data = [...Array(10).keys()];
	const banner = [...Array(4).keys()];
	const [activeTab, setActiveTab] = React.useState(0);
	const handleTab = React.useCallback((index) => {
		setActiveTab(index);
	}, []);

	const handleVideoClick = React.useCallback(
		(item) => {
			navigation.dispatch(StackActions.push('VideoDetail', {video: {...item}}));
		},
		[navigation],
	);

	React.useEffect(() => {
		// dispatch({type: 'SET_LOADING', loading: false});
		services.get('DisplayCategoryList').then(async (categories) => {
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
			setVideoList([...list]);
		});
	}, [dispatch]);
	return (
		<ScrollablePageView
			header={<Header activeTab={activeTab} handleTab={handleTab} />}
			bottomBar={<BottomBar active={0} navigation={navigation} />}>
			<View style={[commonStyles.pageStyle]}>
				{/* <Slider
					autoplay
					autoplayTimeout={5000}
					loop
					index={0}
					pageSize={BannerWidth}>
					{banner.map((b, i) => (
						<ImageBackground
							source={
								imageMapper[i % 2 === 0 ? 'moviePhoto2' : 'landscapeMovie']
									.source
							}
							style={[styles.banner]}>
							<Typography variant="title1">
								{i % 2 === 0 ? 'Intersteller' : 'Avengers'}
							</Typography>
							<Typography variant="description">
								Geners: Action, Thriller
							</Typography>
							<View style={styles.bannerActionButton}>
								<TouchableOpacity
									style={styles.actionItem}
									onPress={handleVideoClick}>
									<Image
										source={imageMapper.playButton.source}
										style={styles.playButtonImage}
										resizeMode="contain"
									/>
								</TouchableOpacity>
								<TouchableOpacity
									style={[styles.actionItem, styles.watchListIcon]}>
									<Image
										source={imageMapper.plusRound.source}
										style={styles.actionImage}
									/>
								</TouchableOpacity>
							</View>
						</ImageBackground>
					))}
				</Slider> */}
				<HorizontalList
					type="historic"
					data={data}
					title="Continue Watching"
					onPress={handleVideoClick}
				/>
				{videoList.map((videoView, i) => (
					<HorizontalList
						key={i}
						data={videoView.videos}
						title={videoView.CategoryName}
						onPress={handleVideoClick}
					/>
				))}
				{/* <HorizontalList data={data} title="Latest" onPress={handleVideoClick} />
				<HorizontalList
					data={data}
					title="Up comings"
					onPress={handleVideoClick}
				/> */}
				<Image
					resizeMode="contain"
					source={imageMapper.featureMoview.source}
					style={styles.featureMovieView}
				/>
				{/* <HorizontalList
					data={data}
					title="Romance Movies"
					onPress={handleVideoClick}
				/> */}
			</View>
		</ScrollablePageView>
	);
}

const styles = StyleSheet.create({
	headerContainer: {
		alignItems: 'center',
		paddingTop: 26,
		paddingBottom: 20,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	homeLogo: {
		width: 86,
		height: 23,
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
	},
	menuImage: {
		width: 18,
		height: 14,
	},
	bell: {
		paddingRight: 15,
		marginTop: -3,
	},
	bellImage: {
		width: 16,
		height: 18,
	},
});

export default Home;
