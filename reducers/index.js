import { combineReducers } from 'redux';
import roomsZips from './rooms_amount_reducer';
import roomsInZips from './rooms_reducer';
import roomDetail from './room_detail_reducer';
import user from './auth_reducer';
import userRoom from './user_room_reducer';
import userInfo from './user_info_reducer';
import errorAuth from './error_auth_reducer';

export default combineReducers({
  roomsZips,
  roomsInZips,
  roomDetail,
  user,
  userRoom,
  userInfo,
  errorAuth
});
