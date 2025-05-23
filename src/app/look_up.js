import React, { useState } from 'react';
import { Autocomplete, TextField, IconButton, Box } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import VisibilityIcon from '@mui/icons-material/Visibility';

const items = [
    { id: 1, label: 'Адрес 1', url: '/address/1' },
    { id: 2, label: 'Адрес 2', url: '/address/2' },
    { id: 3, label: 'Адрес 3', url: '/address/3' },
];

export default function LookUp({ required = false, onChange }) {
    const [value, setValue] = useState(null);
    const [inputValue, setInputValue] = useState('');

    const handleClear = () => {
        setValue(null);
        setInputValue('');
        onChange && onChange(null);
    };

    const handleView = () => {
        if (value) {
            window.open(value.url, '_blank');
        }
    };

    return (
        <Box display="flex" alignItems="center" gap={1}>
            <Autocomplete
                sx={{ width: 300 }}
                options={items}
                getOptionLabel={(option) => option.label}
                value={value}
                inputValue={inputValue}
                onChange={(event, newValue) => {
                    setValue(newValue);
                    onChange && onChange(newValue);
                }}
                onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue);
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Выбрать адрес"
                        variant="outlined"
                        required={required}
                        error={required && !value}
                        helperText={required && !value ? 'Обязательное поле' : ''}
                    />
                )}
                clearOnEscape
            />
            <IconButton onClick={handleClear} disabled={!value} aria-label="Очистить">
                <ClearIcon />
            </IconButton>
            <IconButton onClick={handleView} disabled={!value} aria-label="Просмотр">
                <VisibilityIcon />
            </IconButton>
        </Box>
    );
}
