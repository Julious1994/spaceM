import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import LinearGradiant from 'react-native-linear-gradient';
import Typography from './Typography';

function Tab(props) {
	return (
		<TouchableOpacity
			activeOpacity={1}
			style={styles.container}
			onPress={props.onPress}>
			<Typography
				variant="body"
				style={[styles.title, props.active && styles.activeText]}>
				{props.title}
			</Typography>
			{props.active && (
				<LinearGradiant
					start={{x: 0, y: 0}}
					end={{x: 0.55, y: 0}}
					colors={['#77C5F2', '#159AEA', '#006AAA', '#22497D']}
					style={styles.linearGradient}
				/>
			)}
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		flexDirection: 'column',
		flex: 1,
	},
	linearGradient: {
		height: 2.5,
		borderRadius: 7,
	},
	title: {
		padding: 7,
		alignSelf: 'center',
		fontWeight: 'normal',
		letterSpacing: 0.3,
		paddingLeft: 3,
		paddingRight: 3,
	},
	activeText: {
		color: '#FFF',
		fontWeight: 'bold',
		letterSpacing: 0.3,
	},
});

export default Tab;
