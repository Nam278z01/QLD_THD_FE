import { Form, Table } from 'antd';
import React, { useEffect, useState } from 'react';

function TableSyncData({ headerOptions, sampleData }) {
    const [dataSource, setDataSource] = useState([]);
    const [columns, setColunms] = useState([]);
    useEffect(() => {
        setDataSource([]);
        setColunms([]);
        if (headerOptions.length > 0) {
            const templateColumns = [];
            const cloumnIndex = headerOptions?.reduce((acc, curr, index) => {
                const key = 'column' + index;
                acc[key] = index;
                templateColumns.push({
                    title: curr,
                    dataIndex: 'column' + index,
                    key: 'column' + index
                });
                return acc;
            }, {});
            const typeRequire = headerOptions?.reduce((acc, curr, index) => {
                const key = 'column' + index;
                acc[key] = sampleData[index];
                return acc;
            }, {});

            setColunms(templateColumns);
            const data = [];
            data.push(cloumnIndex);
            data.push(typeRequire);
            setDataSource(data ? data : []);
        }
    }, [headerOptions, sampleData]);
    return (
        <>
            <div style={{ overflowX: 'auto', marginBottom: '1rem' }}>
                <Form.Item label="Template Information">
                    {/* [TODO] Start Table */}

                    <Table
                        rowClassName={'cursor-pointer'}
                        bordered
                        style={{ borderRadius: 0 }}
                        rowKey={(record) => record?.column0}
                        columns={columns}
                        dataSource={dataSource ? dataSource : []}
                        pagination={false}
                    />
                    {/* [TODO] End Table */}
                </Form.Item>
            </div>
        </>
    );
}
export default TableSyncData;
