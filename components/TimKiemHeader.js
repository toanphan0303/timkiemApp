import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Header } from 'react-native-elements';
import { material } from 'react-native-typography';

class TimKiemHeader extends Component {
  render() {
    return (
      <Header
        outerContainerStyles={{ backgroundColor: 'white', marginTop: 25, height: 60 }}
        innerContainerStyles={{ backgroundColor: 'white' }}
        leftComponent={
          <View>
            <Text style={[material.title]}>Tim Kiem </Text>
          </View>
        }
      />
    );
  }
}

export default TimKiemHeader;
