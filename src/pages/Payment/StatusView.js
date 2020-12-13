import React from 'react';
import {View, Image, StyleSheet, Modal} from 'react-native';
import imageMapper from '../../images/imageMapper';
import commonStyles from '../../commonStyles';
import Button from '../../components/Button';
import Typography from '../../components/Typography';

function StatusView(props) {
	const {status} = props;
	return (
		<View style={[commonStyles.pageStyle, styles.container, commonStyles.largePageSize]}>
			<Image
				source={imageMapper[`${status}Payment`].source}
				style={styles.image}
			/>
			<Typography variant="title2" style={styles.title}>
				YAY! It's done
			</Typography>
			<Typography variant="body" style={styles.message}>
				Transaction successful! We are proud, you have made someone richer.
			</Typography>
			{status === 'success' ? (
				<Button title="GO HOME" onPress={props.onHome} />
			) : (
				<Button title="TRY AGAIN" onPress={props.onClose} />
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
	},
	image: {
		width: 180,
		height: 135,
		alignSelf: 'center',
	},
	title: {
		marginTop: 20,
		alignSelf: 'center',
		marginBottom: 20,
	},
	message: {
		alignSelf: 'center',
		fontWeight: '100',
		marginBottom: 25,
	},
});

export default StatusView;
