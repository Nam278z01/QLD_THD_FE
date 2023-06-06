import axios from 'axios';
import { Server } from '../dataConfig';

export const getAllTemplate = async (token, DepartmentID) => {
    try {
        const res = await axios.get(`${Server}/template/?DepartmentID=${DepartmentID}&sort=CreatedDate:DESC`, token);
        const listTemplate = res.data.data.rows;
        let newlistTemplate = listTemplate.map((x) => ({
            label: x.Name,
            value: x.ID,
            Header: splitRawData(x.Header),
            SampleData: splitRawData(x.SampleData)
        }));
        return newlistTemplate;
    } catch (err) {
        throw err.response.data.error;
    }
};
export const getAllTemplateAPI = async (token, DepartmentID) => {
    try {
        const res = await axios.get(`${Server}/api?DepartmentID=${DepartmentID}&sort=CreatedDate:DESC`, token);
        const listTemplate = res.data.data.rows;
        let newlistTemplate = listTemplate.map((x) => ({
            label: x.Name,
            value: x.ID,
            Account: x.AccountPropertyRefer,
            Caculator: x.FormulaCaculator,
            ProjectCode: x.ProjectIDPropertyRefer,
            NoteRow: x.NotePropertyRefer,
            Condition: x.Condition
        }));
        return newlistTemplate;
    } catch (err) {
        throw err.response.data.error;
    }
};
export const getDefaultTemplateAPI = async (token, DepartmentID, id) => {
    try {
        const res = await axios.get(`${Server}/api/${id}?DepartmentID=${DepartmentID}`, token);
        const listTemplate = res.data.data;
        let newlistTemplate = {
            Name: listTemplate.Name,
            Method: listTemplate.Method,
            Url: listTemplate.Url,
            Params: listTemplate.Params,
            Authorization: listTemplate.Authorization,
            UserName: listTemplate.UserName,
            Password: listTemplate.Password,
            Token: listTemplate.Token,
            TimeRun: listTemplate.TimeRun
        };
        return newlistTemplate;
    } catch (err) {
        throw err.response.data.error;
    }
};
export const getDataSyncAPI = async (token, DepartmentID, ruleid, apiID) => {
    try {
        const res = await axios.get(
            `${Server}/synchronize/api?RuleID=${ruleid}&DepartmentID=${DepartmentID}&ApiID=${apiID}`,
            token
        );
        const listTemplate = res.data.data;
        let newlistTemplate = {
            Header: splitRawData(listTemplate.Api?.Header),
            SampleData: splitRawData(listTemplate.Api?.SampleData),
            Api: listTemplate.Api,
            ApiID: listTemplate.ID,
            Account: listTemplate.ApplyFor,
            Caculator: listTemplate.CaculationFormula,
            ProjectCode: listTemplate.ProjectID,
            NoteRow: listTemplate.Note,
            Condition: listTemplate.Condition,
            TimeRun: listTemplate.TimeRun
        };
        return newlistTemplate;
    } catch (err) {
        // return [];
        throw err.response.data.error;
    }
};
export const getDefaultDataSyncAPI = async (token, DepartmentID, ruleid, apiID) => {
    try {
        const res = await axios.get(
            `${Server}/synchronize/findRuleApi?RuleID=${ruleid}&DepartmentID=${DepartmentID}`,
            token
        );
        const listTemplate = res.data.data;
        let newlistTemplate = {
            Api: listTemplate.Api,
            ApiID: listTemplate.ApiID,
            ID: listTemplate.ID,
            Account: listTemplate.ApplyFor,
            Caculator: listTemplate.CaculationFormula,
            ProjectCode: listTemplate.ProjectID,
            NoteRow: listTemplate.Note,
            Condition: listTemplate.Condition,
            TimeRun: listTemplate.TimeRun,
            Header: splitRawData(listTemplate.Api.Header),
            HeaderRaw: listTemplate.Api.Header,
            SampleDataRaw: listTemplate.Api.SampleData,
            SampleData: splitRawData(listTemplate.Api.SampleData),
            MappingData: listTemplate.Api.DataMapping
        };
        return newlistTemplate;
    } catch (err) {
        throw err.response.data.error;
        // return [];
    }
};
export const getInforAPI = async (token, DepartmentID, apiID) => {
    try {
        const res = await axios.get(`${Server}/synchronous/getApiInfo?ApiID=${apiID}`, token);
        const listTemplate = res.data.data;
        let newlistTemplate = listTemplate.map((x) => ({
            label: x.Name,
            value: x.ID,
            Header: splitRawData(x.Header),
            SampleData: splitRawData(x.SampleData),
            MappingData: x.MappingData,
            RawHeader: x.Header,
            RawSampleData: x.SampleData
        }));
        return newlistTemplate[0];
    } catch (err) {
        // return false;
        throw err.response.data.error;
    }
};
export const getInforAPIBasic = async (token, apiID) => {
    try {
        const res = await axios.get(`${Server}/api/${apiID}`, token);
        const listTemplate = res.data.data;
        let newlistTemplate = {
            label: listTemplate.Name,
            value: listTemplate.ID,
            Header: listTemplate.Header !== null ? splitRawData(listTemplate.Header) : [],
            SampleData: listTemplate.SampleData !== null ? splitRawData(listTemplate.SampleData) : [],
            Template: listTemplate.Template ? listTemplate.Template : '',
            MappingData: listTemplate.DataMapping
        };

        return newlistTemplate;
    } catch (err) {
        return false;
        throw err.response.data.error;
    }
};
export const getSyncRuleAndTemplate = async (token, RuleID, ID) => {
    try {
        const res = await axios.get(`${Server}/synchronize/rule?RuleID=${ID}`, token);
        const listTemplate = res.data.data.rows;
        let newlistTemplate = listTemplate.map((x) => ({
            ApplyFor: x.ApplyFor,
            CaculationFormula: x.CaculationFormula,
            Condition: x.Condition,
            CreatedBy: x.CreatedBy,
            HeaderLine: x.HeaderLine,
            ID: x.ID,
            ProjectIdRow: x.ProjectID,
            NoteRow: x.Note,
            RuleDefinitionID: x.RuleDefinitionID,
            Status: x.Status,
            TemplateID: x.TemplateID,
            UpdatedDate: x.UpdatedDate
        }));

        return newlistTemplate;
    } catch (err) {
        throw err.response.data.error;
    }
};

function splitRawData(RawData) {
    let splitedArray = RawData.split('[');
    splitedArray = splitedArray.slice(1, splitedArray.length);
    for (let index = 0; index < splitedArray.length; index++) {
        splitedArray[index] = splitedArray[index].replace(/.$/, '');
    }
    return splitedArray;
}
