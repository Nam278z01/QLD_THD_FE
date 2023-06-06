import axios from 'axios';
import { Server, Status, UserMaster } from '../dataConfig';

export const getRequestCampaignDetail = async (token, DepartmentID, ID) => {
    try {
        const res = await axios.get(`${Server}/usercampaigns/${ID}`, token);
        const datas = res.data.data;
        return datas;
    } catch (err) {
        throw err.response.data.error;
    }
};
export const getRequestMoocCampaignDetail = async (token, DepartmentID, ID) => {
    try {
        const res = await axios.get(`${Server}/usermooccampaigns/${ID}`, token);
        const datas = res.data.data;
        return datas;
    } catch (err) {
        throw err.response.data.error;
    }
};
export const deleteRequestCampaign = async (token, campaignID) => {
    try {
        await axios.delete(`${Server}/usercampaigns/${campaignID}`, token);
    } catch (err) {
        throw err.response.data.error;
    }
};
export const deleteRequestMoocCampaign = async (token, campaignID) => {
    try {
        await axios.delete(`${Server}/usermooccampaigns/${campaignID}`, token);
    } catch (err) {
        throw err.response.data.error;
    }
};
export const getRequestCampaign = async (token, DepartmentID, page, row, sort, search, role, account) => {
    try {
        let datas;
        let totalPage;

        if (sort === 'Date:ASC') {
            const res = await axios.get(
                `${Server}/usercampaigns?page=${page}${row === 'All' ? '' : `&size=${row}`}&sort=CreatedDate:ASC${
                    search ? `&keyword=${search}` : ''
                }&Status=2&Confirmer=${account}&DepartmentID=${DepartmentID}`,
                token
            );

            datas = res.data.data.userCampaigns;
            totalPage = Math.ceil(res.data.data.total / row);
        } else if (sort === 'Date:DESC') {
            const res = await axios.get(
                `${Server}/usercampaigns?page=${page}${row === 'All' ? '' : `&size=${row}`}&sort=CreatedDate:DESC${
                    search ? `&keyword=${search}` : ''
                }&Status=2&Confirmer=${account}&DepartmentID=${DepartmentID}`,
                token
            );
            datas = res.data.data.userCampaigns;
            totalPage = Math.ceil(res.data.data.total / row);
        } else {
            const res = await axios.get(
                `${Server}/usercampaigns?page=${page}${row === 'All' ? '' : `&size=${row}`}${
                    search ? `&keyword=${search}` : ''
                }&Status=2&Confirmer=${account}&DepartmentID=${DepartmentID}`,
                token
            );
            datas = res.data.data.userCampaigns;
            totalPage = Math.ceil(res.data.data.total / row);
        }

        const requestData = datas.map((data) => {
            const {
                ID,
                Campaign,
                CampaignID,
                Confirmer,
                CreatedDate,
                Description,
                Evidence,
                Status,
                UpdatedDate,
                UserMasterID,
                UserMaster
            } = data;
            if (UserMaster == null) {
                return null;
            }

            return {
                ID,
                CampaignID,
                Campaign,
                Confirmer,
                CreatedDate,
                Description,
                Evidence,
                Status,
                UpdatedDate,
                UserMasterID,
                UserMaster
            };
        });
        return { requestData, totalPage };
    } catch (err) {
        throw err.response.data.error;
    }
};
export const getRequestMoocCampaign = async (token, DepartmentID, page, row, sort, search, role, account) => {
    try {
        let datas;
        let totalPage;

        if (sort === 'Date:ASC') {
            const res = await axios.get(
                `${Server}/usermooccampaigns?page=${page}${row === 'All' ? '' : `&size=${row}`}&sort=CreatedDate:ASC${
                    search ? `&keyword=${search}` : ''
                }&Status=2&Confirmer=${account}&DepartmentID=${DepartmentID}`,
                token
            );

            datas = res.data.data.userMoocCampaigns;
            totalPage = Math.ceil(res.data.data.total / row);
        } else if (sort === 'Date:DESC') {
            const res = await axios.get(
                `${Server}/usermooccampaigns?page=${page}${row === 'All' ? '' : `&size=${row}`}&sort=CreatedDate:DESC${
                    search ? `&keyword=${search}` : ''
                }&Status=2&Confirmer=${account}&DepartmentID=${DepartmentID}`,
                token
            );
            datas = res.data.data.userMoocCampaigns;
            totalPage = Math.ceil(res.data.data.total / row);
        } else {
            const res = await axios.get(
                `${Server}/usermooccampaigns?page=${page}${row === 'All' ? '' : `&size=${row}`}${
                    search ? `&keyword=${search}` : ''
                }&Status=2&Confirmer=${account}&DepartmentID=${DepartmentID}`,
                token
            );

            datas = res.data.data.userMoocCampaigns;
            totalPage = Math.ceil(res.data.data.total / row);
        }

        const requestData = datas.map((data) => {
            const {
                Confirmer,
                CreatedDate,
                Description,
                Evidence,
                ID,
                MoocCampaign,
                PublishedDate,
                Status,
                UpdatedDate,
                UserMasterID,
                UserMaster
            } = data;

            return {
                Confirmer,
                CreatedDate,
                Description,
                Evidence,
                ID,
                MoocCampaign,
                PublishedDate,
                Status,
                UpdatedDate,
                UserMasterID,
                UserMaster
            };
        });
        return { requestData, totalPage };
    } catch (err) {
        throw err.response.data.error;
    }
};
export const getMyCampaignRequest = async (token, DepartmentID, page, row, sort, search, status, userID) => {
    try {
        let res;
        if (sort === 'Date:ASC') {
            res = await axios.get(
                `${Server}/usercampaigns?page=${page}${row === 'All' ? '' : `&size=${row}`}&sort=CreatedDate:ASC${
                    search ? `&keyword=${search}` : ''
                }&UserMasterID=${userID}${status ? `&Status=${status}` : ''}&DepartmentID=${DepartmentID}`,
                token
            );
        } else if (sort === 'Date:DESC') {
            res = await axios.get(
                `${Server}/usercampaigns?page=${page}${row === 'All' ? '' : `&size=${row}`}&sort=CreatedDate:DESC${
                    search ? `&keyword=${search}` : ''
                }&UserMasterID=${userID}${status ? `&Status=${status}` : ''}&DepartmentID=${DepartmentID}`,
                token
            );
        } else {
            res = await axios.get(
                `${Server}/usercampaigns?page=${page}${row === 'All' ? '' : `&size=${row}`}${
                    sort ? `&sort=${sort}` : ''
                }${search ? `&keyword=${search}` : ''}&UserMasterID=${userID}${
                    status ? `&Status=${status}` : ''
                }&DepartmentID=${DepartmentID}`,
                token
            );
        }
        const datas = res.data.data.userCampaigns;

        const totalPage = Math.ceil(res.data.data.total / row);

        const requestData = datas.map((data) => {
            const {
                ID,
                Campaign,
                CampaignID,
                Confirmer,
                CreatedDate,
                Description,
                Evidence,
                Status,
                UpdatedDate,
                UserMasterID,
                UserMaster
            } = data;

            return {
                ID,
                CampaignID,
                Campaign,
                Confirmer,
                CreatedDate,
                Description,
                Evidence,
                Status,
                UpdatedDate,
                UserMasterID,
                UserMaster
            };
        });
        return { requestData, totalPage };
    } catch (err) {
        throw err.response.data.error;
    }
};
export const getMyMoocCampaignRequest = async (token, DepartmentID, page, row, sort, search, status, userID) => {
    try {
        let res;
        if (sort === 'Date:ASC') {
            res = await axios.get(
                `${Server}/usermooccampaigns?page=${page}${row === 'All' ? '' : `&size=${row}`}&sort=CreatedDate:ASC${
                    search ? `&keyword=${search}` : ''
                }&UserMasterID=${userID}${status ? `&Status=${status}` : ''}&DepartmentID=${DepartmentID}`,
                token
            );
        } else if (sort === 'Date:DESC') {
            res = await axios.get(
                `${Server}/usermooccampaigns?page=${page}${row === 'All' ? '' : `&size=${row}`}&sort=CreatedDate:DESC${
                    search ? `&keyword=${search}` : ''
                }&UserMasterID=${userID}${status ? `&Status=${status}` : ''}&DepartmentID=${DepartmentID}`,
                token
            );
        } else {
            res = await axios.get(
                `${Server}/usermooccampaigns?page=${page}${row === 'All' ? '' : `&size=${row}`}${
                    sort ? `&sort=${sort}` : ''
                }${search ? `&keyword=${search}` : ''}&UserMasterID=${userID}${
                    status ? `&Status=${status}` : ''
                }&DepartmentID=${DepartmentID}`,
                token
            );
        }
        const datas = res.data.data.userMoocCampaigns;

        const totalPage = Math.ceil(res.data.data.total / row);

        const requestData = datas.map((data) => {
            const {
                Confirmer,
                CreatedDate,
                Description,
                Evidence,
                ID,
                MoocCampaignID,
                PublishedDate,
                Status,
                UpdatedDate,
                UserMasterID,
                MoocCampaign,
                UserMaster
            } = data;

            return {
                Confirmer,
                CreatedDate,
                Description,
                Evidence,
                ID,
                MoocCampaignID,
                PublishedDate,
                Status,
                UpdatedDate,
                UserMasterID,
                MoocCampaign,
                UserMaster
            };
        });
        return { requestData, totalPage };
    } catch (err) {
        throw err.response.data.error;
    }
};
//group
export const getAllGroup = async (token, DepartmentID, page, row, search) => {
    try {
        const res = await axios.get(
            `${Server}/group?page=${page}&size=${row}${search ? `&keyword=${search}` : ''}`,
            token
        );

        const datas = res.data.data.Groups;

        const totalPage = Math.ceil(res.data.data.total / row);
        return { GroupListData: datas, totalPage: totalPage };
    } catch (err) {
        throw err.response.data.error;
    }
};
export const getAllCampaignNopage = async (token, DepartmentID, UserID) => {
    try {
        const res = await axios.get(`${Server}/usercampaigns?UserMasterID=${UserID}`, token);
        const datas = res.data.data.userCampaigns;
        const ListCampaignData = datas.map((data) => {
            const { ID, Campaign, Confirmer, CampaignID } = data;

            return { ID, label: Campaign.Name, Confirmer, CampaignID };
        });
        return ListCampaignData;
    } catch (err) {
        throw err.response.data.error;
    }
};
export const getAllCampaignMoocNopage = async (token, DepartmentID, CampaignID) => {
    try {
        const res = await axios.get(`${Server}/mooccampaigns?CampaignID=${CampaignID}`, token);
        const datas = res.data.data.moocCampaigns;
        const ListMoocCampaignData = datas.map((data, index) => {
            const { ID, StartDate, EndDate } = data;

            return {
                ID,
                label:
                    'Mooc ' +
                    (index + 1) +
                    ' ' +
                    '(' +
                    StartDate.substring(0, 10) +
                    ' / ' +
                    EndDate.substring(0, 10) +
                    ')'
            };
        });

        return ListMoocCampaignData;
    } catch (err) {
        throw err.response.data.error;
    }
};
export const getAllUserCampaignMoocNopage = async (token, DepartmentID, MoocCampaignID, UserID) => {
    try {
        const res = await axios.get(
            `${Server}/usermooccampaigns?MoocCampaignID=${MoocCampaignID}&UserMasterID=${UserID}`,
            token
        );
        const datas = res.data.data.userMoocCampaigns.map((x) => x.ID);

        return datas;
    } catch (err) {
        throw err.response.data.error;
    }
};

