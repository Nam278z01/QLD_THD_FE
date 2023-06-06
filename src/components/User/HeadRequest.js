import { Card, Row, Tabs, Typography } from 'antd';
import { useState } from 'react';
import SearchInput from '../SearchInput';
import HeadRequestApprove from './HeadRequestApprove';
import HeadRequestHistory from './HeadRequestHistory';

function HeadRequest() {
    const [keyword, setKeyword] = useState('');
    const [tabKey, setTabKey] = useState(1);
    const [search, setSearch] = useState('');

    const reqTabItems = [
        {
            label: `Approve Point Requests`,
            key: 1,
            children: <HeadRequestApprove searchQuery={keyword} tabKey={tabKey} />
        },
        {
            label: `Request Point History`,
            key: 2,
            children: <HeadRequestHistory searchQuery={keyword} tabKey={tabKey} />
        }
    ];

    const handleAfterChangeSearch = (value) => {
        setKeyword(value);
    };
    const operations = <SearchInput value={search} afterChange={handleAfterChangeSearch} />;

    const onTabClickHandle = (key, event) => {
        setTabKey(key);
        setSearch('');
        setKeyword('');
    };

    return (
        <div style={{ margin: '1rem 2.5rem' }}>
            <Card className="card-unstyle" bordered={false} style={{ marginBottom: '1.25rem' }}>
                <Row align="middle">
                    <Typography.Title style={{ lineHeight: 1.1 }} level={3}>
                        Request
                    </Typography.Title>
                </Row>
            </Card>

            {/* Tab list */}
            <Tabs
                type="card"
                items={reqTabItems}
                tabBarExtraContent={operations}
                destroyInactiveTabPane={true}
                onTabClick={onTabClickHandle}
            />
        </div>
    );
}

export default HeadRequest;
