import { useMsal } from '@azure/msal-react';
import { useEffect, useState } from 'react';
import { InteractionRequiredAuthError, InteractionStatus } from '@azure/msal-browser';
import { useHistory } from 'react-router-dom';
import { scopes } from '../dataConfig';
import { useDispatch, useSelector } from 'react-redux';
import { setStatusLoading } from '../store/LoadingSlice';

const useRefreshToken = (api, ...parameter) => {
    const { instance, inProgress, accounts } = useMsal();
    const [data, setData] = useState(null);
    const navigate = useHistory();
    const [refresh, setRefresh] = useState();
    // const { DepartmentID } = useSelector((a) => a.DepartmentSettingSlice);
    const dispatch = useDispatch();
    const handleCallApi = (accessTokenResponse, isMounted) => {
        // Acquire token success
        // let accessToken = accessTokenResponse.accessToken;

        // let token = {
        //     headers: {
        //         Authorization: `Bearer ${accessToken}`
        //     }
        // };

        // Call your API with token
        api(token, ...parameter)
            .then((res) => {
                if (isMounted) setData(res);
                setTimeout(() => {
                    dispatch(setStatusLoading(false));
                }, 300);
            })
            .catch(() => {
                dispatch(setStatusLoading(false));
            });
    };

    useEffect(() => {
        api(...parameter)
            .then((res) => {
                setData(res);
                setTimeout(() => {
                    dispatch(setStatusLoading(false));
                }, 300);
            })
            .catch(() => {
                dispatch(setStatusLoading(false));
            });
        /* 
        const controller = new AbortController();
        let isMounted = true;
        dispatch(setStatusLoading(true));
        if (inProgress === InteractionStatus.None) {
            const accessTokenRequest = {
                scopes: scopes,
                account: accounts[0]
            };
            instance
                .acquireTokenSilent(accessTokenRequest)
                .then((accessTokenResponse) => {
                })
                .catch((error) => {
                    dispatch(setStatusLoading(false));
                    if (error instanceof InteractionRequiredAuthError) {
                        instance
                            .acquireTokenPopup(accessTokenRequest)
                            .then(function (accessTokenResponse) {
                                handleCallApi(accessTokenResponse, isMounted);
                            })
                            .catch(function (error) {
                                dispatch(setStatusLoading(false));
                                // Acquire token interactive failure
                                navigate.replace('/page-error-503');
                            });
                    } else {
                        navigate.replace('/page-error-503');
                    }
                });
        }
        */
        return () => {
            // isMounted = false;
            dispatch(setStatusLoading(false));
            // controller.abort();
        };
    }, [...parameter, refresh]);

    return [data, setRefresh, setData];
};

export default useRefreshToken;
