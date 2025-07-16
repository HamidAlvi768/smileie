import { all, fork } from "redux-saga/effects";

import LayoutSaga from "./layout/saga";
import calendarSaga from "./calendar/saga";
import accountSaga from "./auth/register/saga";
import ProfileSaga from "./auth/profile/saga";
import authSaga from "./auth/login/saga";
import forgetPasswordSaga from "./auth/forgetpwd/saga"
import doctorSaga from "./doctors/saga";
import plansSaga from "./plans/saga";
import statsSaga from "./stats/saga";
import messagesSaga from "./messages/sagas";
import patientsSaga from "./patients/saga";
import tutorialsSaga from "./tutorials/saga";
import faqsSaga from './faqs/sagas';
import notificationsSaga from './notifications/saga';
import alertsSaga from './alerts/saga';

export default function* rootSaga() {
  yield all([
    //public
    fork(LayoutSaga),
    fork(calendarSaga),
    fork(accountSaga),
    fork(ProfileSaga),
    fork(authSaga),
    fork(forgetPasswordSaga),
    fork(doctorSaga),
    fork(plansSaga),
    fork(statsSaga),
    messagesSaga(),
    fork(patientsSaga),
    fork(tutorialsSaga),
    faqsSaga(),
    fork(notificationsSaga),
    fork(alertsSaga),
  ]);
}
