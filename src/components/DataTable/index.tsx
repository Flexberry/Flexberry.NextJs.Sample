'use client';

import { useMemo, useState } from 'react';
import {
  Typography,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  OutlinedInput,
  Checkbox,
  ListItemText,
  SelectChangeEvent,
} from '@mui/material';

import { Column } from 'primereact/column';
import { DataTable as PrimeDataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';

import DataTableToolbar from '@/components/DataTable/DataTableToolbar';

import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './style.scss';

export interface FieldDefinition {
  field: string;
  header: string;
  width?: string;
}

interface DataTableProps {
  data: any[];
  fields: FieldDefinition[];
  title: string;
  onDelete: (index: number) => void;
  onRowClick: (item: any) => void;
  onCreate: () => void;
}

const DataTable = ({
  data,
  fields,
  title,
  onDelete,
  onRowClick,
  onCreate,
}: DataTableProps) => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [visibleColumns, setVisibleColumns] = useState<string[]>(fields.map((f) => f.field));
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [first, setFirst] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const filteredData = useMemo(() => {
    if (!globalFilter) return data;
    return data.filter((item) =>
      fields.some((f) =>
        item[f.field]?.toString().toLowerCase().includes(globalFilter.toLowerCase())
      )
    );
  }, [data, fields, globalFilter]);

  const handleColumnChange = (event: SelectChangeEvent<typeof visibleColumns>) => {
    const {
      target: { value },
    } = event;
    setVisibleColumns(typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <>
      <Typography variant="h2" component="h2">
        {title}
      </Typography>
      <Typography variant="subtitle1">Подзаголовок</Typography>

      <DataTableToolbar
        handleCreateButtonClick={onCreate}
        onSettingsClick={() => setShowColumnSettings((prev) => !prev)}
      />

      <div className="flex justify-between items-center mb-2 gap-2">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Глобальный поиск"
          />
        </span>

        {showColumnSettings && (
          <FormControl sx={{ minWidth: 250, maxWidth: 300 }}>
            <InputLabel id="column_select">Скрыть/показать столбцы</InputLabel>
            <Select
              labelId="column_select"
              multiple
              value={visibleColumns}
              onChange={handleColumnChange}
              input={<OutlinedInput label="Скрыть/показать столбцы" />}
              renderValue={(selected) =>
                (selected as string[])
                  .map((field) => fields.find((f) => f.field === field)?.header || field)
                  .join(', ')
              }
            >
              {fields.map((col) => (
                <MenuItem key={col.field} value={col.field}>
                  <Checkbox checked={visibleColumns.includes(col.field)} />
                  <ListItemText primary={col.header} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </div>

      <PrimeDataTable
        value={filteredData}
        paginator
        first={first}
        rows={rowsPerPage}
        onPage={(e) => {
          setFirst(e.first ?? 0);
          setRowsPerPage(e.rows ?? 5);
        }}
        onRowClick={(e) => onRowClick(e.data)}
        rowsPerPageOptions={[5, 10, 20]}
        resizableColumns
        columnResizeMode="fit"
        scrollable
        globalFilterFields={fields.map((f) => f.field)}
        sortMode="multiple"
        scrollHeight="100%"
        reorderableColumns
      >
        {fields
          .filter((col) => visibleColumns.includes(col.field))
          .map((col) => (
            <Column
              key={col.field}
              field={col.field}
              header={col.header}
              sortable
              style={col.width ? { width: col.width } : {}}
            />
          ))}
      </PrimeDataTable>
    </>
  );
};

export default DataTable;
