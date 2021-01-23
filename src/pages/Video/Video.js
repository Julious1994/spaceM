import React, {useEffect} from 'react';
import {
	View,
	Text,
	StyleSheet,
	Image,
	TouchableOpacity,
	ActivityIndicator,
	Dimensions,
	StatusBar,
} from 'react-native';
import Video from 'react-native-video';
import imageMapper from '../../images/imageMapper';
import {TextTrackType} from 'react-native-video';
import Service from '../../services/http';
import commonStyles from '../../commonStyles';
import {useStateValue} from '../../store/store';
import Typography from '../../components/Typography';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Slider from '@react-native-community/slider';
import moment from 'moment';
import Orientation from 'react-native-orientation-locker';
import VideoModal from './VideoModal';

const services = new Service();

const isLandscape = () => {
	const dim = Dimensions.get('screen');
	if (dim.width >= dim.height) {
		return true;
	}
	return false;
};

function DurationView(props) {
	const duration = moment.duration(props.total, 'seconds');
	return (
		<View style={styles.sliderContainer}>
			<Slider
				style={styles.sliderView}
				value={props.value}
				step={1}
				minimumValue={0}
				maximumValue={props.total}
				tapToSeek={true}
				minimumTrackTintColor="#159AEA"
				maximumTrackTintColor="white"
				onSlidingComplete={props.onSeek}
				thumbImage={imageMapper.thumb.source}
			/>
			<Typography variant="body" style={styles.durationText}>
				{`${
					duration.hours() > 0 ? duration.hours() + ':' : ''
				}${duration.minutes()}:${duration.seconds()}`}
			</Typography>
		</View>
	);
}

