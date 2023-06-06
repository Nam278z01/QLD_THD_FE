import { createContext } from 'react';
import { useMsal } from '@azure/msal-react';
import { InteractionRequiredAuthError, InteractionStatus } from '@azure/msal-browser';
import Swal from 'sweetalert2';
import { scopes } from '../dataConfig';
import { useSelector } from 'react-redux';

export const GetTokenContext = createContext();

export const GetTokenContextProvider = (props) => {
    const { instance, inProgress, accounts } = useMsal();
    const { DepartmentID } = useSelector((a) => a.DepartmentSettingSlice);

    function getToken(api, message, successRun, errorRun, ...para) {
        if (inProgress === InteractionStatus.None) {
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
                    api(token, DepartmentID, ...para)
                        .then(() => {
                            {
                                message &&
                                    Swal.fire({
                                        icon: 'success',
                                        title: message
                                    });
                            }
                            successRun && successRun();
                        })
                        .catch(function (error) {
                            // Acquire token interactive failure
                            Swal.fire({
                                icon: 'error',
                                title: error
                            });
                            errorRun && errorRun();
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
                                api(token, DepartmentID, ...para).then(() => {
                                    {
                                        message &&
                                            Swal.fire({
                                                icon: 'success',
                                                title: message
                                            });
                                    }
                                    successRun && successRun();
                                });
                            })
                            .catch(function (error) {
                                // Acquire token interactive failure
                                Swal.fire({
                                    icon: 'error',
                                    title: error
                                });
                                errorRun && errorRun();
                            });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: error
                        });
                        errorRun && errorRun();
                    }
                });
        }
    }

    function getTokenFormData(api, message, successRun, errorRun, ...para) {
        if (inProgress === InteractionStatus.None) {
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
                    api(token, DepartmentID, ...para)
                        .then(() => {
                            Swal.fire({
                                icon: 'success',
                                title: message
                            });
                            successRun && successRun();
                        })
                        .catch(function (error) {
                            // Acquire token interactive failure
                            Swal.fire({
                                icon: 'error',
                                title: error
                            });
                            errorRun && errorRun();
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
                                api(token, DepartmentID, ...para).then(() => {
                                    Swal.fire({
                                        icon: 'success',
                                        title: message
                                    });
                                    successRun && successRun();
                                });
                            })
                            .catch(function (error) {
                                // Acquire token interactive failure
                                Swal.fire({
                                    icon: 'error',
                                    title: error
                                });
                                errorRun && errorRun();
                            });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: error
                        });
                        errorRun && errorRun();
                    }
                });
        }
    }

    function getTokenDownload(api, nameFile) {
        const outputFilename = `${nameFile}.xlsx`;

        if (inProgress === InteractionStatus.None) {
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
                    api(token, DepartmentID)
                        .then((res) => {
                            const url = URL.createObjectURL(new Blob([res.data]));
                            const link = document.createElement('a');
                            link.href = url;
                            link.setAttribute('download', outputFilename);
                            document.body.appendChild(link);
                            link.click();
                        })
                        .catch(function (error) {
                            // Acquire token interactive failure
                            Swal.fire({
                                icon: 'error',
                                title: error
                            });
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
                                api(token, DepartmentID).then((res) => {
                                    const url = URL.createObjectURL(new Blob([res.data]));
                                    const link = document.createElement('a');
                                    link.href = url;
                                    link.setAttribute('download', outputFilename);
                                    document.body.appendChild(link);
                                    link.click();
                                });
                            })
                            .catch(function (error) {
                                // Acquire token interactive failure
                                Swal.fire({
                                    icon: 'error',
                                    title: error
                                });
                            });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: error
                        });
                    }
                });
        }
    }

    return (
        <GetTokenContext.Provider
            value={{
                getToken,
                getTokenFormData,
                getTokenDownload
            }}
        >
            {props.children}
        </GetTokenContext.Provider>
    );
};
