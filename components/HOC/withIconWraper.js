import { compose, withHandlers } from 'recompose';

const IconWrapper = compose(
  withHandlers({
    onPress: props => async(event) => {
      const { icon, index } = props;
      const { sub, email } = props.user;
      const { id, expire, price, type, creatorEmail, zip } = props.listInfo;
      if (icon === 'like') {
        try {
          const data = await props.addLikeRoom(sub, id, email, expire, price, type, zip, creatorEmail);
            if (data.addLike && data.addLike === 'successful') {
              await props.fetchUserInfo(sub, email);
            }
        } catch (e) {
          console.log('unable to Like:', e);
        }
      } else if (icon === 'disLike') {
        try {
          const data = await props.romveLikeRoom(sub, email, index);
          if (data.removeLike && data.removeLike === 'successful') {
            await props.fetchUserInfo(sub, email);
          }
        } catch (e) {
          console.log('unable to disLike:', e);
        }
      }
    }
  })
);

export default IconWrapper;
