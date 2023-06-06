import { Select } from 'antd'
import React, { useEffect, useState } from 'react'
import {isFunction} from 'lodash'

function SelectApiComponent({funcApi, item, onSearch, ...rest }) {
    const [options, setOptions] = useState([])
    useEffect(() => {
        if(isFunction(funcApi)){
            funcApi().then((res) => {
                setOptions([...res])
            })
            return
        }
        setOptions(funcApi)
    },[funcApi])
  return (
    <Select
        showArrow
        mode={item?.mode}
        allowClear
        onSearch={item?.onSearch}
        disabled={item?.disabled}
        placeholder={item?.placeholder}
        {...rest}
    >
        {options.map((option => {
            <Select.Option key={option.value}>{option.label}</Select.Option>
        }))}
    </Select>
  )
}

export default SelectApiComponent