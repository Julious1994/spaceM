import React from 'react';
import {
	View,
	Text,
	FlatList,
	TouchableOpacity,
	Image,
	StyleSheet,
	Alert,
	ActivityIndicator,
} from 'react-native';
import ScrollablePageView from '../../components/ScrollablePageView';
import Typography from '../../components/Typography';
import WatchListItem from './WatchListItem';
import WatchListOption from './WatchListOption';
import BottomBar from './../BottomBar';
import {StackActions} from '@react-navigation/native';
import commonStyles from './../../commonStyles';
import imageMapper from './../../images/imageMapper';
import Service from '../../services/http';
import {useStateValue} from '../../store/store';

const services = new Service();

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
		<Typography variant="title3">Watch List</Typography>
	</View>
);

function WatchList(props) {
	const {navigation} = props;
	const [state, dispatch] = useStateValue();
	const data = [...Array(15).keys()];
	const [movieList, setMovieList] = React.useState([]);
	const [selectedItem, setSelectedItem] = React.useState();
	const [showOption, setShowOption] = React.useState(false);
	const [loading, setLoading] = React.useState(false);
	const {user} = state;
	const handlePress = React.useCallback(
		(item) => {
			navigation.dispatch(
				StackActions.push('VideoDetail', {video: {...item.item}}),
			);
		},
		[navigation],
	);

	const handleOption = React.useCallback((item) => {
		setSelectedItem(item);
		setShowOption(true);
	}, []);

	const handleDelete = React.useCallback(() => {
		Alert.alert('Confirm', 'Do you want to remove?', [
			{text: 'Yes', onPress: () => removeItem(selectedItem)},
			{text: 'No'},
		]);
	}, [selectedItem, removeItem]);

	const removeItem = React.useCallback(
		({item}) => {
			if (item.VideoId) {
				services.post('RemoveWatchList', {Id: item.VideoId}).then((res) => {
					Alert.alert('Delete Watch item', res.res);
					if (res.status === 200) {
						setShowOption(false);
						fetchWatchList();
					}
				});
			}
		},
		[fetchWatchList],
	);

	const handleView = React.useCallback(() => {
		setShowOption(false);
		navigation.dispatch(
			StackActions.push('VideoDetail', {video: {...selectedItem.item}}),
		);
	}, [navigation, selectedItem]);

	const fetchWatchList = React.useCallback(() => {
		if (state.user) {
			setLoading(true);
			services
				.get(`WatchListVideo?CustomerId=${state.user.CustomerId}`)
				.then((res) => {
					setLoading(false);
					setMovieList([...res]);
				});
		}
	}, [state.user]);

	React.useEffect(() => {
		fetchWatchList();
	}, [fetchWatchList]);

	return (
		<ScrollablePageView
			scrollable={false}
			header={<Header navigation={navigation} />}
			bottomBar={<BottomBar navigation={navigation} active={2} />}>
			{loading && <ActivityIndicator size="large" color="#159AEA" />}
			{!loading && (
				<FlatList
					data={movieList}
					keyExtractor={(item, i) => `${i}`}
					renderItem={(item, i) => (
						<WatchListItem
							key={i}
							{...item}
							onPress={() => handlePress(item)}
							onOption={() => handleOption(item)}
						/>
					)}
				/>
			)}
			<WatchListOption
				open={showOption}
				onClose={() => setShowOption(false)}
				onDelete={handleDelete}
				onView={handleView}
			/>
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
});

export default WatchList;
