import { Badge } from 'antd';
import { REQUEST_STATUS } from './status';

const TABLE = {
    COLUMN: {
        RENDER_INDEX: (id, record, index, pageIndex, pageSize) => {
            return ++index + --pageIndex * pageSize;
        },
        REQUEST_RENDER_STATUS: (Status) => (
            <Badge
                status={
                    Status === REQUEST_STATUS.APPROVED
                        ? 'success'
                        : Status === REQUEST_STATUS.WAIT_PM
                        ? 'processing'
                        : Status === REQUEST_STATUS.WAIT_HEAD
                        ? 'processing'
                        : Status === REQUEST_STATUS.CANCEL
                        ? 'default'
                        : 'error'
                }
                text={Status}
            />
        ),
        REQUEST_STATUS_FILTER: [
            {
                text: REQUEST_STATUS.WAIT_PM,
                value: '1'
            },
            {
                text: REQUEST_STATUS.WAIT_HEAD,
                value: '2'
            },
            {
                text: REQUEST_STATUS.APPROVED,
                value: '3'
            },
            {
                text: REQUEST_STATUS.REJECT,
                value: '4'
            },
            {
                text: REQUEST_STATUS.CANCEL,
                value: '5'
            }
        ]
    }
};

export { TABLE };
