import axios from 'axios';
import moment from 'moment';
import { Pic, Server, Status, UserMaster } from '../dataConfig';

export const getRule = async (token, DepartmentID, page, row, sort, search, category, type, status) => {
    try {
        const res = await axios.get(
            `${Server}/ruledefinitions?&sort=Status:ASC&page=${page}${row === 'All' ? '' : `&size=${row}`}${
                sort ? `&sort=${sort}` : '&sort=CreatedDate:DESC'
            }${search ? `&keyword=${search}` : ''}${category ? `&Category=${category}` : ''}${
                type ? `&RuleType=${type}` : ''
            }${status ? `&Status=${status}` : ''}&DepartmentID=${DepartmentID}`,
            token
        );
        const datas = res.data.data.ruleDefinitions;
        const totalPage = Math.ceil(res.data.data.total / row);

        let totalItems = res.data.data.total;

        const ruleData = datas.map((data) => {
            const {
                ID,
                Category,
                Name: RuleName,
                Note,
                PointNumber,
                RuleType,
                Status: RuleStatus,
                Synchronize,
                Integrate,
                Badge,
                ApiID,
                TemplateID
            } = data;

            return {
                ID,
                Category: Category || null,
                RuleName,
                Note,
                Point: PointNumber,
                RuleType: RuleType,
                Status: Status.NormalStatus[RuleStatus - 1],
                Synchronize: ApiID || TemplateID ? 1 : null,
                Integrate,
                Badge: Badge,
                ApiID,
                TemplateID
            };
        });
        return { ruleData, totalPage, totalItems };
    } catch (err) {
        throw err.response.data.error;
    }
};
export const getAllRule = async (token, DepartmentID) => {
    try {
        const res = await axios.get(`${Server}/ruledefinitions?DepartmentID=${DepartmentID}`, token);
        const datas = res.data.data.ruleDefinitions;

        const ruleData = datas.map((data) => {
            const { ID, Category, Name: RuleName, Note, PointNumber, RuleType, Status: RuleStatus } = data;

            return {
                ID,
                Category: Category || null,
                label: RuleName,
                Note,
                Point: PointNumber,
                RuleType: RuleType
            };
        });

        return { ruleData };
    } catch (err) {
        throw err.response.data.error;
    }
};
export const getRuleFsu = async (token, DepartmentID) => {
    try {
        const res = await axios.get(
            `${Server}/ruledefinitions/fsu-rule?DepartmentID=${DepartmentID}`,

            token
        );
        const datas = res.data.data.ruleDefinitions;
        const ruleData = datas.map((data) => {
            const { ID, Category, Name: RuleName, Note, PointNumber, RuleType, Status: RuleStatus } = data;

            return {
                ID,
                Category: Category || null,
                label: RuleName,
                Note,
                Point: PointNumber,
                value: ID,
                RuleType: RuleType
            };
        });
        return { ruleData };
    } catch (err) {
        throw err.response.data.error;
    }
};

export const getRuleNoPage = async (token, DepartmentID) => {
    try {
        const res = await axios.get(`${Server}/ruledefinitions?DepartmentID=${DepartmentID}`, token);
        const datas = res.data.data.ruleDefinitions;

        const ruleData = datas.map((data) => {
            const { Category, Name, Note, PointNumber, RuleType, Status: RuleStatus, Pic } = data;

            return {
                RuleType,
                Name,
                Category,
                PointNumber,
                Note,
                Pic,
                Status: Status.NormalStatus[RuleStatus - 1]
            };
        });
        return ruleData;
    } catch (err) {
        throw err.response.data.error;
    }
};
export const getRuleExport = async (token, DepartmentID, search) => {
    try {
        const res = await axios.get(
            `${Server}/ruledefinitions?DepartmentID=${DepartmentID}${search ? `&keyword=${search}` : ''}`,
            token
        );
        const datas = res.data.data.ruleDefinitions;
        const ruleData = datas.map((data) => {
            const { Category, Name, Note, PointNumber, RuleType, Status: RuleStatus } = data;

            return {
                RuleType,
                Name,
                Category,
                PointNumber,
                Note,
                Status: Status.NormalStatus[RuleStatus - 1]
            };
        });
        return ruleData;
    } catch (err) {
        throw err.response.data.error;
    }
};
export const getAllActiveRule = async (token, departmentID, category) => {
    try {
        const res = await axios.get(
            `${Server}/ruledefinitions?status=1&Category=${category}&DepartmentID=${departmentID}`,
            token
        );
        const datas = res.data.data.ruleDefinitions;

        const activeRule = datas.map((x) => ({
            RuleID: x.ID,
            label: x.Name,
            Point: x.PointNumber,
            Pics: x.Pics.length !== 0 && x.Pics[0].UserMasterID !== null ? x.Pics[0].UserMasterID : ''
        }));
        return activeRule;
    } catch (err) {
        throw err.response.data.error;
    }
};