function VideoScreen(props) {
	const {navigation, route} = props;
	const [state, dispatch] = useStateValue();

	const {params = {}} = route;
	const {video = {}} = params;
	const [videoDetails, setVideoDetails] = React.useState();
	const [currentTime, setCurrentTime] = React.useState();
	const [showControl, setShowControl] = React.useState(true);
	const [loading, setLoading] = React.useState(false);
	const [isSeek, setIsSeek] = React.useState(false);
	const [paused, setPaused] = React.useState(true);
	const [isBuffering, setIsBuffering] = React.useState(false);
	const [interval, setInterval] = React.useState(0);
	const [seekTime, setSeekTime] = React.useState(0);
	const [duration, setDuration] = React.useState(0);
	const [orientation, setOrientation] = React.useState('portrait');
	const [selectedQuality, setSelectedQuality] = React.useState();
	const [isQualityChanged, setIsQualityChanged] = React.useState(false);
	const [qualityView, setQualityView] = React.useState(false);

	const player = React.useRef();
	const onBuffer = React.useCallback((e) => {
		console.log('buffer', e);
		setIsBuffering(e.isBuffering);
		if (e.isBuffering === false) {
			setPaused(false);
		} else {
			setPaused(true);
		}
	}, []);

	const videoError = React.useCallback((err) => {
		console.log('err', err);
	}, []);
	const handleForward = React.useCallback(() => {
		console.log('forward');
		console.log('forward============', currentTime, player.current.seek);
		if (currentTime) {
			const time = currentTime + 10;
			setCurrentTime(duration < time ? duration : time);
			player.current.seek(duration < time ? duration : time);
		}
	}, [player, currentTime, duration]);

	const handleBackward = React.useCallback(() => {
		if (currentTime > 0) {
			const time = currentTime - 10;
			setCurrentTime(time > -1 ? time : 1);
			player.current.seek(time > -1 ? time : 1);
		}
	}, [player, currentTime]);

	const onSeek = React.useCallback((e) => {
		console.log(e);
	}, []);

	const handleLoad = React.useCallback(
		(e) => {
			console.log('video loading', e);
			setDuration(Math.floor(e.duration));
			setCurrentTime(e.currentTime);
			setPaused(false);
			if (!isSeek && player.current && videoDetails.WatchTime) {
				setIsSeek(true);
				if(videoDetails.WatchTime) {
					player.current.seek(Number(videoDetails.WatchTime));
				}
			}
			console.log(isQualityChanged);
			if(isQualityChanged) {
				setIsQualityChanged(false);
				player.current.seek(Number(currentTime));
			}
			
		},
		[isSeek, player, videoDetails, currentTime, isQualityChanged],
	);

	const handleHideControl = React.useCallback(() => {
		setShowControl(false);
	}, []);
	const handleShowControl = React.useCallback(() => {
		setShowControl(true);
	}, []);

	const handleVideoPress = React.useCallback(() => {
		handleShowControl();
		if (!paused) {
			setTimeout(() => {
				handleHideControl();
			}, 5000);
		}
	}, [handleShowControl, handleHideControl, paused]);

	const updateContinueWatching = React.useCallback(
		async (_currentTime) => {
			if (interval === 5) {
				const data = {
					CustomerId: state.user.CustomerId,
					WatchTime: _currentTime.toFixed(0),
					VideoId: video.VideoId,
				};
				const result = await services.post('ContinueWatchingVideo', data);
				// console.log(result);
				dispatch({type: 'UPDATE_CONTINUE_WATCHING', data: {...video, ...data}});
				setInterval(0);
			} else {
				setInterval(interval + 1);
			}
		},
		[interval, dispatch, state.user, video],
	);

	const handleProgress = React.useCallback(
		async (e) => {
			// console.log('called');
			setCurrentTime(e.currentTime);
			setSeekTime(e.currentTime);
			updateContinueWatching(e.currentTime);
		},
		[updateContinueWatching],
	);

	const handlePaused = React.useCallback(() => {
		setPaused((p) => !p);
		// player.current.methods.togglePlayPause();
		// console.log(player.current);
	}, []);

	const handleEnd = React.useCallback((e) => {
		setCurrentTime(e.currentTime);
		setPaused(true);
	}, []);

	const updateSeek = React.useCallback(
		(time) => {
			setSeekTime(time);
			player.current.seek(time);
		},
		[player],
	);

	const handleBack = React.useCallback(() => {
		player.current = null;
		navigation.goBack();
	}, [navigation, player]);

	const handleBitRate = React.useCallback((value) => {
		console.log(value);
		setSelectedQuality(value);	
		setIsQualityChanged(true);
		setQualityView(false);
	}, []);

	const handleQualityView = React.useCallback(() => {
		setQualityView(true);
	})

	const closeQualityView = React.useCallback(() => {
		setQualityView(false);
	})

	React.useEffect(() => {
		setLoading(true);
		services.get(`DisplayVideoDetail?VideoId=${video.VideoId}&CustomerId=${state.user.CustomerId}`).then((res) => {
			console.log(res);
			setLoading(false);
			if (res && res.Body && res.VideoQualityList) {
				setVideoDetails({...res.Body[0], VideoQualityList: [...res.VideoQualityList],ExpireDetail: {...res.ExpireDetail}, ...video});
				setSelectedQuality(res.VideoQualityList[0]);
			}
		});
	}, [video, state.user]);

	// React.useEffect(() => {
	// 	if (player.current && videoDetails && videoDetails.WatchTime && !isSeek) {
	// 		setIsSeek(true);
	// 		console.log(player.current.seek);
	// 		player.current.seek(Nulandscapember(videoDetails.WatchTime));
	// 	}
	// }, [player, videoDetails, isSeek]);

	useEffect(() => {
		console.log('kkkk', Orientation.getInitialOrientation().toLowerCase())
		setOrientation(Orientation.getInitialOrientation().toLowerCase());
		let _onOrientationDidChange = (orientation) => {
			console.log('cccc', Orientation.getInitialOrientation().toLowerCase());
			setOrientation(Orientation.getInitialOrientation().toLowerCase())
		  };
		Orientation.addOrientationListener(_onOrientationDidChange);

		Orientation.unlockAllOrientations();
		return () => {
			StatusBar.setHidden(false);
			Orientation.removeOrientationListener(_onOrientationDidChange);
			Orientation.lockToPortrait();
			player.current = null;
		};
	}, []);

	let videoPath = selectedQuality?.VideoPath;
	if(videoDetails?.ExpireDetail && `${videoDetails?.ExpireDetail?.IsValid}` === 'false') {
		console.log('this is trailer', videoDetails);
		videoPath = videoDetails.VideoTrailerPath;
	} 

	console.log({videoPath, loading});
	if (loading || (!videoPath)) {
		return (
			<ActivityIndicator
				size="large"
				color="#159AEA"
				style={commonStyles.loader}
			/>
		);
	}
	// console.log(`https://spacem.azurewebsites.net/${videoDetails?.VideoPath}`);
	const landscape = orientation === 'landscape';
	// console.log('landscape', selectedQuality);
	// console.log(selectedQuality);
	
	return (
		<React.Fragment>
			<StatusBar hidden />
			<TouchableOpacity
				activeOpacity={1}
				onPress={handleVideoPress}
				style={{
					flex: 1,
					position: 'relative',
					width: '100%',
					backgroundColor: 'black',
				}}>
				<Video
					source={{uri: `https://spacem.azurewebsites.net${videoPath}` }}
					ref={(ref) => {
						// console.log(ref);
						player.current = ref;
					}} // Store reference
					navigator={props.navigation}
					reportBandwidth={true}
					onBandwidthUpdate={(data) => console.log('bandwidth', data)}
					onEnd={handleEnd}
					onLoad={handleLoad}
					onBuffer={onBuffer} // Callback when remote video is buffering
					onError={videoError} // Callback when video cannot be loaded
					style={styles.backgroundVideo}
					fullscreen={true}
					resizeMode={landscape ? 'cover' : 'contain'}
					onSeek={onSeek}
					onHideControls={handleHideControl}
					onShowControls={handleShowControl}
					seekColor="#159AEA"
					onProgress={handleProgress}
					toggleResizeModeOnFullscreen={false}
					doubleTapTime={75}
					controlTimeout={5000}
					progressUpdateInterval={1000}
					selectedTextTrack={{
						type: 'language',
						value: 'es',
					}}
					controls={false}
					paused={paused}
					textTracks={[
						{
							title: 'Spanish Subtitles',
							language: 'es',
							type: TextTrackType.VTT, // "application/x-subrip"
							// uri: `https://spacem.azurewebsites.net${videoDetails.SubTitlePath}`
							uri: 'http://carinait.net/projects/spacemvtt/View_From_A_Blue_Moon_Trailer-HD.en.vtt',
						},
					]}
				/>
				<React.Fragment>
					{showControl && (
						<React.Fragment>
							<TouchableOpacity style={styles.backArrow} onPress={handleBack}>
								<Icon name="west" color="#fff" size={32} />
							</TouchableOpacity>
							<DurationView
								value={seekTime}
								onSeek={updateSeek}
								total={duration}
							/>
							{isBuffering && (
								<ActivityIndicator
									size="large"
									color="#159AEA"
									style={styles.bufferingLoader}
								/>
							)}
							{!isBuffering && (
								<View
									style={[
										styles.playControl,
										{top: landscape ? '40%' : '46%'},
									]}>
									<TouchableOpacity
										style={styles.backward}
										onPress={handleBackward}>
										<Image
											style={styles.seekButton}
											source={imageMapper.backwardPlay.source}
										/>
									</TouchableOpacity>

									<TouchableOpacity
										style={styles.playButton}
										onPress={handlePaused}>
										<Icon
											name={paused ? 'play-arrow' : 'pause'}
											color="#fff"
											size={48}
										/>
									</TouchableOpacity>
									<TouchableOpacity
										style={styles.forward}
										onPress={handleForward}>
										<Image
											style={styles.seekButton}
											source={imageMapper.forwardPlay.source}
										/>
									</TouchableOpacity>
								</View>
							)}
							<TouchableOpacity style={{position: 'absolute', bottom: 10, right: 20, paddingRight: 30}} onPress={handleQualityView}>
								<Typography variant="title3">Change Quality</Typography>
							</TouchableOpacity>
						</React.Fragment>
					)}
				</React.Fragment>
			</TouchableOpacity>
			{qualityView && <VideoModal 
				open={qualityView}
				onQualityChange={handleBitRate}
				list={videoDetails.VideoQualityList}
				selectedQuality={selectedQuality}
				onClose={closeQualityView}
			/>}
		</React.Fragment>
	);
}

