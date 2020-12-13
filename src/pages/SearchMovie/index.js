import React from 'react';
import {
	View,
	Text,
	FlatList,
	TouchableOpacity,
	Image,
	StyleSheet,
} from 'react-native';
import ScrollablePageView from '../../components/ScrollablePageView';
import Typography from '../../components/Typography';
import Input from '../../components/Input';
import BottomBar from './../BottomBar';
import {StackActions} from '@react-navigation/native';
import commonStyles from './../../commonStyles';
import imageMapper from './../../images/imageMapper';

const Header = ({navigation}) => (
	<View style={[commonStyles.pageStyle, styles.headerContainer]}>
		<TouchableOpacity
			style={commonStyles.backButton}
			onPress={() => navigation.goBack()}>
			<Image
				source={imageMapper.leftArrow.source}
				style={commonStyles.backButtonIcon}
			/>
		</TouchableOpacity>
		<Typography variant="title3">Search Movie</Typography>
	</View>
);

function SearchList(props) {
	const {navigation} = props;
	const data = [...Array(15).keys()];
	const [selectedItem, setSelectedItem] = React.useState();
	const [showOption, setShowOption] = React.useState(false);

	const handlePress = React.useCallback(() => {
		navigation.dispatch(StackActions.push('VideoDetail'));
	}, [navigation]);

	const handleOption = React.useCallback((item) => {
		setSelectedItem(item);
		setShowOption(true);
	}, []);

	return (
		<ScrollablePageView
			scrollable={false}
			header={<Header navigation={navigation} />}
			bottomBar={<BottomBar active={1} navigation={navigation} />}>
			<Input style={[styles.input]}
				placeholder="Search movies, shows etc..." />
		</ScrollablePageView>
	);
}

const styles = StyleSheet.create({
	headerContainer: {
		height: 'auto',
		position: 'relative',
		alignItems: 'center',
		paddingTop: 10,
		paddingBottom: 10,
	},
	input: {
		marginLeft: 15,
		marginRight: 15,
	},
});

export default SearchList;
