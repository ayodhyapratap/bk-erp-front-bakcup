import lockr from 'lockr';
import axios from 'axios';
import {AUTH_TOKEN, PASSWORD, ROLE, EMAIL, PRACTICE, GROUP} from "../constants/dataKeys";
import {handleErrorResponse, makeURL} from "./common";
import {LOGIN_URL} from "../constants/api";


export const loggedInUser = function () {
    let role = lockr.get(ROLE);
    let token = lockr.get(AUTH_TOKEN);
    if (role && token) {
        return role;
    }
    return null;
};

export const loggedInUserGroup = function () {
    let role = lockr.get(ROLE);
    let token = lockr.get(AUTH_TOKEN);
    let group = lockr.get(GROUP);
    if (role && token&& group) {
        return group;
    }
    return null;
};
export const loggedInUserPractices = function () {
    let role = lockr.get(ROLE);
    let token = lockr.get(AUTH_TOKEN);
    let practice = lockr.get(PRACTICE);
    console.log(practice)
    let practices={};
    practice.forEach(function(clinic){
      practices[clinic.practice]=clinic
    })
    console.log(practices);
    if (role && token&&practice) {
        return practices ;
    }
    return null;
};
export const loggedInactivePractice = function () {
   let firstPractice= lockr.get(PRACTICE);
   if(firstPractice){
   console.log(firstPractice[0].practice);
   return firstPractice[0].practice;}
   else return null
}


export const loggedInPermissions = function (){
  let  groups= lockr.get(GROUP);
  let permissions ={}
  if(groups)
  groups.forEach(function(group){
  group.permissions.forEach(function(permission){
    permissions[permission.codename] = true
  });
})
  return permissions;
}


export const logInUser = function (data, successFn, errorFn) {
  console.log("workign");
    // lockr.set(USER, {
    //   [USERNAME]: 'username',
    //   [USER_TYPE]: [ADMIN_ABBREV, MANAGER_ABBREV, ANALYST_ABBREV]
    // });
    // successFn();
    var data = {
        [EMAIL]: data.email,
        [PASSWORD]: data.password
    };
    axios.post(makeURL(LOGIN_URL), data).then(function (response) {
        // console.log(response);
        let data = response.data;
        lockr.set(ROLE, data.user);
        lockr.set(AUTH_TOKEN, data.token);
        lockr.set(GROUP, data.group)
        lockr.set(PRACTICE, data.practice)
        console.log(data.practice);
        successFn()
    }).catch(function (error) {
        console.log(error);
        handleErrorResponse(error);
        errorFn();
    })
};
export const saveAuthToken = function(response,successFn){
    let data = response;
    lockr.set(ROLE, data.id);
    lockr.set(AUTH_TOKEN, data.token);
    successFn()
}

export const logOutUser = function (successFn, errorFn) {
    // axios.post(makeURL(LOGOUT_URL), {}).then(function (response) {
    //   let data = response.data;
    //   console.log('loginResponse', data);
    //   if (data.status == SUCCESS) {
    //     lockr.rm(USER);
    //     successFn(data);
    //   } else {
    //     errorFn();
    //   }
    // }).catch(function (error) {
    //   console.log(error);
    //   errorFn();
    // })
    lockr.rm(ROLE);
    lockr.rm(AUTH_TOKEN);
    lockr.rm(PRACTICE);
    lockr.rm(GROUP);
    successFn();
};
export const getAuthToken = function () {
    let token = lockr.get(AUTH_TOKEN);
    return token;

};
export const checkRole = function (role) {
    let roles = lockr.get(ROLE);
    if (roles[role] === undefined || roles[role] === '' || !roles[role]) {
        return false;
    }
    return roles[role];
}
