import React from 'react';
import { Autocomplete, TextField, Button, Stack } from '@mui/material';

type Item = {
  id: number;
  label: string;
  type: string;
};

type LookUpProps = {
  required?: boolean;
  onChange?: (selected: Item | null) => void;
};

const items: Item[] = [
  { id: 1, label: 'Адрес 1', type: 'адрес' },
  { id: 2, label: 'Адрес 2', type: 'адрес' },
  { id: 3, label: 'Адрес 3', type: 'адрес' },
];

export default function LookUp({ required = false, onChange }: LookUpProps) {
  const [value, setValue] = React.useState<Item | null>(null);

  const handleView = () => {
    if (value) {
      alert(`Переход к просмотру: ${value.label}`);
    }
  };

  const handleChange = (_: any, newValue: Item | null) => {
    setValue(newValue);
    onChange?.(newValue);
  };

  return (
    <Stack spacing={2} direction="column" sx={{ width: 400 }}>
      <Autocomplete
        options={items}
        getOptionLabel={(option) => option.label}
        value={value}
        onChange={handleChange}
        isOptionEqualToValue={(option, value) => option.id === value?.id}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Выберите объект"
            required={required}
          />
        )}
        clearOnEscape
      />

      <Stack direction="row" spacing={2}>
        <Button
          variant="outlined"
          onClick={handleView}
          disabled={!value}
        >
          Просмотр
        </Button>
      </Stack>
    </Stack>
  );
}
