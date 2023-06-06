import { Tag, Col, Modal, Row, Table, Typography, Space, Button, Card, Divider, Avatar, Image, Grid } from 'antd';
import { useEffect, useState, useContext } from 'react';
import { useSelector } from 'react-redux';
import { TABLE } from '../../constants/table';
import { PAGE_INDEX, PAGE_SIZE, PAGE_SIZE_OPTIONS_TABLE } from '../../constants/pagination';
import { getAllProject, getProjectDetail, exportProjectData } from '../../services/ProjectAPI';
import { uploadProject } from '../../services/ImportAPI';
import { GetTokenV2Context } from '../../context/GetTokenV2Context';
import useRefreshToken from '../../Hook/useRefreshToken';
import useAuth from '../../Hook/useAuth';
import SearchInput from '../../components/SearchInput';
import ImportFile from '../ImportFile';
import moment from 'moment';
import { UserOutlined } from '@ant-design/icons';
import debounce from 'lodash/debounce';
import { imgServer } from '../../dataConfig';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const PROJECT_STATUS = {
    ON_GOING: 'On-going',
    CLOSED: 'Closed',
    CANCELLED: 'Cancelled',
    TENTATIVE: 'Tentative',
    WAITING: 'Waiting'
};

// default status filter values
const statusFilterValues = [
    {
        text: PROJECT_STATUS.ON_GOING,
        value: PROJECT_STATUS.ON_GOING
    },
    {
        text: PROJECT_STATUS.CLOSED,
        value: PROJECT_STATUS.CLOSED
    },
    {
        text: PROJECT_STATUS.CANCELLED,
        value: PROJECT_STATUS.CANCELLED
    },
    {
        text: PROJECT_STATUS.TENTATIVE,
        value: PROJECT_STATUS.TENTATIVE
    },
    {
        text: PROJECT_STATUS.WAITING,
        value: PROJECT_STATUS.WAITING
    }
];