//event
export const UpdateEvidence = async (token, DepartmentID, ID, body) => {
    try {
        await axios.put(`${Server}/usercampaigns/${ID}`, body, token);
    } catch (err) {
        return false;
    }
};
export const UpdateEvidenceMoocCampaign = async (token, DepartmentID, ID, body) => {
    try {
        await axios.put(`${Server}/usermooccampaigns/${ID}`, body, token);
    } catch (err) {
        return false;
    }
};

export const getAllCampaign = async (token, DepartmentID, page, row, search) => {
    try {
        const res = await axios.get(
            `${Server}/campaigns?page=${page}&size=${row}&DepartmentID=${DepartmentID}${
                search ? `&keyword=${search}` : ''
            }`,
            token
        );

        const datas = res.data.data.campaigns;

        const totalPage = Math.ceil(res.data.data.total / row);
        return { campaignListData: datas, totalPage: totalPage };
    } catch (err) {
        throw err.response.data.error;
    }
};
export const getAllCampaignMember = async (token, DepartmentID, ID, Status) => {
    try {
        const res = await axios.get(
            `${Server}/usercampaigns?CampaignID=${ID}${Status ? `&Status=${Status}` : ''}`,
            token
        );
        const datas = res.data.data;

        return datas;
    } catch (err) {
        throw err.response.data.error;
    }
};

