import React, { useContext } from 'react';
import { PAGE_INDEX, PAGE_SIZE, PAGE_SIZE_OPTIONS_TABLE } from '../../constants/pagination';
import { Button, Col, Form, Modal, Row, Space, Table } from 'antd';
import { TABLE } from '../../constants/table';
import { useEffect } from 'react';
import { getRequest, requestUpdateBulk } from '../../services/RequestAPI';
import useRefreshToken from '../../Hook/useRefreshToken';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    DownloadOutlined,
    ExclamationCircleOutlined,
    ImportOutlined
} from '@ant-design/icons';
import ViewRequest from '../../components/User/ViewRequest';
import EditRequest from '../../components/User/EditRequest'; 
import { GetTokenV2Context } from '../../context/GetTokenV2Context';
import ImportFile from '../../components/ImportFile'; 
import { uploadPointExcelBUL, uploadPointExcelPM } from '../../services/ImportAPI';
import { getExcelHead } from '../../services/ExportAPI';
import moment from 'moment';
import debounce from 'lodash/debounce';

const { confirm } = Modal;

function SupjectManage() {
    return (
        <div>
            Môn học
        </div>
    );
}

export default SupjectManage;
