import React, { Component } from 'react';
import { SearchBar } from 'react-native-elements';
import { View } from 'react-native';

class SearchTabBar extends Component {
  render() {
    return (
      <View>
        <SearchBar
          lightTheme
          placeholder='City, ZIP'
          containerStyle={style}
        />
      </View>
    );
  }
}
const style = {
  backgroundColor: 'white',
  width: 320,
  height: 60,
};

export default SearchTabBar;