export const getAllUserCampaign = async (token, DepartmentID, userID, page, row, search) => {
    try {
        const res = await axios.get(
            `${Server}/usercampaigns?UserMasterID=${userID}&page=${page}&size=${row}&DepartmentID=${DepartmentID}${
                search ? `&keyword=${search}` : ''
            }`,
            token
        );

        const datas = res.data.data.userCampaigns;
        const totalPage = Math.ceil(res.data.data.total / row);
        return { campaignListData: datas, totalPage: totalPage };
    } catch (err) {
        throw err.response.data.error;
    }
};

export const getAllActiveCampaign = async (token, DepartmentID, page, row, search) => {
    try {
        const res = await axios.get(
            `${Server}/campaigns?Status=1&page=${page}&size=${row}&DepartmentID=${DepartmentID}${
                search ? `&keyword=${search}` : ''
            }`,
            token
        );

        const datas = res.data.data.campaigns;
        const totalPage = Math.ceil(res.data.data.total / row);
        return { campaignListData: datas, totalPage: totalPage };
    } catch (err) {
        throw err.response.data.error;
    }
};

export const getMoocEvent = async (token, DepartmentID, page, row, sort, search) => {
    try {
        const res = await axios.get(
            `${Server}/mooccampaigns?page=${page}&size=${row}${sort ? `&sort=${sort}` : ''}${
                search ? `&keyword=${search}` : ''
            }`,
            token
        );

        const datas = res.data.data.campaigns;

        const totalPage = Math.ceil(res.data.data.total / row);

        return { campaignData: datas, totalPage: totalPage };
    } catch (err) {
        throw err.response.data.error;
    }
};