export const getAllActiveRuleNotBadge = async (token, departmentID, category) => {
    try {
        const res = await axios.get(
            `${Server}/ruledefinitions/all-not-badge?status=1&DepartmentID=${departmentID}`,
            token
        );
        const datas = res.data.data;

        const activeRule = datas.map((x) => ({
            value: x.ID,
            label: x.Name
        }));
        return activeRule;
    } catch (err) {
        throw err.response.data.error;
    }
};

export const createNewRule = async (token, DepartmentID, body) => {
    try {
        await axios.post(`${Server}/ruledefinitions`, body, token);
        return true;
    } catch (err) {
        throw err.response.data.error;
    }
};

export const getRuleDetail = async (token, DepartmentID, id) => {
    try {
        const res = await axios.get(`${Server}/ruledefinitions/${id}?DepartmentID=${DepartmentID}`, token);

        const datas = res.data.data;
        const {
            ID,
            Category,
            CreatedBy,
            CreatedDate,
            Name: RuleName,
            Note: RuleNote,
            PointNumber,
            RuleType,
            Status: RuleStatus,
            UpdatedBy,
            UpdatedDate,
            TemplateID,
            Template,
            Synchronize,
            Integrate,
            Badge,
            ApiID
        } = datas;

        const ruleDetail = {
            ID,
            Category: Category,
            RuleName,
            RuleNote,
            CreatedBy,
            CreatedDate,
            UpdatedBy,
            UpdatedDate,
            RuleStatus: datas.Status,
            Status: Status.NormalStatus[RuleStatus - 1],
            Point: PointNumber,
            RuleType: RuleType,
            Template: Template,
            TemplateID: TemplateID,
            HeaderList: Template !== null ? splitRawData(Template.Header) : [],
            SampleData: Template !== null ? splitRawData(Template.SampleData) : [],
            Synchronize,
            Integrate,
            Badge,
            ApiID
        };

        return ruleDetail;
    } catch (err) {
        throw err.response.data.error;
    }
};
export const getRuleSync = async (token, DepartmentID, id) => {
    try {
        const res = await axios.get(`${Server}/synchronize/rule?RuleID=${id}&DepartmentID=${DepartmentID}`, token);
        const datas = res.data.data.rows;
        const ruleSyncDetail = datas.map((x) => ({
            ApplyFor: x.ApplyFor,
            CaculationFormula: x.CaculationFormula,
            Condition: x.Condition,
            CreatedBy: x.CreatedBy,
            CreatedDate: x.CreatedDate,
            ID: x.ID,
            ModifyDate: x.ModifyDate,
            Note: x.Note,
            ProjectID: x.ProjectID,
            RuleDefinitionID: x.RuleDefinitionID,
            Status: x.Status,
            TemplateID: x.TemplateID,
            UpdatedDate: x.UpdatedDate,
            Template: x.Template,
            Header: x.Template ? splitRawData(x.Template.Header) : [],
            SampleData: x.Template ? splitRawData(x.Template.SampleData) : []
        }));
        return ruleSyncDetail;
    } catch (err) {
        throw err.response.data.error;
    }
};
export const getdefaultRuleSync = async (token, DepartmentID, id) => {
    try {
        const res = await axios.get(`${Server}/synchronize/rule?RuleID=${id}&DepartmentID=${DepartmentID}`, token);
        const datas = res.data.data.rows;
        const ruleSyncDetail = datas.map((x) => ({
            ApplyFor: x.ApplyFor,
            CaculationFormula: x.CaculationFormula,
            Condition: x.Condition,
            CreatedBy: x.CreatedBy,
            CreatedDate: x.CreatedDate,
            ID: x.ID,
            ModifyDate: x.ModifyDate,
            Note: x.Note,
            ProjectID: x.ProjectID,
            RuleDefinitionID: x.RuleDefinitionID,
            Status: x.Status,
            TemplateID: x.TemplateID,
            UpdatedDate: x.UpdatedDate,
            Template: x.Template,
            Header: x.Template ? splitRawData(x.Template.Header) : [],
            SampleData: x.Template ? splitRawData(x.Template.SampleData) : []
        }));
        return ruleSyncDetail;
    } catch (err) {
        throw err.response.data.error;
    }
};

