import { LogoutActionTypes } from '../actions/root-store.action';

// !Using strongly typed actions in the reducer function
export function rootStoreReducer(reducer) {
  return (state, action) => {
    return reducer(action.type === LogoutActionTypes.CLEAR_DATA_ON_LOGOUT ?  undefined : state, action);
  };
}
