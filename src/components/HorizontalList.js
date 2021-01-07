import React from 'react';
import {
	View,
	Text,
	ScrollView,
	Image,
	StyleSheet,
	TouchableOpacity,
} from 'react-native';
import imageMapper from './../images/imageMapper';
import Typography from './Typography';
import commonStyle from '../commonStyles';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';

function WatchBar({item, ...props}) {
	const width = (Number(item.WatchTime) * 100) / Number(item.VideoLength);
	return (
		<View style={styles.watchBarContainer}>
			<LinearGradient
				start={{x: 0, y: 0}}
				end={{x: 0.55, y: 0}}
				colors={['#159AEA', '#22497D']}
				style={[styles.watchGradient, {width}]}
			/>
		</View>
	);
}

function HorizontalList(props) {
	const {data, title, type} = props;
	const image = type === 'historic' ? 'landscapeMovie' : 'moviePhoto';
	const getUri = (item, i) => {
		return item.ThumbnailPath
			? {uri: `http://spacem.techymau.games/${item.ThumbnailPath}`}
			: imageMapper[i % 2 === 0 ? image + '_2' : image].source;
	};
	if (data.length <= 0) {
		return null;
	}
	return (
		<View style={styles.container}>
			<Typography variant="body" style={[styles.title]}>
				{title}
			</Typography>
			<ScrollView
				horizontal={true}
				showsHorizontalScrollIndicator={true}
				alwaysBounceHorizontal={true}>
				{data.map((item, i) => (
					<TouchableOpacity
						key={i}
						style={styles.item}
						onPress={() => props.onPress(item, i)}>
						<Image
							source={getUri(item, i)}
							resizeMode={type === 'historic' ? 'cover' : 'cover'}
							style={[
								type === 'historic' ? styles.historicImage : styles.image,
							]}
						/>
						{type === 'historic' && <WatchBar item={item} />}
						{type === 'historic' && (
							<View style={styles.playButtonView}>
								<Image
									source={imageMapper.roundPlay.source}
									style={styles.playStyle}
								/>
							</View>
						)}
						{type === 'historic' && (
							<React.Fragment>
								<Typography variant="body" style={styles.movieName} lines={1}>
									{item.Title}
								</Typography>
								<Typography variant="description" style={styles.duration}>
									{`Left at ${moment(item.WatchTime, 's').format('mm:ss')}`}
								</Typography>
							</React.Fragment>
						)}
					</TouchableOpacity>
				))}
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginTop: 20,
		marginLeft: '3%',
	},
	item: {
		marginRight: 12,
		position: 'relative',
		maxWidth: 120,
	},
	image: {
		width: 120,
		height: 150,
	},
	title: {
		color: '#fff',
		marginBottom: 10,
	},
	movieName: {
		color: '#FFFFFF',
		fontWeight: '100',
	},
	duration: {
		color: '#666F7B',
	},
	historicImage: {
		width: 120,
		height: 80,
	},
	playButtonView: {
		position: 'absolute',
		alignSelf: 'center',
		marginTop: 24,
	},
	playStyle: {
		width: 32,
		height: 32,
	},
	watchBarContainer: {
		position: 'absolute',
		left: 0,
		right: 0,
		width: '100%',
		backgroundColor: 'rgba(255, 255, 255, 0.3)',
		borderRadius: 2,
		top: 77,
	},
	watchGradient: {
		height: 3,
	},
});

export default HorizontalList;