export const getRuleSyncLabel = async (token, DepartmentID, id) => {
    try {
        const res = await axios.get(`${Server}/ruledefinitions/find/syncRule?DepartmentID=${DepartmentID}`, token);

        const datas = res.data.data;
        const ruleSyncDetail = datas.map((x) => ({
            Api: x.Api,
            RuleDefinitionID: x.ID,
            label: x.Name,
            Template: x.Template ? x.Template : ''
        }));
        return ruleSyncDetail;
    } catch (err) {
        throw err.response.data.error;
    }
};

export const getSyncHistory = async (token, DepartmentID, id, month, year) => {
    try {
        const res = await axios.get(
            `${Server}/synchronize/syncHistory?&sort=CreatedDate:DESC&RuleDefinitionID=${id}&Month=${month}&Year=${year}&DepartmentID=${DepartmentID}`,
            token
        );
        const datas = res.data.data.rows;
        return datas;
    } catch (err) {
        throw false;
    }
};
export const getTemplateSync = async (token, DepartmentID, ruleid, templateid) => {
    try {
        const res = await axios.get(
            `${Server}/synchronize/?RuleID=${ruleid}&TemplateID=${templateid}&DepartmentID=${DepartmentID}`,
            token
        );
        const datas = res.data.data;
        const {
            ApplyFor,
            CaculationFormula,
            Condition,
            ID,
            ModifyDate,
            Note,
            ProjectID,
            RuleDefinitionID,
            Status,
            TemplateID
        } = datas;

        const ruleSyncDetail = {
            ApplyFor: ApplyFor,
            CaculationFormula: CaculationFormula,
            Condition: Condition,
            ID: ID,
            ModifyDate: ModifyDate,
            Note: Note,
            ProjectID: ProjectID,
            RuleDefinitionID: RuleDefinitionID,
            Status: Status,
            TemplateID: TemplateID
        };

        return ruleSyncDetail;
    } catch (err) {
        // throw err.response.data.error;
        return false;
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
export const updateRuleStatus = async (token, ID, body) => {
    try {
        await axios.put(`${Server}/ruledefinitions/${ID}`, body, token);
    } catch (err) {
        throw err.response.data.error;
    }
};
export const updateRuleStatusV2 = async (token, ID, body) => {
    try {
        await axios.put(`${Server}/ruledefinitions/${ID}`, body, token);
    } catch (err) {
        throw err.response.data.error;
    }
};
export const updateRuleIntegrate = async (token, ID, body) => {
    try {
        await axios.put(`${Server}/ruledefinitions/${ID}`, body, token);
    } catch (err) {
        throw err.response.data.error;
    }
};
export const createNewTemplate = async (token, DepartmentID, body) => {
    try {
        await axios.post(`${Server}/synchronous/createNewTemplate?DepartmentID=${DepartmentID}`, body, token);
    } catch (err) {
        throw err.response.data.error;
    }
};
export const createSyncHistory = async (token, DepartmentID, body) => {
    try {
        await axios.post(`${Server}/synchronous/syncAllTemplate?DepartmentID=${DepartmentID}`, body, token);
    } catch (err) {
        throw err.response.data.error;
    }
};
export const createSyncApiHistory = async (token, DepartmentID, body) => {
    try {
        await axios.post(`${Server}/synchronous/syncApi?DepartmentID=${DepartmentID}`, body, token);
    } catch (err) {
        throw err.response.data.error;
    }
};
export const createSync = async (token, DepartmentID, body) => {
    try {
        await axios.post(`${Server}/synchronize/create?DepartmentID=${DepartmentID}`, body, token);
    } catch (err) {
        throw err.response.data.error;
    }
};
export const updateSync = async (token, DepartmentID, body) => {
    try {
        await axios.put(`${Server}/synchronize/update?DepartmentID=${DepartmentID}`, body, token);
    } catch (err) {
        throw err.response.data.error;
    }
};
export const uploadRuleExcel = async (token, DepartmentID, file) => {
    try {
        await axios.post(`${Server}/imports/ruledefinition-excel?DepartmentID=${DepartmentID}`, file, token);
    } catch (err) {
        throw err.response.data.error;
    }
};

export const exportRule = async (token, DepartmentID, page, row, sort, search, category, type, status) => {
    try {
        return await axios.get(
            `${Server}/exports/ruledefinition-excel?&sort=Status:ASC&sort=CreatedDate:DESC&page=${page}${
                row === 'All' ? '' : `&size=${row}`
            }${sort ? `&sort=${sort}` : ''}${search ? `&keyword=${search}` : ''}${
                category ? `&Category=${category}` : ''
            }${type ? `&RuleType=${type}` : ''}${status ? `&Status=${status}` : ''}&DepartmentID=${DepartmentID}`,
            token
        );
    } catch (err) {
        throw err.response.data.error;
    }
};
