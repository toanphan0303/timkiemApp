import React from 'react';
import { View, Image } from 'react-native';
import {
  withState,
  withHandlers,
  lifecycle,
  compose
} from 'recompose';
import { Icon } from 'react-native-elements';

const ImageDisplay = ({ url, index, onPressIcon }) => (
  <View key={index} style={styles.container}>
    <View style={styles.iconStyle}>
      <Icon
        name='delete'
        type='font-awsome'
        onPress={onPressIcon}
        color= 'white'
      />
    </View>
    <Image
      source={{ uri: url }}
      style={styles.imageStyle}
    />
  </View>
);

const withImageDisplay = compose(
  withState('url', 'setUrl', null),
  withState('index', 'setIndex', null),

  withHandlers({
    onPressIcon: props => event => {
      console.log('press icon', props);
    }
  }),
  lifecycle({
    componentWillMount() {
      this.props.setUrl(this.props.imageUrl);
      this.props.setIndex(this.props.pos);
    }
  })
);

const styles = {
  imageStyle: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: 'white'
  },
  iconStyle: {
    position: 'absolute',
    zIndex: 3,
    margin: 5,
    marginLeft: 170,
    backgroundColor: 'gray'
  }
};
export default (withImageDisplay)(ImageDisplay);
