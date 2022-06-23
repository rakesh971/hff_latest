import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { signOut ,signIn } from 'next-auth/react';
const qs = require('qs');
const axios = require('axios');
import https from 'https';
import { Api } from '../Common/Api/Api';

const agent = new https.Agent({
    rejectUnauthorized: false,
});

const useAxios = () => {
    const [responseData, setResponseData] = useState(null);
    const [responseType, setResponseType] = useState(null);

    const getData = async (headPoint, bodyData, rType, show, method, isForm, token) => {
        setResponseType(rType);
        try {
            const response = await axios({
                url: `${Api.baseurl}/${headPoint}`,
                method: method,
                data: method == 'get' ? '' : isForm ? bodyData : qs.stringify(bodyData),
                params: method !== 'get' ? '' : bodyData,
                paramsSerializer: (params) => {
                    return qs.stringify(params);
                },
                headers: {
                    'Content-Type': isForm ? 'multipart/form-data' : 'application/x-www-form-urlencoded',
                    Authorization: token ? `Bearer ${token}` : '',
                },
                httpsAgent: agent,
            });
            setResponseData(response.data);
            if (response.data.error === 1 && show) {
                toast.success(response.data.msg);
            }
            if (response.data.error === 0) {
                toast.error(response.data.msg);
            }
        } catch (err) {
            console.log('err');
            console.log(err);
            toast.error('Something went wrong');
            setResponseData({ error: null });
            setResponseType(null)
        }
    };
    console.log(responseData)
    if (responseData !== null) {
        if (responseData.error === 8) {
            window.location.replace('/otp');
        }
        if (responseData.error === 5) {
            signOut({
                redirect: true,
                callbackUrl: `${window.location.origin}/login`,
            });
        }
        if (responseData.error === 4) {
            window.location.replace('/reset-password');
        }
        if (responseData.error === 6) {
            window.location.replace('/user/pay-bill');
        }
        if (responseData.error === 7) {
            console.log(responseData)
            window.location.replace('/block-user');
        }
        if (responseData.error === 10) {
            localStorage.setItem('erRor', JSON.stringify({code:10,msg:responseData.msg}));
            signOut({
                redirect: true,
                callbackUrl: `${window.location.origin}/login`,
            });
        }
    }

    return [getData, responseData, responseType, Api.baseurl];
};

export default useAxios;
