import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Typography from './Typography';
import Icon from 'react-native-vector-icons/MaterialIcons';

function Accordion(props) {
	const [collapse, setCollapse] = React.useState(true);
	return (
		<View style={[styles.container, props.style]} onPress={props.onPress}>
			<TouchableOpacity
				style={styles.header}
				onPress={() => setCollapse((t) => !t)}>
				<View style={styles.labelView}>
					<Typography variant="title3" style={styles.label}>
						{props.label}
					</Typography>
				</View>
				<View style={styles.plusIconView}>
					<Icon
						name={collapse ? 'add' : 'remove'}
						color="#666F7B"
						size={18}
						style={styles.icon}
					/>
				</View>
			</TouchableOpacity>
			{!collapse && (
				<View style={styles.content}>
					<Typography variant="description" style={{color: '#666F7B'}}>
						{props.content}
					</Typography>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 15,
		borderBottomColor: 'rgba(102, 111, 123, 0.5)',
		borderBottomWidth: 0.5,
	},
	header: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	content: {},
	label: {
		// width: '50%',
		flex: 1,
		fontWeight: 'normal',
		color: 'rgba(255, 255, 255, 0.8)',
	},
	labelView: {
		maxWidth: '90%',
	},
	plusIconView: {
		// minWidth: '10%',
	},
	icon: {
		marginTop: 7,
	},
});
// customer udhar kharidi athwa payment kari sake che

export default Accordion;
