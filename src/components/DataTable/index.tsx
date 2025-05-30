'use client';

import { useMemo, useState } from 'react';
import { Typography } from '@mui/material';

import { Column } from 'primereact/column';
import { DataTable as PrimeDataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';

import DataTableToolbar from '@/components/DataTable/DataTableToolbar';

import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './style.scss';

interface DataTableProps {
  data: any[];
  fields: string[];
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
  const [visibleColumns, setVisibleColumns] = useState(fields);
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [first, setFirst] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const columns = useMemo(
    () =>
      fields.map((field) => ({
        field,
        header: columnHeaders[field] || field,
      })),
    [fields]
  );

  const filteredData = useMemo(() => {
    if (!globalFilter) return data;
    return data.filter((item) =>
      fields.some((field) => item[field]?.toString().toLowerCase().includes(globalFilter.toLowerCase()))
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
          <MultiSelect
            value={visibleColumns}
            options={columns.map((col) => ({ label: col.header, value: col.field }))}
            onChange={(e) => setVisibleColumns(e.value)}
            display="chip"
            placeholder="Скрыть/показать столбцы"
            className="w-full md:w-20rem"
          />
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
        globalFilterFields={fields}
        sortMode="multiple"
        scrollHeight="100%"
      >
        {columns
          .filter((col) => visibleColumns.includes(col.field))
          .map((col) => (
            <Column key={col.field} field={col.field} header={col.header} sortable />
          ))}
      </PrimeDataTable>
    </>
  );
};

export default DataTable;
