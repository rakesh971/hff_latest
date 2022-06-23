import { useState } from 'react';
import { Api } from '../Common/Api';
import { toast } from 'react-toastify';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
const qs = require('qs');

const useServer = () => {
    const router = useRouter()
    const [Loading, setLoading] = useState(false);

    const callApi = async (headPoint, bodyData, show, method, isForm, token) => {
        setLoading(true);
        try {
            let response = await fetch(Api.baseurl(headPoint, (method !== 'get' ? '' : bodyData)), {
                method: method,
                ...(
                    method !== 'get' &&
                    {
                        body: isForm ? bodyData : qs.stringify(bodyData, { arrayFormat: 'brackets' })
                    }
                ),
                headers: {
                    ...(!isForm && { 'Content-Type': 'application/x-www-form-urlencoded' }),
                    'Authorization': token ? `Bearer ${token}` : '',
                },
            });

            response = await response.json();

            if (show && (response.error === 1 || response.error === 2)) {
                toast(response.msg, {
                    position: "bottom-center",
                    type: "success",
                    autoClose: 4000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
            if (response.error === 0) {
                toast(response.msg, {
                    position: "bottom-center",
                    type: "error",
                    autoClose: 4000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
            if (response.error === 5) {
                await signOut({
                    redirect: false
                });
                router.push('/login')
            }
            setLoading(false);
            return response;
        } catch (err) {
            setLoading(false);
            return { error: 0, data: null };
        }
    }

    return [
        callApi,
        Loading,
        setLoading,
    ];
}

export default useServer