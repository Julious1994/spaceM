import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import imageMapper from './../../images/imageMapper';
import Typography from './../../components/Typography';
import moment from 'moment';

function WatchListItem(props) {
	const {item: video = {}} = props;
	const getUri = (item) => {
		return item.ThumbnailPath
			? {uri: `https://spacem.in/${item.ThumbnailPath}`}
			: imageMapper.moviePhoto.source;
	};
	return (
		<TouchableOpacity style={styles.container} onPress={props.onPress}>
			<View style={styles.listItemContainer}>
				<View style={styles.imageView}>
					<Image
						source={getUri(video)}
						resizeMode="stretch"
						style={styles.image}
					/>
				</View>
				<View style={styles.infoView}>
					<Typography lines={2} variant="body" style={styles.movieName}>
						{video.Title}
					</Typography>
					<View style={styles.infoContainer}>
						<View style={styles.timeInfo}>
							<Typography variant="tiny1" style={styles.yearInfo}>
								{moment(video.LaunchDate).format('yyyy')}
							</Typography>
							<Typography variant="tiny1">94 min</Typography>
						</View>
						<TouchableOpacity style={styles.verticalDotView} onPress={props.onOption}>
							<Image
								source={imageMapper.verticalDot.source}
								style={styles.verticalDot}
							/>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		height: 90,
		backgroundColor: '#041D3E',
		marginBottom: 10,
	},
	listItemContainer: {
		display: 'flex',
		flexDirection: 'row',
	},
	imageView: {
		width: '40%',
		// alignSelf: 'flex-start'
	},
	image: {
		height: '100%',
		width: '100%',
	},
	infoSide: {
		backgroundColor: '#041D3E',
	},
	infoView: {
		padding: 15,
		paddingTop: 10,
		paddingRight: 2,
		paddingBottom: 5,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		flex: 1,
	},
	timeInfo: {
		display: 'flex',
		flexDirection: 'row',
	},
	infoContainer: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 7,
	},
	yearInfo: {
		marginRight: 5,
	},
	movieName: {
		color: '#fff',
	},
	verticalDot: {
		height: 14,
		width: 3.5,
	},
	verticalDotView: {
		position: 'absolute',
		right: 5,
		bottom: 3,
		width: 25,
		height: 25,
		alignItems: 'center',
		padding: 15,
	},
});

export default WatchListItem;
