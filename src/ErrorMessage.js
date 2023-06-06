import React from 'react';

const ErrorMessage = ({ message, code }) => {
    let Error = '';
    switch (code) {
        case 1000:
            Error = 'Required parameters are missing.' + `(${message})`;
        case 1001:
            Error = 'Invalid classifier ID, there is no such item.' + `(${message})`;
        case 1002:
            Error = 'A parameter must have a unique value.' + `(${message})`;
        case 1003:
            Error = 'Inconsistent parameter set.' + `(${message})`;
        case 1004:
            Error = 'Incorrect data type or format.' + `(${message})`;
        case 1005:
            Error = 'Malformed request.' + `(${message})`;
        case 1006:
            Error = 'Invalid value.' + `(${message})`;
        case 1007:
            Error =
                'Document has been confirmed and its contents and warehouse ID cannot be edited any more.' +
                `(${message})`;
        case 1008:
            Error =
                'Multiple matches found, all have the same attribute value. No records will be updated.' +
                `(${message})`;
        case 1009:
            Error = 'No records found with this attribute value.' + `(${message})`;
        default:
    }

    return (
        <>
            <div className="error">
                <p>{Error}</p>
            </div>
        </>
    );
};

export default ErrorMessage;