export const getOneCampaign = async (token, DepartmentID, ID) => {
    try {
        const res = await axios.get(`${Server}/campaigns/${ID}`, token);
        const campaignDetail = res.data.data;

        return campaignDetail;
    } catch (err) {
        throw err.response.data.error;
    }
};

export const deleteCampaign = async (token, DepartmentID, ID) => {
    try {
        await axios.delete(`${Server}/campaigns/${ID}`, token);
    } catch (err) {
        throw err.response.data.error;
    }
};

export const activeCampaign = async (token, DepartmentID, ID) => {
    let body = {
        Status: 1
    };
    try {
        await axios.put(`${Server}/campaigns/${ID}`, body, token);
    } catch (err) {
        throw err.response.data.error;
    }
};

// export const getCampaignGroup = async (token, DepartmentID, ID) => {
//   try {
//     const res = await axios.get(`${Server}/campaigns/${ID}`, token);
//     const campaignDetail = res.data.data;

//     return campaignDetail;
//   } catch (err) {
//     throw err.response.data.error;
//   }
// };

export const createCampaign = async (token, DepartmentID, bodies) => {
  let body = {
    CampaignData: {
      Name: bodies.Name,
      Description: bodies.Description,
      Budget: bodies.Budget,
      MaximumReceiver: bodies.MaximumReceiver,
      CoinNumber: bodies.CoinNumber,
      StartDate: bodies.StartDate,
      Deadline: bodies.Deadline,
      EndDate: bodies.EndDate,
      Confirmer: bodies.Confirmer,
      ProjectID: bodies.ProjectID,
    },
    GroupCampaignData: [],
    UserCampaignData: [],
  };
  try {
    const res = await axios.post(
      `${Server}/campaigns?DepartmentID=${DepartmentID}`,
      body,
      token
    );
  } catch (err) {
    throw err.response.data.error;
  }
};

export const updateCampaign = async (token, DepartmentID, ID, bodies) => {
    let body = {
        Name: bodies.Name,
        Description: bodies.Description,
        StartDate: bodies.StartDate,
        EndDate: bodies.EndDate,
        Deadline: bodies.Deadline,
        Budget: bodies.Budget,
        CoinNumber: bodies.CoinNumber,
        MaximumReceiver: bodies.MaximumReceiver,
        Confirmer: bodies.Confirmer,
        ProjectID: bodies.ProjectID
    };
    try {
        await axios.put(`${Server}/campaigns/${ID}`, body, token);
    } catch (err) {
        throw err.response.data.error;
    }
};

export const updateCampaignGroupList = async (
  token,
  DepartmentID,
  ID,
  bodies
) => {
  let body = {
    GroupID: bodies,
  };
  try {
    await axios.put(`${Server}/groupcampaigns/${ID}`, body, token);
  } catch (err) {
    throw err.response.data.error;
  }
};

export const updateCampaignMemberList = async (
  token,
  DepartmentID,
  ID,
  bodies
) => {
  let body = {
    CampaignID: ID,
    UserMasterID: bodies,
  };
  try {
    await axios.post(`${Server}/usercampaigns/add`, body, token);
  } catch (err) {
    throw err.response.data.error;
  }
};

export const updateCampaignMoocsList = async (token, DepartmentID, ID, bodies) => {
    let body = {
        moocCampaign: bodies
    };
    try {
        await axios.put(`${Server}/mooccampaigns?CampaignID=${ID}`, body, token);
    } catch (err) {
        throw err.response.data.error;
    }
};

export const uploadCampaignBanner = async (token, DepartmentID, image) => {
    try {
        const formData = new FormData();

        formData.append('image', image);

        const res = await axios.post(`${Server}/uploads/campaign`, formData, token);
        const imgURL = res.data.data.path;
        return imgURL;
    } catch (err) {
        throw err.response.data.error;
    }
};
