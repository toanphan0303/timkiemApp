import { combineReducers } from 'redux';
import roomsZips from './rooms_reducer';
import roomsInZips from './rooms_zip_reducer';
import roomDetail from './room_detail_reducer';

export default combineReducers({
  roomsZips,
  roomsInZips,
  roomDetail
});
