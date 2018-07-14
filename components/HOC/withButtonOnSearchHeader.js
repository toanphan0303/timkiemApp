import { compose, withHandlers } from 'recompose';

const withButtonOnSearchHeader = compose(
  withHandlers({
    onPress: props => event => {
      const { go, navigation } = props;
      if (go === 'list') {
        props.dispatchLoading({ type: 'LOADING' });
        const { zip, state } = props.roomsZips;
          props.fetchRoomInMultiZips(zip, state, () => {
          props.dispatchLoading({ type: 'FINISH_LOADING' });
          props.navigation.navigate('roomList');
        });
      } else if (go === 'rooms') {
        navigation.navigate(go);
      }
    }
  })
);

export default withButtonOnSearchHeader;
