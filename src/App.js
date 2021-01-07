import React from 'react';
import {View, Text, BackHandler, Alert, StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Loader from './components/Loader';
import routes from './routes';
import {StateProvider} from './store/store';
import {reducer, initialState} from './store/reducer';
import Orientation from 'react-native-orientation';

const Stack = createStackNavigator();

function App() {
	const navigationRef = React.useRef();

	React.useEffect(() => {
		Orientation.lockToPortrait();
		const backHandler = BackHandler.addEventListener(
			'hardwareBackPress',
			() => {
				const navigationState = navigationRef.current.getRootState();
				if (navigationState.routes.length <= 1) {
					Alert.alert('Exit App', 'Do you want to exit an app', [
						{text: 'YES', onPress: () => BackHandler.exitApp()},
						{text: 'NO', onPress: () => null},
					]);
				}
				navigationRef.current.goBack();
				return true;
			},
		);
		() => backHandler.remove();
	}, []);

	return (
		<StateProvider initialState={initialState} reducer={reducer}>
			<NavigationContainer ref={navigationRef}>
				<StatusBar backgroundColor="#000F24" />
				{routes(Stack)}
			</NavigationContainer>
		</StateProvider>
	);
}

export default App;
