import React from 'react';
import HomeScreen from './pages/Home/Home';
import LoginScreen from './pages/Login';
import SignupScreen from './pages/Signup';
import WatchList from './pages/WatchList/WatchList';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile/Profile';
import Plan from './pages/Profile/Plan';
import Transactions from './pages/Profile/Transactions';
import Video from './pages/Video/Video';
import VideoDetail from './pages/Video/VideoDetail';
import PaymentForm from './pages/Payment/PaymentForm';
import SearchView from './pages/SearchMovie';
import ProfileView from './pages/Profile/ProfileView';

const routes = (Stack) => (
	<Stack.Navigator screenOptions={{headerShown: false}}>
		<Stack.Screen name="Login" component={LoginScreen} key="login" />
		<Stack.Screen name="Home" component={HomeScreen} />
		<Stack.Screen name="Transactions" component={Transactions} />
		<Stack.Screen name="Profile" component={Profile} />
		<Stack.Screen name="VideoDetail" component={VideoDetail} />
		<Stack.Screen name="Plan" component={Plan} />
		<Stack.Screen name="ForgotPassword" component={ForgotPassword} />
		<Stack.Screen name="Signup" component={SignupScreen} />
		<Stack.Screen name="WatchList" component={WatchList} />
		<Stack.Screen name="Video" component={Video} />
		<Stack.Screen name="PaymentForm" component={PaymentForm} />
		<Stack.Screen name="SearchView" component={SearchView} />
		<Stack.Screen name="ProfileView" component={ProfileView} />
	</Stack.Navigator>
);

export default routes;
