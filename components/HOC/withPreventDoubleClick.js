import { compose, withHandlers } from 'recompose';
import _ from 'lodash';


const withPreventDoubleClick = compose(
  withHandlers({
    onPress: props => e => {
      const { onPress } = props;
      _.debounce(() => onPress && onPress(), 300, { leading: true, trailing: false });
    }
  })
);

export default withPreventDoubleClick;