function PMProject() {
    const [page, setPage] = useState(PAGE_INDEX);
    const [pageSize, setPageSize] = useState(PAGE_SIZE);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [sortQuery, setsortQuery] = useState('');
    const [data, setData] = useState({});
    const [deptFilterValue, setDeptFilterValue] = useState(null);
    const [isOpenProjectModal, setIsOpenProjectModal] = useState(false);
    const [projectID, setProjectID] = useState('');
    const [projectDetailData, setProjectDetailData] = useState(null);
    const [modalImportRule, setModalImportRule] = useState(false);
    const [departmentFilterArray, setDepartmentFilterArray] = useState([]);
    const { xs, sm } = useBreakpoint();
    const { isHead } = useAuth({});
    const { role, account, userID } = useSelector((state) => state.UserSlice);
    const { DepartmentID, Name, Code } = useSelector((a) => a.DepartmentSettingSlice);
    const { getTokenFormData, getTokenDownload } = useContext(GetTokenV2Context);

    // render tag for project status
    const statusColumRender = (Status) => {
        switch (Status) {
            case PROJECT_STATUS.ON_GOING:
                return <Tag color="blue">{Status}</Tag>;
            case PROJECT_STATUS.CLOSED:
                return <Tag color="red">{Status}</Tag>;
            case PROJECT_STATUS.CANCELLED:
                return <Tag color="gray">{Status}</Tag>;
            case PROJECT_STATUS.TENTATIVE:
                return <Tag color="gray">{Status}</Tag>;
            case PROJECT_STATUS.WAITING:
                return <Tag color="orange">{Status}</Tag>;
            default:
                return '';
        }
    };

    let [projectData, setProjectData] = useRefreshToken(
        getAllProject,
        page,
        pageSize,
        sortQuery,
        search,
        account,
        status,
        userID,
        role,
        Name,
        deptFilterValue
    );

    useEffect(() => {
        if (projectData) {
            setData(projectData);
            setDepartmentFilterArray(projectData.lstDepartmentFilter ? projectData.lstDepartmentFilter : []);
        }
    }, [projectData]);

    // setting colums of table
    const columns = [
        {
            title: 'No.',
            dataIndex: 'ID',
            key: 'ID',
            width: 50,
            align: 'center',
            render: (id, record, index) => TABLE.COLUMN.RENDER_INDEX(id, record, index, page, pageSize)
        },
        {
            title: 'Project Code',
            dataIndex: 'code',
            key: 'code',
            align: 'center'
        },
        {
            title: 'Manager',
            dataIndex: 'manager',
            key: 'manager',
            align: 'center'
        },
        {
            title: 'Department',
            dataIndex: 'department',
            key: 'department',
            align: 'center',
            filters: departmentFilterArray,
            filterMultiple: true
        },
        {
            title: 'Start Date',
            dataIndex: 'startdate',
            key: 'startdate',
            align: 'center',
            sorter: true,
            sortDirections: ['ascend', 'descend']
        },
        {
            title: 'End Date',
            dataIndex: 'enddate',
            key: 'enddate',
            align: 'center',
            sorter: true,
            sortDirections: ['ascend', 'descend']
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: statusColumRender,
            filters: statusFilterValues,
            filterMultiple: false
        }
    ];

    let [projectDetail, setProjectDetail] = useRefreshToken(getProjectDetail, projectID);

    useEffect(() => {
        setProjectDetailData(projectDetail);
    }, [projectDetail]);

    const onTableChange = (pagination, filters, sorter, extra) => {
        // pagination
        setPage(pagination.current);
        setPageSize(pagination.pageSize);
        setDeptFilterValue(filters?.department.toString());

        // filter
        if (filters.status) {
            setStatus(filters.status);
        } else {
            setStatus('');
        }

        // sort
        let order = sorter.order;
        let sortName = sorter.columnKey;
        if (order) {
            setsortQuery(sortName + ':' + (order === 'ascend' ? 'ASC' : 'DESC'));
        } else {
            setsortQuery('');
        }
    };

    const handleAfterChangeSearch = (value) => {
        setPage(PAGE_INDEX);
        setSearch(value);
    };

    const handleImport = (file) => {
        setModalImportRule(false);

        const formData = new FormData();
        formData.append('file', file);

        getTokenFormData(uploadProject, 'Import success', success, null, formData, DepartmentID);
    };

    const success = () => {
        setProjectData(new Date());
        setProjectDetail(new Date());
    };

    const handleProjectExport = () => {
        const exportFileName = `${Code}_project_${moment(new Date()).format('YYYY_MM_DD_HH_mm')}`;
        getTokenDownload(
            exportProjectData,
            exportFileName,
            DepartmentID,
            page,
            pageSize,
            sortQuery,
            search,
            account,
            status,
            userID,
            role,
            Name,
            deptFilterValue
        );
    };

    return (
        <div style={{ margin: '1rem 2.5rem' }}>
            <Row style={{ marginBottom: '1rem' }}>
                <Col span={12}>
                    <Title style={{ lineHeight: 1.1, margin: 0 }} level={3}>
                        Project List
                    </Title>
                </Col>
                <Col
                    span={12}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'end'
                    }}
                >
                    <SearchInput afterChange={handleAfterChangeSearch} style={{ width: 250, marginRight: '.5rem' }} />
                    {isHead && (
                        <Space>
                            <Button type="primary" onClick={debounce(handleProjectExport, 300)}>
                                Export
                            </Button>
                            <Button type="primary" onClick={() => setModalImportRule(true)}>
                                Import
                            </Button>
                        </Space>
                    )}
                </Col>
            </Row>

            {/* Table List */}
            <Table
                bordered
                style={{ borderRadius: 0 }}
                rowKey={(record) => record.projectID}
                columns={columns}
                dataSource={data ? data.projectData : []}
                onChange={onTableChange}
                onRow={(record, rowIndex) => {
                    return {
                        onClick: (event) => {
                            setIsOpenProjectModal(true);
                            setProjectID(record.projectID);
                        }
                    };
                }}
                pagination={{
                    total: data ? data.totalItems : 0,
                    current: page,
                    pageSize: pageSize,
                    showSizeChanger: true,
                    pageSizeOptions: PAGE_SIZE_OPTIONS_TABLE,
                    showTotal: (total) => `Total ${total} items`
                }}
            />
            {projectDetailData !== null && (
                <Modal
                    title={
                        <h3
                            style={{
                                fontSize: '24px',
                                lineHeight: '32px',
                                fontWeight: 600
                            }}
                        >
                            {'Project Detail'}
                        </h3>
                    }
                    open={isOpenProjectModal}
                    onOk={() => setIsOpenProjectModal(false)}
                    onCancel={() => setIsOpenProjectModal(false)}
                    footer={[]}
                    width={xs ? '90%' : '60%'}
                >
                    <Card style={{ border: 'none', marginBottom: '1rem' }}>
                        <Card.Grid
                            hoverable={false}
                            style={{
                                textAlign: 'center',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}
                        >
                            <Title level={5}>Project Manager</Title>
                            {projectDetailData.project.Manager && projectDetailData.project.Manager.Avatar !== null ? (
                                <Image
                                    src={`${imgServer}${projectDetailData.project.Manager.Avatar}`}
                                    style={{
                                        width: '128',
                                        height: '128',
                                        borderRadius: '50%',
                                        objectFit: 'cover'
                                    }}
                                />
                            ) : (
                                <Avatar icon={<UserOutlined />} size={xs ? 64 : 128} />
                            )}
                            {projectDetailData.project.Manager && (
                                <Text strong>{projectDetailData.project.Manager.Account}</Text>
                            )}
                        </Card.Grid>
                        <Card.Grid hoverable={false}>
                            <Row align="middle ">
                                <Space direction={xs ? 'vertical' : sm ? 'vertical' : 'horizontal'}>
                                    <Col span={18}>
                                        <Title level={5}>
                                            Project Name: {projectDetailData.project.Code} <br /> Rank:{' '}
                                            {projectDetailData.project.Rank}
                                        </Title>
                                    </Col>
                                    <Col span={6}>{statusColumRender(projectDetailData.project.Status)}</Col>
                                </Space>
                            </Row>
                            <Divider></Divider>
                            <Row>
                                <Text>
                                    Type: {projectDetailData.project.Type} <br />
                                    Start Date: {projectDetailData.project.StartDate} <br />
                                    End Date: {projectDetailData.project.EndDate} <br />
                                </Text>
                            </Row>
                        </Card.Grid>
                        <Card.Grid hoverable={false}>
                            <Row>
                                <Title level={5}>
                                    Budget: {projectDetailData.project.Budget ? projectDetailData.project.Budget : '0'}{' '}
                                    <i className="fa-solid fa-coins text-warning"></i>
                                    <br />
                                    <br />
                                </Title>
                            </Row>
                            <Divider></Divider>
                            <Row>
                                <Text>Note: {projectDetailData.project.Note}</Text>
                            </Row>
                        </Card.Grid>
                    </Card>
                    {projectDetailData.projectMember.length > 0 && (
                        <Card title="Project Member" style={{ borderRadius: '0' }}></Card>
                    )}
                </Modal>
            )}
            <Modal
                title="Import rule"
                centered
                open={modalImportRule}
                footer={null}
                width={500}
                onCancel={() => setModalImportRule(false)}
            >
                <ImportFile onFinish={handleImport} />
            </Modal>
        </div>
    );
}

export default PMProject;
