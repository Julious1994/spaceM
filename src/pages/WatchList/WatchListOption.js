import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import Modal from 'react-native-modal';
import Typography from '../../components/Typography';
import imageMapper from '../../images/imageMapper';

function WatchListOption(props) {
	return (
		<Modal
			style={{position: 'relative', margin: 0}}
			isVisible={props.open}
			onBackButtonPress={props.onClose}
			onBackdropPress={props.onClose}>
			{props.open && (
				<View
					style={[
						styles.container,
						{...(props.height && {height: props.height})},
					]}>
					<View style={styles.content}>
						<Typography variant="title3">Mad max fury</Typography>
						<TouchableOpacity style={styles.option} onPress={props.onDelete}>
							<Image
								source={imageMapper.removeWatchListItem.source}
								style={styles.image}
							/>
							<Typography variant="description" style={styles.optionText}>
								Remove from Watchlist
							</Typography>
						</TouchableOpacity>
						<TouchableOpacity style={styles.option} onPress={props.onView}>
							<Image source={imageMapper.info.source} style={styles.image} />
							<Typography variant="description" style={styles.optionText}>
								View Details
							</Typography>
						</TouchableOpacity>
					</View>
					<TouchableOpacity style={styles.closeView} onPress={props.onClose}>
						<Typography variant="body" style={styles.closeViewText}>
							Close
						</Typography>
					</TouchableOpacity>
				</View>
			)}
		</Modal>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#142C4B',
		width: '100%',
		minHeight: 100,
		bottom: 0,
		position: 'absolute',
	},
	closeView: {
		// position: 'absolute',
		// width: '100%',
		// bottom: 0,
		padding: 15,
		backgroundColor: '#041D3E',
	},
	closeViewText: {
		color: '#fff',
		alignSelf: 'center',
	},
	content: {
		// marginBottom:
		padding: 20,
		paddingTop: 10,
	},
	image: {
		width: 18,
		height: 18,
	},
	option: {
		display: 'flex',
		flexDirection: 'row',
		marginBottom: 5,
		paddingTop: 7,
		paddingBottom: 7,
	},
	optionText: {
		color: '#C3C8CF',
		marginLeft: 10,
		lineHeight: 20,
	},
});

export default WatchListOption;
