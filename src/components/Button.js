import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Typography from './Typography';

function Button(props) {
	return (
		<TouchableOpacity style={[styles.container, props.style]} onPress={props.onPress}>
			<LinearGradient
				start={{x: 0, y: 0}}
				end={{x: 0.55, y: 0}}
				colors={['#159AEA', '#22497D']}
				style={styles.linearGradient}>
				<Typography variant="title2" style={styles.buttonText}>
					{props.title}
				</Typography>
			</LinearGradient>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {},
	linearGradient: {
		padding: 12,
		borderRadius: 5,
	},
	buttonText: {
		alignSelf: 'center',
		color: '#fff',
		fontSize: 16,
	},
});

export default Button;