const styles = StyleSheet.create({
	backgroundVideo: {
		width: '100%',
		backgroundColor: '#000F24',
		position: 'absolute',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
	},
	forward: {
		// position: 'absolute',
		// top: '45%',
		// right: 50,
		marginTop: 3,
	},
	backward: {
		// position: 'absolute',
		// top: '45%',
		// left: 50,
		marginTop: 3,
	},
	backwardPlay: {},
	forwardPlay: {},
	playControl: {
		position: 'absolute',
		width: '100%',
		top: '40%',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingLeft: '10%',
		paddingRight: '10%',
	},
	playButton: {
		// top: '44%',
		alignSelf: 'center',

		paddingBottom: 20,
	},
	backArrow: {
		position: 'absolute',
		paddingTop: 20,
		paddingLeft: 20,
	},
	seekButton: {
		width: 38,
		height: 42,
	},
	sliderContainer: {
		position: 'absolute',
		width: '100%',
		display: 'flex',
		bottom: 30,
		flexDirection: 'row',
	},
	sliderView: {
		height: 40,
		flex: 1,
	},
	durationText: {
		color: '#fff',
		marginRight: 10,
		marginTop: 10,
		fontWeight: '200',
	},
	bufferingLoader: {
		top: '45%',
	},
});

export default VideoScreen;
