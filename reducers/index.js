import { combineReducers } from 'redux';
import roomsZips from './rooms_amount_reducer';
import roomsInZips from './rooms_reducer';
import roomDetail from './room_detail_reducer';
import signupReducer from './signup_reducer';

export default combineReducers({
  roomsZips,
  roomsInZips,
  roomDetail,
  signupReducer
});
