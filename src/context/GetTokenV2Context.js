import { InteractionRequiredAuthError, InteractionStatus } from '@azure/msal-browser';
import { useMsal } from '@azure/msal-react';
import { createContext } from 'react';
import { scopes } from '../dataConfig';
import useToast from '../Hook/useToast';
import { useDispatch } from 'react-redux';
import { setStatusLoading } from '../store/LoadingSlice';

export const GetTokenV2Context = createContext();

export const GetTokenV2ContextProvider = (props) => {
    const { instance, inProgress, accounts } = useMsal();
    const [contextHolder, openNotification] = useToast({ duration: 2 });
    const dispatch = useDispatch();

    function handleSuccessToast(message, callback, res) {
        dispatch(setStatusLoading(false));
        message && openNotification('success', 'Thông báo', message);
        callback && callback(res);
    }

    function handleErrorToast(message, callback) {
        dispatch(setStatusLoading(false));
        openNotification('error', 'Thông báo', message);
        callback && callback();
    }

    function getToken(api, message, callbackSuccess, callbackError, body, ...para) {
        if (inProgress === InteractionStatus.None) {
            dispatch(setStatusLoading(true));
            const accessTokenRequest = {
                scopes: scopes,
                account: accounts[0]
            };
            instance
                .acquireTokenSilent(accessTokenRequest)
                .then((accessTokenResponse) => {
                    // Acquire token silent success
                    let accessToken = accessTokenResponse.accessToken;
                    let token = {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    };
                    // Call your API with token
                    //api here
                    api(token, ...para, body)
                        .then((res) => {
                            handleSuccessToast(message, callbackSuccess, res);
                        })
                        .catch(function (error) {
                            handleErrorToast(error, callbackError);
                        });
                })
                .catch((error) => {
                    if (error instanceof InteractionRequiredAuthError) {
                        instance
                            .acquireTokenPopup(accessTokenRequest)
                            .then(function (accessTokenResponse) {
                                // Acquire token interactive success
                                let accessToken = accessTokenResponse.accessToken;
                                let token = {
                                    headers: {
                                        Authorization: `Bearer ${accessToken}`
                                    }
                                };
                                //api here
                                api(token, ...para, body).then((res) => {
                                    handleSuccessToast(message, callbackSuccess, res);
                                });
                            })
                            .catch(function (error) {
                                handleErrorToast(error, callbackError);
                            });
                    } else {
                        handleErrorToast(error, callbackError);
                    }
                });
        }
    }

    function getTokenFormData(api, message, callbackSuccess, callbackError, body, ...para) {
        if (inProgress === InteractionStatus.None) {
            dispatch(setStatusLoading(true));
            const accessTokenRequest = {
                scopes: scopes,
                account: accounts[0]
            };
            instance
                .acquireTokenSilent(accessTokenRequest)
                .then((accessTokenResponse) => {
                    // Acquire token silent success
                    let accessToken = accessTokenResponse.accessToken;
                    let token = {
                        headers: {
                            'Content-Type': 'multipart/form-data : boundary=a',
                            Authorization: `Bearer ${accessToken}`
                        }
                    };
                    // Call your API with token
                    //api here
                    api(token, ...para, body)
                        .then((res) => {
                            handleSuccessToast(message, callbackSuccess, res);
                        })
                        .catch(function (error) {
                            handleErrorToast(error, callbackError);
                        });
                })
                .catch((error) => {
                    if (error instanceof InteractionRequiredAuthError) {
                        instance
                            .acquireTokenPopup(accessTokenRequest)
                            .then(function (accessTokenResponse) {
                                // Acquire token interactive success
                                let accessToken = accessTokenResponse.accessToken;
                                let token = {
                                    headers: {
                                        'Content-Type': 'multipart/form-data : boundary=a',
                                        Authorization: `Bearer ${accessToken}`
                                    }
                                };
                                //api here
                                api(token, ...para, body).then((res) => {
                                    handleSuccessToast(message, callbackSuccess, res);
                                });
                            })
                            .catch(function (error) {
                                handleErrorToast(error, callbackError);
                            });
                    } else {
                        handleErrorToast(error, callbackError);
                    }
                });
        }
    }

    function getTokenDownload(api, nameFile, ...para) {
        const outputFilename = `${nameFile}.xlsx`;

        if (inProgress === InteractionStatus.None) {
            dispatch(setStatusLoading(true));
            const accessTokenRequest = {
                scopes: scopes,
                account: accounts[0]
            };
            instance
                .acquireTokenSilent(accessTokenRequest)
                .then((accessTokenResponse) => {
                    // Acquire token silent success
                    let accessToken = accessTokenResponse.accessToken;
                    let token = {
                        responseType: 'arraybuffer',
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            'Content-Type': 'blob'
                        }
                    };
                    // Call your API with token
                    //api here
                    api(token, ...para)
                        .then((res) => {
                            dispatch(setStatusLoading(false));
                            const url = URL.createObjectURL(new Blob([res.data]));
                            const link = document.createElement('a');
                            link.href = url;
                            link.setAttribute('download', outputFilename);
                            document.body.appendChild(link);
                            link.click();
                        })
                        .catch(function (error) {
                            handleErrorToast(error);
                        });
                })
                .catch((error) => {
                    if (error instanceof InteractionRequiredAuthError) {
                        instance
                            .acquireTokenPopup(accessTokenRequest)
                            .then(function (accessTokenResponse) {
                                // Acquire token interactive success
                                let accessToken = accessTokenResponse.accessToken;
                                let token = {
                                    responseType: 'arraybuffer',
                                    headers: {
                                        Authorization: `Bearer ${accessToken}`,
                                        'Content-Type': 'blob'
                                    }
                                };
                                //api here
                                api(token, ...para).then((res) => {
                                    dispatch(setStatusLoading(false));
                                    const url = URL.createObjectURL(new Blob([res.data]));
                                    const link = document.createElement('a');
                                    link.href = url;
                                    link.setAttribute('download', outputFilename);
                                    document.body.appendChild(link);
                                    link.click();
                                });
                            })
                            .catch(function (error) {
                                handleErrorToast(error);
                            });
                    } else {
                        handleErrorToast(error);
                    }
                });
        }
    }

    const getTokenPromise = (api, ...para) => {
        if (inProgress === InteractionStatus.None) {
            const accessTokenRequest = {
                scopes: scopes,
                account: accounts[0]
            };

            return instance
                .acquireTokenSilent(accessTokenRequest)
                .then((accessTokenResponse) => {
                    // Acquire token silent success
                    let accessToken = accessTokenResponse.accessToken;
                    let token = {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    };

                    // Call your API with token
                    return api(token, ...para)
                        .then((res) => {
                            return res;
                        })
                        .catch(function (error) {
                            // Acquire token interactive failure
                        });
                })
                .catch((error) => {
                    if (error instanceof InteractionRequiredAuthError) {
                        instance
                            .acquireTokenPopup(accessTokenRequest)
                            .then(function (accessTokenResponse) {
                                // Acquire token interactive success
                                let accessToken = accessTokenResponse.accessToken;
                                let token = {
                                    headers: {
                                        Authorization: `Bearer ${accessToken}`
                                    }
                                };

                                return api(token, ...para).then((res) => {
                                    return res;
                                });
                            })
                            .catch(function (error) {
                                // Acquire token interactive failure
                            });
                    }
                });
        }
    };

    return (
        <GetTokenV2Context.Provider
            value={{
                getToken,
                getTokenFormData,
                getTokenDownload,
                getTokenPromise
            }}
        >
            {contextHolder}
            {props.children}
        </GetTokenV2Context.Provider>
    );
};
