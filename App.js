import React from 'react';
import { StyleSheet, View, Animated, Easing } from 'react-native';
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import { Provider } from 'react-redux';
import store from './store';
import Jobs from './screens/Jobs';
import Rooms from './screens/Rooms';
import RoomList from './screens/RoomList';
import RoomDetail from './screens/RoomDetail';
import MyProfile from './screens/MyProfile';


const MainNavigator = createBottomTabNavigator({
  rooms: {
    screen: createStackNavigator({
      rooms: { screen: Rooms },
      roomList: { screen: RoomList },
      roomDetail: { screen: RoomDetail }
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
  myProfile: { screen: MyProfile }
},
{
  navigationOptions: {
    tabBarOptions: {
      activeTintColor: '#rgb(90, 200, 250)',
      inactiveTintColor: 'gray',
      labelStyle: {
        fontSize: 12
      }
    }
  },
});

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <View style={styles.container}>
          <MainNavigator />
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
