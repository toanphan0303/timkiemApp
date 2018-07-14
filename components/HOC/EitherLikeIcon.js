import React from 'react';
import { Icon } from 'react-native-elements';
import { compose, renderComponent, branch, withProps, renderNothing } from 'recompose';
import IconWrapper from './withIconWraper';

const AbleLikeIcon = (props) => (
  <Icon
    name='heart-outline'
    color='blue'
    type='material-community'
    size={35}
    onPress={props.onPress}
  />
);

const AbleDisLikeIcon = (props) => (
  <Icon
    name='heart'
    color='tomato'
    type='material-community'
    size={35}
    onPress={props.onPress}
  />
);

const WrapAbleLikeIcon = IconWrapper(AbleLikeIcon);
const WrapAbleDisLikeIcon = IconWrapper(AbleDisLikeIcon);

const renderIcon = compose(
  withProps(props => {
    return {
      ownProps: props,
    };
  }),
  branch(
    ({ login }) => !login,
    renderNothing,
    branch(
      ({ ownProps }) => ownProps.index >= 0,
      renderComponent(({ ownProps }) => <WrapAbleDisLikeIcon {...ownProps} icon='disLike' />),
      renderComponent(({ ownProps }) => <WrapAbleLikeIcon {...ownProps} icon='like' />)
    )
  )
);

export default renderIcon;
