import React from 'react';
import {
	View,
	Text,
	FlatList,
	TouchableOpacity,
	Image,
	StyleSheet,
} from 'react-native';
import {useDebounce} from '@react-hook/debounce';

import ScrollablePageView from '../../components/ScrollablePageView';
import Typography from '../../components/Typography';
import Input from '../../components/Input';
import HorizontalList from './../../components/HorizontalList';
import BottomBar from './../BottomBar';
import {StackActions} from '@react-navigation/native';
import commonStyles from './../../commonStyles';
import imageMapper from './../../images/imageMapper';
import Service from '../../services/http';

const services = new Service();

const groupByCategory = (data) => {
	const list = [];
	data.forEach((d) => {
		const catIndex = list.findIndex((i) => i.CategoryId === d.CategoryId);
		if (catIndex !== -1) {
			list[catIndex] = {
				...list[catIndex],
				videos: [...list[catIndex].videos, {...d}],
			};
		} else {
			list.push({
				CategoryId: d.CategoryId,
				CategoryName: d.CategoryName,
				videos: [{...d}],
			});
		}
	});
	return list;
};

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
	const [searchText, setSearchText] = useDebounce('');
	const [selectedItem, setSelectedItem] = React.useState();
	const [showOption, setShowOption] = React.useState(false);
	const [loading, setLoading] = React.useState(true);
	const [data, setData] = React.useState([]);

	const handlePress = React.useCallback(() => {
		navigation.dispatch(StackActions.push('VideoDetail'));
	}, [navigation]);

	const handleOption = React.useCallback((item) => {
		setSelectedItem(item);
		setShowOption(true);
	}, []);

	const handleVideoClick = React.useCallback(
		(item, videos) => {
			navigation.dispatch(
				StackActions.push('VideoDetail', {video: {...item}, videos}),
			);
		},
		[navigation],
	);

	React.useEffect(() => {
		if (searchText !== '') {
			setLoading(true);
			services.get(`VideoSearch?Title=${searchText}`).then(async (res) => {
				setLoading(false);
				if (res && Array.isArray(res)) {
					const newData = groupByCategory(res);
					setData([...newData]);
				}
			});
		}
	}, [searchText]);
	return (
		<ScrollablePageView
			scrollable={true}
			header={<Header navigation={navigation} />}
			bottomBar={<BottomBar active={1} navigation={navigation} />}>
			<Input
				style={[styles.input]}
				onChange={(text) => setSearchText(text)}
				// value={searchText}
				placeholder="Search movies, shows etc..."
			/>
			{data.map((videoView, i) => (
				<HorizontalList
					key={i}
					data={videoView.videos}
					title={videoView.CategoryName}
					onPress={(item) => handleVideoClick(item, videoView.videos)}
				/>
			))}
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
