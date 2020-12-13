import React from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';

function Input(props) {
	const {icon, left} = props;
	return (
		<View style={[styles.container, props.style]}>
			{left && icon}
			<TextInput
				secureTextEntry={props.secureTextEntry}
				placeholderTextColor="#666F7B"
				placeholder={props.placeholder}
				onChangeText={props.onChange}
				value={props.value}
				style={[styles.input]}
			/>
			{!left && icon}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#031B3B',
		borderRadius: 5,
		padding: 8,
		paddingBottom: 4,
		paddingTop: 4,
	},
	input: {
		color: '#fff',
	},
});

export default Input;
