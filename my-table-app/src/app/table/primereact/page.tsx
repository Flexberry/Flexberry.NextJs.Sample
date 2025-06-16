// src/app/table/primereact/page.tsx
'use client'

import React, { useState, useRef, useCallback } from 'react'
import { DataTable, DataTableRowEditCompleteParams } from 'primereact/datatable'
import { Column, ColumnEditorOptions } from 'primereact/column'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Calendar } from 'primereact/calendar'
import { Checkbox as PRCheckbox } from 'primereact/checkbox'
import { MultiSelect } from 'primereact/multiselect'
import { FilterMatchMode } from 'primereact/api'

// темы и стили PrimeReact
import 'primereact/resources/themes/lara-dark-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'

import { Person, initialData } from '@/data/sample-data'

export default function PrimeReactTablePage() {
  // таблица и колонки
  const [data, setData] = useState<Person[]>(
    initialData.map((r) => ({ ...r }))
  )
  const dt = useRef<DataTable<Person>>(null)

  // выбор колонок
  const allCols = [
    { field: 'id', header: 'ID' },
    { field: 'name', header: 'Name' },
    { field: 'age', header: 'Age' },
    { field: 'birthday', header: 'Birthday' },
    { field: 'active', header: 'Active' },
  ]
  const [visibleCols, setVisibleCols] = useState<string[]>(
    allCols.map((c) => c.field)
  )

  // фильтры
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  })

  // выбранные строки
  const [selectedRows, setSelectedRows] = useState<Person[]>([])

  // редакторы
  const textEditor = (opts: ColumnEditorOptions) => (
    <InputText
      value={opts.value}
      onChange={(e) => opts.editorCallback(e.target.value)}
      className="p-inputtext-sm"
    />
  )
  const dateEditor = (opts: ColumnEditorOptions) => (
    <Calendar
      value={new Date(opts.value)}
      onChange={(e) =>
        opts.editorCallback(e.value?.toISOString().slice(0, 10) || '')
      }
      dateFormat="yy-mm-dd"
      showIcon
      className="p-inputtext-sm"
    />
  )
  const boolEditor = (opts: ColumnEditorOptions) => (
    <PRCheckbox
      checked={!!opts.value}
      onChange={(e) => opts.editorCallback(e.checked)}
    />
  )

  const boolBody = (row: Person) =>
    row.active ? (
      <i className="pi pi-check-circle" style={{ color: 'lime' }} />
    ) : (
      <i className="pi pi-times-circle" style={{ color: 'tomato' }} />
    )

  // действия
  const addRow = () => {
    const id = data.length ? Math.max(...data.map((r) => r.id)) + 1 : 1
    setData([...data, { id, name: 'New Person', age: 0, birthday: '2000-01-01', active: false }])
  }
  const exportCSV = () => dt.current?.exportCSV()
  const deleteSelected = () => {
    if (selectedRows.length) {
      const ids = new Set(selectedRows.map((r) => r.id))
      setData((d) => d.filter((r) => !ids.has(r.id)))
      setSelectedRows([])
    }
  }
  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFilters({ ...filters, global: { value: e.target.value, matchMode: FilterMatchMode.CONTAINS } })

  const onRowEditComplete = (e: DataTableRowEditCompleteParams) => {
    const updated = [...data]
    updated[e.rowIndex] = e.newData
    setData(updated)
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h2>PrimeReact DataTable</h2>
      <div className="mb-3">
        <Button
          label="Add Row"
          icon="pi pi-plus"
          className="p-button-sm p-button-success mr-2"
          onClick={addRow}
        />
        <Button
          label="Delete Selected"
          icon="pi pi-trash"
          className="p-button-sm p-button-danger mr-2"
          onClick={deleteSelected}
          disabled={!selectedRows.length}
        />
        <Button
          label="Export CSV"
          icon="pi pi-download"
          className="p-button-sm p-button-outlined mr-4"
          onClick={exportCSV}
        />
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            className="p-inputtext-sm"
            placeholder="Global Search"
            onInput={onSearch}
          />
        </span>
      </div>

      <div className="mb-3" style={{ width: '20em' }}>
        <MultiSelect
          value={visibleCols}
          options={allCols}
          optionLabel="header"
          optionValue="field"
          onChange={(e) => setVisibleCols(e.value)}
          display="chip"
          className="p-multiselect-sm"
          placeholder="Show/Hide Columns"
        />
      </div>

      <DataTable
        ref={dt}
        value={data}
        editMode="row"
        dataKey="id"
        selectionMode="checkbox"
        selection={selectedRows}
        onSelectionChange={(e) => setSelectedRows(e.value)}
        filters={filters}
        onFilter={(e) => setFilters(e.filters)}
        globalFilterFields={allCols.map((c) => c.field)}
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 20]}
        onRowEditComplete={onRowEditComplete}
        className="p-datatable-sm"
      >
        <Column expander style={{ width: '3em' }} />
        {allCols
          .filter((c) => visibleCols.includes(c.field))
          .map((c) => (
            <Column
              key={c.field}
              field={c.field}
              header={c.header}
              filter
              editor={
                c.field === 'birthday'
                  ? dateEditor
                  : c.field === 'active'
                  ? boolEditor
                  : textEditor
              }
              body={c.field === 'active' ? boolBody : undefined}
              style={{ minWidth: '8rem' }}
            />
          ))}
        <Column
          rowEditor
          headerStyle={{ width: '7rem', textAlign: 'center' }}
          bodyStyle={{ textAlign: 'center' }}
        />
      </DataTable>
    </div>
  )
}
