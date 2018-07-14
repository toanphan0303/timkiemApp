import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Header, Icon } from 'react-native-elements';
import { material } from 'react-native-typography';

class TimKiemHeader extends Component {
  componentDidMount() {
    this.setState({
      backScreen: this.props.parentScreen
    });
  }
  onPressBackIcon() {
    this.props.navigation.navigate(this.state.backScreen);
  }
  render() {
    return (
      <Header
        outerContainerStyles={{ backgroundColor: 'white', marginTop: 25, height: 60 }}
        innerContainerStyles={{ backgroundColor: 'white' }}
        centerComponent={
          <View>
            <Text style={[material.title]}>Tim Kiem </Text>
          </View>
        }
        leftComponent={
          <View>
            <Icon name='arrow-left' type='material-community' onPress={this.onPressBackIcon.bind(this)} size={35} />
          </View>
        }
      />
    );
  }
}

export default TimKiemHeader;
