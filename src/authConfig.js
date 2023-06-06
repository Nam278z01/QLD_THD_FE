import { LogLevel } from '@azure/msal-browser';
import { msalGoWhere } from './dataConfig';

export const msalConfig = {
    auth: {
        clientId: '2a420303-0ef2-42d4-84af-6e08cd68fb78',
        authority: 'https://login.microsoftonline.com/f01e930a-b52e-42b1-b70f-a8882b5d043b',
        redirectUri: msalGoWhere
    },
    cache: {
        cacheLocation: 'sessionStorage', // This configures where your cache will be stored
        storeAuthStateInCookie: false // Set this to "true" if you are having issues on IE11 or Edge
    },
    system: {
        loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
                if (containsPii) {
                    return;
                }
                switch (level) {
                    case LogLevel.Error:
                        console.error(message);
                        return;
                    case LogLevel.Info:
                        // console.info(message);
                        return;
                    case LogLevel.Verbose:
                        console.debug(message);
                        return;
                    case LogLevel.Warning:
                        console.warn(message);
                        return;
                }
            }
        }
    }
};

export const loginRequest = {
    scopes: ['User.Read', 'User.ReadBasic.All', 'User.ReadWrite']
};
