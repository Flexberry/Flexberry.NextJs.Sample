import * as React from 'react';
import { Button, Divider, Icon, IconButton, Stack, Typography } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
interface DataTableToolbarProps {
  handleCreateButtonClick: () => void;
}

const DataTableToolbar: React.FC<DataTableToolbarProps> = ({ handleCreateButtonClick }) => {
  return (
    <Stack direction="row" alignItems="center" flexWrap="wrap" mb={2.5}>
      <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
        0 объекта(ов) выбрано
      </Typography>
      <Stack spacing={2} direction="row">
        <Button
          variant="contained"
          startIcon={<Icon fontSize="inherit" className="icon-plus" />}
          onClick={handleCreateButtonClick}
        >
          Создать
        </Button>
        <Button variant="contained" startIcon={<Icon className="icon-minus" />}>
          Удалить
        </Button>
        <Button variant="contained" startIcon={<Icon className="icon-download" />}>
          Экспортировать
        </Button>
        <Divider orientation="vertical" variant="middle" flexItem />
        <IconButton color="primary" aria-label="delete" title="Настройки">
          <SettingsIcon />
        </IconButton>
      </Stack>
    </Stack>
  );
};

export default DataTableToolbar;
