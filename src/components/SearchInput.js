import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

function SearchInput({ value, afterChange, ...prop }) {
    const handleChange = (event) => {
        const value = event.target.value.trim();
        if (!value) {
            afterChange(value);
        }
    };

    const handlePressEnter = (event) => {
        const value = event.target.value.trim();
        afterChange(value);
    };

    return (
        <Input
            {...prop}
            defaultValue={value ? value : ''}
            prefix={<SearchOutlined />}
            placeholder="Search"
            onPressEnter={handlePressEnter}
            onChange={handleChange}
        />
    );
}

export default SearchInput;
