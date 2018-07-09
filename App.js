import React from 'react';
import { StyleSheet, View, Animated, Easing, Platform } from 'react-native';
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import { Provider } from 'react-redux';
import { Icon } from 'react-native-elements';
import store from './store';
import Jobs from './screens/Jobs';
import Rooms from './screens/Rooms';
import RoomList from './screens/RoomList';
import RoomDetail from './screens/RoomDetail';
import MyProfile from './screens/MyProfile';
import RoomSearch from './screens/RoomSearch';
import Login from './screens/Login';
import SignUp from './screens/SignUp';
import RoomPost from './screens/RoomPost';
import RoomPostSummary from './screens/RoomPostSummary';
import RoomFavorite from './screens/RoomFavorite';

const ProfileTab = createStackNavigator({
  myProfile: {
    screen: MyProfile,
    path: 'myprofile'
  },
  login: { screen: Login },
  signup: { screen: SignUp },
  roomFavorite: { screen: RoomFavorite },
  roomPost: { screen: RoomPost },
  roomPostSummary: { screen: RoomPostSummary },
}, {
  headerMode: 'none',
  transitionConfig: () => ({
    transitionSpec: {
      duration: 750,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
    },
    screenInterpolator: sceneProps => {
      const { layout, position, scene } = sceneProps;
      const { index } = scene;

      const height = layout.initHeight;
      const translateY = position.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: [height, 0, 0],
      });

      const opacity = position.interpolate({
        inputRange: [index - 1, index - 0.99, index],
        outputRange: [0, 1, 1],
      });

      return { opacity, transform: [{ translateY }] };
    },
  }),
});
const prefixProfile = Platform.OS == 'android' ? 'timkiem://timkiem/mainprofile/' : 'timkiem://mainprofile/';
const MainNavigator = createBottomTabNavigator({
  rooms: {
    navigationOptions: {
        title: 'Home',
        tabBarIcon: ({ tintColor }) => {
          return (
            <View><Icon name="home" size={24} color={tintColor} /></View>
          );
        }
      },
    screen: createStackNavigator({
      rooms: { screen: Rooms },
      roomList: { screen: RoomList },
      roomDetail: { screen: RoomDetail },
      roomSearch: { screen: RoomSearch }
    }, {
      headerMode: 'none',
      transitionConfig: () => ({
        transitionSpec: {
        duration: 750,
        easing: Easing.out(Easing.poly(4)),
        timing: Animated.timing,
        useNativeDriver: true,
      },
      screenInterpolator: sceneProps => {
          const { position, layout, scene, index, scenes } = sceneProps;
          const toIndex = index;
          const thisSceneIndex = scene.index;
          const height = layout.initHeight;
          const width = layout.initWidth;

          const translateX = position.interpolate({
            inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
            outputRange: [width, 0, 0]
          });

          const translateY = position.interpolate({
            inputRange: [0, thisSceneIndex],
            outputRange: [height, 0]
          });

          const slideFromRight = { transform: [{ translateX }] };
          const slideFromBottom = { transform: [{ translateY }] };

          const lastSceneIndex = scenes[scenes.length - 1].index;

          // Test whether we're skipping back more than one screen
          if (lastSceneIndex - toIndex > 1) {
            // Do not transoform the screen being navigated to
            if (scene.index === toIndex) return;
            // Hide all screens in between
            if (scene.index !== lastSceneIndex) return { opacity: 0 };
            // Slide top screen down
            return slideFromBottom;
          }

          return slideFromRight;
        },
      })
    })
  },
  jobs: { screen: Jobs },
  myProfile: {
    screen: () => (<ProfileTab uriPrefix={prefixProfile} />),
    navigationOptions: {
      title: 'My Profile',
      tabBarIcon: ({ tintColor }) => {
        return (
          <View><Icon name="person" size={24} color={tintColor} /></View>
        );
      }
    },
  },
},
{
  navigationOptions: {
    tabBarOptions: {
      activeTintColor: '#rgb(90, 200, 250)',
      inactiveTintColor: 'gray',
      labelStyle: {
        fontSize: 12
      },
      tabBarLabel: 'Home',
      tabBarIcon: ({ tintColor }) => (
        <View><Icon name="home" size={24} color={tintColor} /></View>
      )
    }
  },
});
const prefix = Platform.OS === 'android' ? 'timkiem://timkiem/' : 'timkiem://';
export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <View style={styles.container}>
          <MainNavigator uriPrefix={prefix} />
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
