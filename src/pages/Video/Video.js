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
	Platform,
	Alert,
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
import Webview from 'react-native-webview';
import JWPlayer, {JWPlayerState} from 'react-native-jw-media-player';
import ImmersiveMode from 'react-native-immersive-mode';
import { NativeModules } from 'react-native';

const services = new Service();
const dim = Dimensions.get('window');

const isPortrait = () => {
	return dim.height >= dim.width;
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
	const [showControl, setShowControl] = React.useState(false);
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
	const [alert, setAlert] = React.useState(false);
	const intervalRef = React.useRef(0);
	const isSeekRef = React.useRef(false);

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
	const handleForward = React.useCallback(async () => {
		console.log('forward');
		console.log('forward============', currentTime );
		const position = await player.current.position()
		console.log({position, duration});
		if (currentTime) {
			const time = currentTime + 10;
			setCurrentTime(duration < time ? duration : time);
			player.current.seekTo(duration < time ? duration : time);
		}
	}, [player, currentTime, duration]);

	const handleBackward = React.useCallback(() => {
		if (currentTime > 0) {
			const time = currentTime - 10;
			setCurrentTime(time > -1 ? time : 1);
			player.current.seekTo(time > -1 ? time : 1);
		}
	}, [player, currentTime]);

	const onSeek = React.useCallback((e) => {
		console.log(e);
	}, []);

	const handleLoad = React.useCallback(
		(e) => {
			console.log('=====eo loading', e);
			console.log(player.current);
			player.current.setFullscreen(true);
			// setDuration(Number(videoDetails.WatchTime));
			// setDuration(Math.floor(e.duration));
			// setCurrentTime(e.currentTime);
			// setPaused(false);
			console.log(isSeekRef.current);
			if (!isSeekRef.current && player.current && videoDetails.WatchTime) {
				isSeekRef.current = true;
				console.log('came here');
				if (videoDetails.WatchTime) {
					player.current.seekTo(Number(videoDetails.WatchTime));
					// player.current.seekTo(Number(videoDetails.WatchTime));
				}
			}
			// console.log(isQualityChanged);
			// if (isQualityChanged) {
			// 	setIsQualityChanged(false);
			// 	console.log(currentTime);
			// 	if (!isNaN(Number(currentTime))) {
			// 		player.current.seek(Number(currentTime));
			// 	}
			// }
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
			setTimeout(() => {
				handleHideControl();
			}, 5000);
	
	}, [handleShowControl, handleHideControl, paused]);

	const updateContinueWatching = React.useCallback(
		async (_currentTime) => {
			// console.log({_currentTime, time: intervalRef.current});
			if (intervalRef.current === 100) {
				const data = {
					CustomerId: state.user.CustomerId,
					WatchTime: _currentTime.toFixed(0),
					VideoId: video.VideoId,
				};
				const result = await services.post('ContinueWatchingVideo', data);
				console.log(result);
				dispatch({type: 'UPDATE_CONTINUE_WATCHING', data: {...video, ...data}});
				// setInterval(0);
				intervalRef.current = 0;
			} else {
				// console.log('came here');
				intervalRef.current = intervalRef.current + 1;
				// setInterval(i => i + 1);
			}
		},
		[intervalRef, dispatch, state.user, video],
	);

	const handleProgress = React.useCallback(
		async ({time, duration, ...e}) => {
			// console.log('called progress',  e);
			setCurrentTime(e.nativeEvent.position);
			setDuration(e.nativeEvent.duration)
			setSeekTime(e.nativeEvent.position);
			updateContinueWatching(e.nativeEvent.position);
		},
		[updateContinueWatching, player],
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
	});

	const closeQualityView = React.useCallback(() => {
		setQualityView(false);
	});

	React.useEffect(() => {
		setLoading(true);
		ImmersiveMode.fullLayout(true);
		NativeModules.PreventScreenshotModule.forbid();
		services
			.get(
				`DisplayVideoDetail?VideoId=${video.VideoId}&CustomerId=${state.user.CustomerId}`,
			)
			.then((res) => {
				console.log(res);
				setLoading(false);
				if (res && res.Body && res.VideoQualityList) {
					setVideoDetails({
						...res.Body[0],
						VideoQualityList: [...res.VideoQualityList],
						ExpireDetail: {...res.ExpireDetail},
						...video,
					});
					setSelectedQuality(res.VideoQualityList[0]);
				}
			});
			return () => {
				console.log('=================unmount===========');
				// player.current.stop();
				NativeModules.PreventScreenshotModule.allow();
				ImmersiveMode.fullLayout(false);
				player.current = null;
				isSeekRef.current = false;
			}
	}, [video, state.user, isSeekRef]);

	// React.useEffect(() => {
	// 	if (player.current && videoDetails && videoDetails.WatchTime && !isSeek) {
	// 		setIsSeek(true);
	// 		console.log(player.current.seek);
	// 		player.current.seek(Nulandscapember(videoDetails.WatchTime));
	// 	}
	// }, [player, videoDetails, isSeek]);
	let _onOrientationDidChange = (orientation) => {
		console.log('cccc', Orientation.getInitialOrientation().toLowerCase());
		setOrientation(isPortrait() ? 'portrait' : 'landscape');
	};

	useEffect(() => {
		console.log('kkkk', Orientation.getInitialOrientation().toLowerCase());
		Orientation.unlockAllOrientations();
		Orientation.lockToLandscape();
		setOrientation(isPortrait() ? 'portrait' : 'landscape');
		Dimensions.addEventListener('change', () =>
			setOrientation(isPortrait() ? 'portrait' : 'landscape'),
		);

		return () => {
			StatusBar.setHidden(false);
			Dimensions.removeEventListener('change');
			Orientation.lockToPortrait();
			player.current = null;
		};
	}, []);

	let videoPath = selectedQuality?.VideoPath;
	if (
		videoDetails?.ExpireDetail &&
		`${videoDetails?.ExpireDetail?.IsValid}` === 'false' &&
		videoDetails?.Amount !== 0
	) {
		// console.log('this is trailer', videoDetails);
		videoPath = videoDetails.VideoTrailerPath;
	}

	// console.log({videoPath, loading});
	if (loading) {
		return (
			<View style={commonStyles.pageStyle}>
				<ActivityIndicator
					size="large"
					color="#159AEA"
					style={commonStyles.loader}
				/>
			</View>
		);
	}

	if (!videoPath && !loading) {
		return (
			<View style={commonStyles.pageStyle}>
				{/* <Typography variant="title3" style={{alignSelf: 'center', marginTop: 10}}>No video found</Typography> */}
			</View>
		);
	}
	// console.log(`https://spacem.in/${videoDetails?.VideoPath}`);
	const landscape = orientation === 'landscape';
	// console.log('landscape', selectedQuality);
	// console.log(selectedQuality);
	// console.log(landscape, orientation);
	const videoURI =
		videoPath.indexOf('http') !== -1
			? `${videoPath}(format=m3u8-aapl)`
			: `https://spacem.in${videoPath}`;

	// return (
	// 	<Webview
	// 		onError={(e) => console.log(e)}
	// 		source={{html: `
	// 			<html>
	// 				<head>
	// 					<meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0">
	// 					<link href="https://amp.azure.net/libs/amp/latest/skins/amp-flush/azuremediaplayer.min.css" rel="stylesheet">
	// 					<script src= "https://amp.azure.net/libs/amp/latest/azuremediaplayer.min.js"></script>
	// 				</head>
	// 				<body style="background-color:black;padding:0;margin:0">
	// 					<video id="vid1" class="azuremediaplayer amp-flush-skin amp-big-play-centered" autoplay controls width="100%" height="100%" poster="https://spacem.in${videoDetails.PosterPath}" data-setup='{"nativeControlsForTouch": false}' style="padding:0;margin:0;position:relative;border:0px !important;">
	// 						<source src="${videoURI}" type="application/vnd.ms-sstr+xml" />
	// 						<track kind="subtitles" src="https://spacem.in${videoDetails.SubTitlePath}" srclang="en" label="English">
	// 					</video>
	// 				</body>
	// 			</html>
	// 		`}}
	// 	/>
	// )
	// console.log({videoDetails}, 'viiii');
	const playlistItem = {
		title: 'Track',
		mediaId: '1',
		image: `https://spacem.in${videoDetails.PosterPath}`,
		// desc: 'My beautiful track',
		time: videoDetails.WatchTime ? Number(videoDetails.WatchTime) : 0,
		file: `${videoURI}`,
		autostart: true,
		controls: true,
		repeat: false,
		displayDescription: true,
		displayTitle: true,
		playerStyle: "video",
		tracks: [
			{
				// file: 'http://carinait.net/projects/spacemvtt/View_From_A_Blue_Moon_Trailer-HD.en.vtt',
				file: `https://spacem.in${videoDetails.SubTitlePath}`,
				label: 'en',
			},
		],
		backgroundAudioEnabled: false,
	};
	// console.log(playlistItem);
	return (
		<React.Fragment>
			<StatusBar hidden />
			{/* <TouchableOpacity
				activeOpacity={1}
				onPress={handleVideoPress}
				style={{
					flex: 1,
					position: 'relative',
					width: '100%',
					backgroundColor: 'black',
				}}> */}
				<JWPlayer
					ref={(p) => (player.current = p)}
					style={styles.player}
					playerStyle={'custom'}
					playlistItem={playlistItem} // Recommended - pass the playlistItem as a prop into the player
					// playlist={[playlistItem]}
					// onBeforePlay={(e) => console.log(e)}
					onPlay={(e) => handleLoad(e)}
					onPause={(e) => console.log(e)}
					// onIdle={() => player.current && player.current.stop()}
					// startTime={360}
					// onPlayerReady={(e) => {
					// 	handleLoad();
					// 	console.log('cccccc', {...e}, e.nativeEvent.duration)
					// }}
					onPlaylistItem={(event) => console.log({...event})}
					onSetupPlayerError={(event) => console.log(event)}
					onPlayerError={(event) => console.log(event)}
					onBuffer={(e) => console.log(e)}
					onTime={handleProgress}
					backgroundAudioEnabled={false}
					fullScreenOnLandscape={true}
					nativeFullScreen={true}
					landscapeOnFullScreen={true}
					// onFullScreen={() => this.onFullScreen()}
					// onFullScreenExit={() => this.onFullScreenExit()}
				/>
				{/* <JWPlayer
					source={{uri: 'http://profficialsite.origin.mediaservices.windows.net/5ab94439-5804-4810-b220-1606ddcb8184/tears_of_steel_1080p-m3u8-aapl.ism/manifest(format=m3u8-aapl)', 
								type: 'application/vnd.ms-sstr+xml',
								"extension": "m3u8"
							}}
					ref={(ref) => {
						// console.log(ref);
						player.current = ref;
					}} // Store reference
					playlistItem={playlistItem}
					navigator={props.navigation}
					reportBandwidth={true}
					// onBandwidthUpdate={(data) => console.log('bandwidth', data)}
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
					onTime={handleProgress}
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
							// uri: `https://spacem.in${videoDetails.SubTitlePath}`
							uri: 'http://carinait.net/projects/spacemvtt/View_From_A_Blue_Moon_Trailer-HD.en.vtt',
						},
					]}
				/> */}
				<React.Fragment>
					{(
						<React.Fragment>
							{/* <TouchableOpacity style={styles.backArrow} onPress={handleBack}>
								<Icon name="west" color="#fff" size={32} />
							</TouchableOpacity> */}
							{/* <DurationView
								value={seekTime}
								onSeek={updateSeek}
								total={duration}
							/> */}
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
										onPress={() => {
											handleVideoPress();
											handleBackward();
										}}>
										{showControl && <Image
											style={styles.seekButton}
											source={imageMapper.backwardPlay.source}
										/>}
									</TouchableOpacity>

									{/* <TouchableOpacity
										style={styles.playButton}
										onPress={handlePaused}>
										<Icon
											name={paused ? 'play-arrow' : 'pause'}
											color="#fff"
											size={48}
										/>
									</TouchableOpacity> */}
									<TouchableOpacity
										style={styles.forward}
										onPress={() => {
											handleVideoPress()
											handleForward() 
											}}>
										{showControl && <Image
											style={[styles.seekButton, {marginLeft: 10}]}
											source={imageMapper.forwardPlay.source}
										/>}
									</TouchableOpacity>
								</View>
							)}
							{/* <TouchableOpacity
								style={{
									position: 'absolute',
									bottom: 10,
									right: 20,
									paddingRight: 30,
								}}
								onPress={handleQualityView}>
								<Typography variant="title3">Change Quality</Typography>
							</TouchableOpacity> */}
						</React.Fragment>
					)}
				</React.Fragment>
			{/* </TouchableOpacity> */}
			{qualityView && (
				<VideoModal
					open={qualityView}
					onQualityChange={handleBitRate}
					list={videoDetails.VideoQualityList}
					selectedQuality={selectedQuality}
					onClose={closeQualityView}
				/>
			)}
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
		// paddingLeft: 20,
		width: 70,
		height: 120,
	},
	backward: {
		// position: 'absolute',
		// top: '45%',
		// left: 50,
		marginTop: 3,
		width: 120,
		height: 120,
		
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
	player: {
		flex: 1,
	}
});

export default VideoScreen;
