import {
  CognitoUserPool,
  CognitoUserAttribute,
  AuthenticationDetails,
  CognitoUser
} from 'amazon-cognito-identity-js';
import { AsyncStorage } from 'react-native';
import {
  ERROR_SIGN_UP,
  SIGN_UP_SUCCESS
} from './types';
import { UserPoolId, ClientId } from '../key/cognitoKey';

const poolData = {
    UserPoolId,
    ClientId
};
const userPool = new CognitoUserPool(poolData);

export const logInCognitoPool = (email, password, callback) => async(dispatch) => {
  const authenticationDetails = new AuthenticationDetails({
        Username: email,
        Password: password,
    });

    const userData = {
        Username: email,
        Pool: userPool
    };
    const cognitoUser = new CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            console.log(result);
            console.log('access token + ' + result.getAccessToken().getJwtToken());
            console.log('id token + ' + result.getIdToken().getJwtToken());
            console.log('refresh token + ' + result.getRefreshToken().getToken());
        },
        onFailure: function(err) {
            console.log(err);
        },
  });
};

export const signUpCognitoPool = (email, password, firstName, lastName, callback) => async(dispatch) => {
    let attributeList = [];
    const dataEmail = {
        Name: 'email',
        Value: email
    };
    const dataFirstName = {
      Name: 'custom:firstName',
      Value: firstName
    };
    const dataLastName = {
      Name: 'custom:lastName',
      Value: lastName
    };
    const attributeEmail = new CognitoUserAttribute(dataEmail);
    const attributeFirstName = new CognitoUserAttribute(dataFirstName);
    const attributeLastName = new CognitoUserAttribute(dataLastName);
    attributeList.push(attributeEmail, attributeFirstName, attributeLastName);
    userPool.signUp(email, password, attributeList, null, (err, result) => {
        if (err) {
            dispatch({ type: ERROR_SIGN_UP, payload: err });
            return;
        }
        cognitoUser = result.user;
        dispatch({ type: SIGN_UP_SUCCESS, payload: cognitoUser.getUsername() });

        callback();
    });
};
