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
} from '@mui/material';

import { Column } from 'primereact/column';
import { DataTable as PrimeDataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';

import DataTableToolbar from '@/components/DataTable/DataTableToolbar';

import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './style.scss';

interface FieldDefinition {
  field: string;
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

const columnHeaders: Record<string, string> = {
  name: 'Наименование',
  price: 'Цена',
  category: 'Категория',
  quantity: 'Количество',
  rating: 'Рейтинг',
};

const DataTable = ({ data, fields, title, onDelete, onRowClick, onCreate }: DataTableProps) => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [visibleColumns, setVisibleColumns] = useState(fields.map((f) => f.field));
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [first, setFirst] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const columns = useMemo(
    () =>
      fields.map(({ field, width }) => ({
        field,
        header: columnHeaders[field] || field,
        width,
      })),
    [fields]
  );

  const filteredData = useMemo(() => {
    if (!globalFilter) return data;
    return data.filter((item) =>
      fields.some((f) =>
        item[f.field]?.toString().toLowerCase().includes(globalFilter.toLowerCase())
      )
    );
  }, [data, fields, globalFilter]);

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
              onChange={(e) => setVisibleColumns(e.target.value as string[])}
              input={<OutlinedInput label="Скрыть/показать столбцы" />}
              renderValue={(selected) =>
                (selected as string[])
                  .map((field) => columnHeaders[field] || field)
                  .join(', ')
              }
            >
              {columns.map((col) => (
                <MenuItem key={col.field} value={col.field}>
                  <Checkbox checked={visibleColumns.indexOf(col.field) > -1} />
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
          setFirst(e.first);
          setRowsPerPage(e.rows);
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
        {columns
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
