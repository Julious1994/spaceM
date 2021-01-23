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
import PaymentView from './pages/Payment/PaymentView';
import SearchView from './pages/SearchMovie';
import ProfileView from './pages/Profile/ProfileView';
import ChangePassword from './pages/Profile/ChangePassword';
import Notification from './pages/Notification';
// support
import Support from './pages/Support/Support';
import TicketForm from './pages/Support/TicketForm';
import TicketList from './pages/Support/TicketList';
import TicketView from './pages/Support/TicketView';
import MobileLogin from './pages/MobileLogin';
import LoginMenu from './pages/LoginMenu';



const routes = (Stack) => (
	<Stack.Navigator screenOptions={{headerShown: false}}>
		<Stack.Screen name="LoginMenu" component={LoginMenu} key="loginMenu" />
		<Stack.Screen name="Login" component={LoginScreen} key="login" />
		<Stack.Screen name="MobileLogin" component={MobileLogin} />
		<Stack.Screen name="Support" component={Support} />
		<Stack.Screen name="TicketForm" component={TicketForm} />
		<Stack.Screen name="TicketList" component={TicketList} />
		<Stack.Screen name="TicketView" component={TicketView} />
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
		<Stack.Screen name="PaymentView" component={PaymentView} />
		<Stack.Screen name="SearchView" component={SearchView} />
		<Stack.Screen name="ProfileView" component={ProfileView} />
		<Stack.Screen name="ChangePassword" component={ChangePassword} />
		<Stack.Screen name="Notification" component={Notification} />

	</Stack.Navigator>
);

export default routes;
