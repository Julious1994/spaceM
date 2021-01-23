import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Typography from './Typography';

function Button(props) {
	return (
		<TouchableOpacity disabled={props.disabled} style={[styles.container, props.style]} onPress={props.onPress}>
			<LinearGradient
				start={{x: 0, y: 0}}
				end={{x: 0.55, y: 0}}
				colors={['#159AEA', '#22497D']}
				style={[styles.linearGradient, props.disabled && {opacity: 0.5}]}>
					{props.leftIcon || null}
				<Typography variant="title2" style={[styles.buttonText, props.textStyle]}>
					{props.title}
				</Typography>
				{props.children || null}
			</LinearGradient>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {},
	linearGradient: {
		padding: 12,
		borderRadius: 5,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
	},
	buttonText: {
		alignSelf: 'center',
		color: '#fff',
		fontSize: 16,
	},
});

export default Button;
