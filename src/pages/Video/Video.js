import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import Video from 'react-native-video-controls';
import imageMapper from '../../images/imageMapper';

function VideoScreen(props) {
	const {navigation, route} = props;
	const {params = {}} = route;
	const {video = {}} = params;
	const [currentTime, setCurrentTime] = React.useState();
	const [showControl, setShowControl] = React.useState(true);

	const player = React.createRef();
	const onBuffer = React.useCallback((e) => {
		console.log('buffer', e);
	}, []);

	const videoError = React.useCallback(() => {}, []);
	console.log(video);
	const handleForward = React.useCallback(() => {
		if (player.current.state.duration) {
			const duration = player.current.state.duration;
			const time = currentTime + 10;
			setCurrentTime(duration < time ? duration : time);
			player.current.player.ref.seek(duration < time ? duration : time);
		}
	}, [player, currentTime]);

	const handleBackward = React.useCallback(() => {
		console.log('back ward currentTime', currentTime);
		if (currentTime > 0) {
			const time = currentTime - 10;
			setCurrentTime(time > -1 ? time : 1);
			player.current.player.ref.seek(time > -1 ? time : 1);
		}
	}, [player, currentTime]);

	const onSeek = React.useCallback((e) => {
		console.log(e);
	}, []);

	const handleLoad = React.useCallback(() => {
		console.log(player.current);
		setCurrentTime(player.current.state.currentTime);
	}, [player]);

	const handleHideControl = React.useCallback(() => {
		setShowControl(false);
	}, []);
	const handleShowControl = React.useCallback(() => {
		setShowControl(true);
	}, []);

	const handleVideoPress = React.useCallback(() => {
		// handleShowControl();
		// setTimeout(() => {
		// 	handleHideControl();
		// }, 3000);
	}, [handleShowControl, handleHideControl]);

	const handleProgress = React.useCallback((e) => {
		setCurrentTime(e.currentTime);
	}, []);

	return (
		<TouchableOpacity
			activeOpacity={1}
			onPress={handleVideoPress}
			style={{
				flex: 1,
				position: 'relative',
				width: '100%',
				backgroundColor: 'black',
			}}>
			{/* <Image
				source={imageMapper.videoPlayer.source}
				resizeMode="cover"
				style={{height: '100%', width: '100%'}}
			/> */}
			<Video
				source={{
					uri: `https://vjs.zencdn.net/v/${'oceans.mp4'}`,
				}} // Can be a URL or a local file.
				ref={(ref) => {
					player.current = ref;
				}} // Store reference
				navigator={props.navigation}
				onLoad={handleLoad}
				onBuffer={onBuffer} // Callback when remote video is buffering
				onError={videoError} // Callback when video cannot be loaded
				style={styles.backgroundVideo}
				fullscreen={true}
				resizeMode="cover"
				onSeek={onSeek}
				onHideControls={handleHideControl}
				onShowControls={handleShowControl}
				seekColor="#159AEA"
				onProgress={handleProgress}
				toggleResizeModeOnFullscreen={false}
				doubleTapTime={75}
				controlTimeout={5000}
			/>

			{showControl && (
				<TouchableOpacity style={styles.forward} onPress={handleForward}>
					<Image
						style={styles.seekButton}
						source={imageMapper.forwardPlay.source}
					/>
				</TouchableOpacity>
			)}
			{showControl && (
				<TouchableOpacity style={styles.backward} onPress={handleBackward}>
					<Image
						style={styles.seekButton}
						source={imageMapper.backwardPlay.source}
					/>
				</TouchableOpacity>
			)}
		</TouchableOpacity>
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
		position: 'absolute',
		top: '45%',
		right: 50,
	},
	backward: {
		position: 'absolute',
		top: '45%',
		left: 50,
	},
	backwardPlay: {},
	forwardPlay: {},
	seekButton: {
		width: 38,
		height: 42,
	},
});

export default VideoScreen;
