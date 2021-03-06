import {
  FETCH_ROOMS_IN_ZIP,
  FETCH_ROOMS_IN_MULTI_ZIPS,
  FETCH_ROOMS_IN_CITY,
  ERROR_FETCH
} from '../actions/types';

const INIATIAL_STATE = [];

export default function (state = INIATIAL_STATE, action) {
  switch (action.type) {
    case FETCH_ROOMS_IN_ZIP:
      return action.payload;
    case FETCH_ROOMS_IN_MULTI_ZIPS:
      return action.payload;
    case FETCH_ROOMS_IN_CITY:
      return action.payload;
    case ERROR_FETCH:
      return state;
    default:
      return state;
  }
}
