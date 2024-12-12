// Make sure this is defined in your .env file as VITE_SERVER_URL
export const HOST = import.meta.env.VITE_SERVER_URL;

export const AUTH_ROUTES = `${HOST}/api/auth`;

export const SIGNUP_ROUTE = `${AUTH_ROUTES}/signup`;
export const SIGNIN_ROUTE = `${AUTH_ROUTES}/signin`;
export const GET_USER_INFO = `${AUTH_ROUTES}/user-info`;
export const UPDATE_PROFILE_ROUTE = `${AUTH_ROUTES}/update-profile`;
export const ADD_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/add-profile-image`;
export const REMOVE_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/remove-profile-image`;
export const LOGOUT_ROUTE =  `${AUTH_ROUTES}/logout`;




//Contect Routes
export const CONTACTS_ROUTE =  `${HOST}/api/contacts`;

export const SEARCH_CONTACTS_ROUTE =  `${CONTACTS_ROUTE}/search-contacts`;
export const GET_DM_CONTACTS_ROUTE = `${CONTACTS_ROUTE}/get-contacts-for-DM`;



// Get-messages Routes
export const MESSAGES_ROUTE     =  `${HOST}/api/messages` ;
export const GET_MESSAGES_ROUTE =  `${MESSAGES_ROUTE}/get-messages` ;
export const UPLOAD_FILE_ROUTE  =  `${MESSAGES_ROUTE}/upload-file` ;