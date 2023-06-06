import React, { useEffect, useState } from 'react';
import FormGetInput from '../FormGetInput';
import { formFsofterInfomationConfig } from './formFsofterInfomationConfig';
import './style.scss';
import { formConfigUserOnlySee } from './formConfigUserOnlySee';
import { useSelector } from 'react-redux';

const FromUserProfileConfig = ({ form, initialValues, handleSubmitform, viewMode, isMyAccount, isSameDepartment}) => {
    const memoriedForm = () => {
        if (isMyAccount) {
            return formFsofterInfomationConfig
        } else {
            let displayUI = formConfigUserOnlySee;
            const formFsofterUserOnlyCanSee = formFsofterInfomationConfig.slice(0, 3);
            const formFsofterProsonalInfo = formFsofterInfomationConfig.slice(3).map((item) => ({
                ...item,
                readOnly: true,
                disabled: true
            }));

            switch (viewMode) {
                case 2:
                    if (isSameDepartment) {
                        displayUI =  [...formFsofterUserOnlyCanSee, ...formFsofterProsonalInfo];
                    }
                    break;
                case 3:  
                    displayUI =  [...formFsofterUserOnlyCanSee, ...formFsofterProsonalInfo];
                    break;            
                default:
                    break;
            }
            return displayUI;
        }
    };

    const formTemplate = memoriedForm();
    return (
        <div className="general-info">
            <FormGetInput
                initialValues={initialValues}
                form={form}
                items={formTemplate}
                isSameDepartment={isSameDepartment}
                viewMode={viewMode}
                isMyAccount={isMyAccount}
                onSubmit={handleSubmitform}
            />
        </div>
    );
};

export default FromUserProfileConfig;
