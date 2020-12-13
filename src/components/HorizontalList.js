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

function HorizontalList(props) {
	const {data, title, type} = props;
	const image = type === 'historic' ? 'landscapeMovie' : 'moviePhoto';
	const getUri = (item, i) => {
		return item.SubTitlePath
			? {uri: `http://spacem.techymau.games/${item.SubTitlePath}`}
			: imageMapper[i % 2 === 0 ? image + '_2' : image].source;
	};
	return (
		<View style={styles.container}>
			<Typography variant="body" style={[styles.title]}>
				{title}
			</Typography>
			<ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
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
						{type === 'historic' && (
							<TouchableOpacity style={styles.playButtonView}>
								<Image
									source={imageMapper.roundPlay.source}
									style={styles.playStyle}
								/>
							</TouchableOpacity>
						)}
						{type === 'historic' && (
							<React.Fragment>
								<Typography variant="body" style={styles.movieName} lines={1}>
									{i % 2 === 0 ? 'Hush' : 'Mission Impossible'}
								</Typography>
								<Typography variant="description" style={styles.duration}>
									Left at 38:10
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
});

export default HorizontalList;
