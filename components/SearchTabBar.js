import React, { Component } from 'react';
import { SearchBar } from 'react-native-elements';
import { View, TouchableOpacity } from 'react-native';

class SearchTabBar extends Component {
  onPressSearchBar() {
    this.props.navigation.navigate('roomSearch');
  }
  render() {
    return (
      <TouchableOpacity onPress={this.onPressSearchBar.bind(this)} style={{ backgroundColor: 'black', zIndex: 10}}>
        <View>
        <SearchBar
          onFocus={this.onPressSearchBar.bind(this)}
          lightTheme
          placeholder='City or Zip code'
          containerStyle={style}
        />
        </View>
      </TouchableOpacity>
    );
  }
}
const style = {
  backgroundColor: 'white',
  width: 320,
  height: 60,
};

export default SearchTabBar;
