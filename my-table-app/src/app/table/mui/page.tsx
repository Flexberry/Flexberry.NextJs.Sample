// src/app/table/mui/page.tsx
'use client'

import React, { useState, useCallback } from 'react'
import {
  DataGrid,
  useGridApiRef,
  GridColDef,
  GridRowSelectionModel,
  GridColumnVisibilityModel,
} from '@mui/x-data-grid'
import {
  Box,
  Button,
  TextField,
  Stack,
  Checkbox,
  FormControlLabel,
} from '@mui/material'
import {
  CheckBoxOutlineBlank as UncheckedIcon,
  CheckBox as CheckedIcon,
} from '@mui/icons-material'
import { Person, initialData } from '@/data/sample-data'

export default function MuiTablePage() {
  // 1) базовые колонки (без свойства hide):
  const staticColumns: GridColDef[] = [
    { field: 'id',       headerName: 'ID',     width: 70 },
    { field: 'name',     headerName: 'Name',   flex: 1, editable: true },
    { field: 'age',      headerName: 'Age',    type: 'number', width: 100,   editable: true },
    { field: 'birthday', headerName: 'Birthday', width: 150, editable: true,
      renderEditCell: params => (
        <TextField
          type="date"
          variant="standard"
          value={params.value ?? ''}
          onChange={e =>
            params.api.setEditCellValue(
              { id: params.id, field: params.field, value: e.target.value },
              e
            )
          }
          sx={{ width: 140 }}
        />
      )
    },
    { field: 'active', headerName: 'Active', width: 120, type: 'boolean', editable: true,
      renderCell: params => params.value ? '✅' : '❌',
      renderEditCell: params => (
        <Checkbox
          checked={Boolean(params.value)}
          onChange={e =>
            params.api.setEditCellValue(
              { id: params.id, field: params.field, value: e.target.checked },
              e
            )
          }
        />
      )
    },
  ]

  // 2) Стейт для строк
  const [rows, setRows] = useState<Person[]>([...initialData])

  // 3) Стейт для контролируемой модели видимости колонок
  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(() =>
      Object.fromEntries(staticColumns.map(c => [c.field, true]))
    )

  // 4) DataGrid API ref
  const apiRef = useGridApiRef()

  // 5) Выбранные строки
  const [selectionModel, setSelectionModel] =
    useState<GridRowSelectionModel>([])

  // 6) Параметр поиска
  const [filterValue, setFilterValue] = useState<string>('')

  // 7) CRUD и утилиты
  const addRow = useCallback(() => {
    const newId = rows.length
      ? Math.max(...rows.map(r => r.id)) + 1
      : 1
    setRows(prev => [
      ...prev,
      { id: newId, name: 'New Person', age: 0, birthday: '2000-01-01', active: false },
    ])
  }, [rows])

  const exportCSV = useCallback(() => {
    const csv = apiRef.current.getDataAsCsv()
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'table.csv'
    document.body.appendChild(a); a.click(); document.body.removeChild(a)
  }, [apiRef])

  const deleteSelected = useCallback(() => {
    setRows(prev => prev.filter(r => !selectionModel.includes(r.id)))
    setSelectionModel([])
  }, [selectionModel])

  const onFilterChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValue(e.target.value)
  }, [])

  // 8) Переключить колонку по полю
  const toggleColumn = useCallback((field: string) => {
    setColumnVisibilityModel(prev => ({
      ...prev,
      [field]: !prev[field],
    }))
  }, [])

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <h2>MUI X DataGrid</h2>

      {/* Панель действий */}
      <Stack direction="row" spacing={2} mb={2} flexWrap="wrap">
        <Button variant="contained" color="success" onClick={addRow}>
          Add Row
        </Button>
        <Button variant="outlined" color="info" onClick={exportCSV}>
          Export CSV
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={deleteSelected}
          disabled={selectionModel.length === 0}
        >
          Delete Selected ({selectionModel.length})
        </Button>
        <TextField
          placeholder="Search…"
          value={filterValue}
          onChange={onFilterChange}
          size="small"
        />
      </Stack>

      {/* Чекбоксы переключения колонок */}
      <Box mb={2}>
        <strong>Toggle Columns:</strong>{' '}
        {staticColumns.map(col => (
          <FormControlLabel
            key={col.field}
            control={
              <Checkbox
                icon={<UncheckedIcon fontSize="small" />}
                checkedIcon={<CheckedIcon fontSize="small" />}
                checked={columnVisibilityModel[col.field] ?? false}
                onChange={() => toggleColumn(col.field)}
                size="small"
              />
            }
            label={col.headerName}
            sx={{ mr: 2 }}
          />
        ))}
      </Box>

      {/* Сам DataGrid */}
      <DataGrid
        apiRef={apiRef}
        rows={rows}
        columns={staticColumns}
        autoHeight
        filterModel={{
          items: [],
          quickFilterValues: filterValue ? [filterValue] : [],
        }}
        columnVisibilityModel={columnVisibilityModel}
        onColumnVisibilityModelChange={setColumnVisibilityModel}
        pageSizeOptions={[5, 10, 20]}
        initialState={{
          pagination: { paginationModel: { pageSize: 5, page: 0 } },
        }}
        checkboxSelection
        disableRowSelectionOnClick
        rowSelectionModel={selectionModel}
        onRowSelectionModelChange={setSelectionModel}
      />
    </Box>
  )
}
