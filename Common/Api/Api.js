import { Constants } from '../Constants';
  const qs = require('qs');

  export const Api = {
    baseurl: (headPoint, params) => `${Constants.API_PATH}/${headPoint}${params ? `?${qs.stringify(params)}` : ""}`,
    appurl: (headPoint, params) => `${Constants.APP_PATH}/${headPoint}${params ? `?${qs.stringify(params)}` : ""}`,
    imageUrl: (url) => `${Constants.API_PATH}${url}`,
  };