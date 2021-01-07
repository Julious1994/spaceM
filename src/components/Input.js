import React from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';

function Input(props) {
	const {icon, left, disabled = false, multiline = false, lines} = props;
	const inputProps = {};
	if (lines) {
		inputProps.numberOfLines = lines;
	}
	return (
		<View style={[styles.container, props.style]}>
			{left && icon}
			<TextInput
				editable={!disabled}
				secureTextEntry={props.secureTextEntry}
				placeholderTextColor="#666F7B"
				placeholder={props.placeholder}
				onChangeText={props.onChange}
				value={props.value}
				style={[styles.input]}
				multiline={multiline}
				{...inputProps}
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
