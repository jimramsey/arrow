import { combineReducers } from "redux";
import alert from "./alert";
import auth from "./auth";
import profile from "./profile";
import trade from "./trade";

export default combineReducers({
  alert,
  auth,
  profile,
  trade,
});
