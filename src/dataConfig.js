const Status = {
    Notification: ['Notify', 'Readed', 'Deleted'],
    Project: ['On-Going', 'Complete', 'DisComplete'],
    RequestStatus: ['Waiting PM Confirm', 'Waiting Head Approve', 'Approved', 'Rejected', 'Cancelled'],
    Event: ['Pending', 'On-Going', 'End'],
    MoocEvent: ['Pending', 'On-Going', 'End'],
    UserEvent: ['Pending', 'Attended', 'Absent'],
    UserMaster: ['Active', 'Inactive', 'Away', 'Not Ranking'],
    NormalStatus: ['Active', 'Inactive', 'Deleted']
};

const UserMaster = {
    Role: ['Admin', 'Head', 'PM', 'Member', 'Guest'],
    ContractType: ['SVTT', 'NVCT'],
    JobTitle: [
        'SVTT',
        'BA',
        'PM',
        'Member',
        'DEV',
        'DEVE01',
        'DEVE02',
        'DEVE03',
        'DEVE04',
        'DEVE05',
        'DEVE06',
        'TEST',
        'TEST01',
        'TEST02',
        'TEST03',
        'TEST04',
        'TEST05',
        'TEST06',
        'SPMA01',
        'SPMA02',
        'SPMA03',
        'SPMA04',
        'SPMA05',
        'SPMA06',
        'SGMT01',
        'SGMT02',
        'SGMT03',
        'SGMT04',
        'SGMT05',
        'SGMT06',
        'BANE01',
        'BANE02',
        'BANE03',
        'BANE04',
        'BANE05',
        'BANE06',
        'SARE01',
        'SARE02',
        'SARE03',
        'SARE04',
        'SARE05',
        'SARE06'
    ]
};

const UserNickname = { Vote: ['Yes', 'No'] };

const Event = { Type: ['Normal Event', 'Mooc Event'] };

const Pic = {
    UserType: ['Head', 'PM', 'Manager', 'Member', ' Lấy account của những người được chọn hiện ra']
};

const Server = 'http://localhost:5000/api/v1';

const SocketServer = 'http://localhost:5001';

const msalGoWhere = 'http://localhost:3000/';

const imgServer = 'http://localhost:5000';

const scopes = ['api://2a420303-0ef2-42d4-84af-6e08cd68fb78/access_as_user'];

const testerArr = ['VietCD1', 'TrangTLH', 'HaLT16', 'DucNM72', 'TuanTQ30', 'SangNC2', 'TruongPH1', 'HoangTV46'];

export {
    Status,
    UserMaster,
    UserNickname,
    Event,
    Pic,
    Server,
    msalGoWhere,
    imgServer,
    SocketServer,
    scopes,
    testerArr
};
