// src/app/table/ag-grid/page.tsx
'use client'

import {
  ModuleRegistry,
  AllCommunityModule,
  ColDef,
  GridReadyEvent,
  GridApi,
  ColumnApi,
} from 'ag-grid-community'
import React, { useState, useRef, useCallback, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { Person, initialData } from '@/data/sample-data'

// Регистрируем модуль
ModuleRegistry.registerModules([AllCommunityModule])

// Динамический импорт без SSR
const AgGridReact = dynamic(
  () => import('ag-grid-react').then((m) => m.AgGridReact),
  { ssr: false }
)

export default function AgGridTablePage() {
  const [rowData, setRowData] = useState<Person[]>(initialData)
  const gridApi = useRef<GridApi | null>(null)
  const columnApi = useRef<ColumnApi | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [selectedCount, setSelectedCount] = useState(0)

  const [columnDefs, setColumnDefs] = useState<ColDef[]>(() => [
    { field: 'id',       headerName: 'ID',       sortable: true, filter: 'agNumberColumnFilter', checkboxSelection: true, headerCheckboxSelection: true, pinned: 'left', width: 80, hide: false },
    { field: 'name',     headerName: 'Name',     sortable: true, filter: 'agTextColumnFilter',   editable: true, flex:1, minWidth:150, hide: false },
    { field: 'age',      headerName: 'Age',      sortable: true, filter: 'agNumberColumnFilter', editable: true, type:'rightAligned', width:100, hide: false },
    { field: 'birthday', headerName: 'Birthday', sortable: true, filter: 'agDateColumnFilter',   editable: true, width:130, hide: false },
    { field: 'active',   headerName: 'Active',   sortable: true, filter: 'agTextColumnFilter',   editable: true, width:100, cellRenderer:p=>p.value?'✅':'❌', hide: false },
  ])

  const defaultColDef = useMemo<ColDef>(() => ({
    resizable: true,
    sortable: true,
    filter: true,
    floatingFilter: true,
  }), [])

  const onGridReady = useCallback((params: GridReadyEvent) => {
    gridApi.current   = params.api
    columnApi.current = params.columnApi
    setIsReady(true)
  }, [])

  const onSelectionChanged = useCallback(() => {
    const cnt = gridApi.current?.getSelectedRows().length ?? 0
    setSelectedCount(cnt)
  }, [])

  const addRow = useCallback(() => {
    const newId = rowData.length ? Math.max(...rowData.map(r=>r.id)) + 1 : 1
    setRowData(r=>[...r,{ id:newId, name:'New Person', age:0, birthday:'2000-01-01', active:false }])
    setTimeout(()=> gridApi.current?.paginationGoToLastPage(),100)
  },[rowData])

  const exportCsv = useCallback(() => {
    gridApi.current?.exportDataAsCsv({ fileName:'export.csv' })
  },[])

  const deleteSelected = useCallback(() => {
    const sel = gridApi.current?.getSelectedRows()||[]
    if(!sel.length) return
    const ids = new Set(sel.map(r=>r.id))
    setRowData(r=>r.filter(row=>!ids.has(row.id)))
  },[])

  const onQuickFilter = useCallback((e:React.ChangeEvent<HTMLInputElement>)=>{
    gridApi.current?.setGridOption('quickFilterText', e.target.value)
  },[])

  const toggleColumn = useCallback((field:string)=>{
    setColumnDefs(cols=>
      cols.map(c=>
        c.field===field ? {...c, hide: !c.hide} : c
      )
    )
  },[])

  return (
    <div style={{ padding:20 }}>
      <h2>AG Grid</h2>

      <div className="button-group">
        <button className="btn add"    onClick={addRow}>Add Row</button>
        <button className="btn export" onClick={exportCsv}>Export CSV</button>
        <button className="btn delete" onClick={deleteSelected} disabled={selectedCount===0}>
          Delete Selected ({selectedCount})
        </button>
        <input className="search" placeholder="Global Search…" onChange={onQuickFilter}/>
      </div>

      {isReady && (
        <div className="toggle-group">
          <strong>Toggle Columns:</strong>
          {columnDefs.map(col=>(
            <label key={col.field} className="checkbox-container">
              <input
                type="checkbox"
                checked={!col.hide}
                onChange={()=>toggleColumn(col.field!)}
              />
              <span className="checkmark"/>
              {col.headerName}
            </label>
          ))}
        </div>
      )}

      <div className="ag-theme-alpine-dark grid-container">
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          animateRows
          pagination
          paginationPageSize={10}
          rowSelection="multiple"
          suppressRowClickSelection
          onGridReady={onGridReady}
          onSelectionChanged={onSelectionChanged}
        />
      </div>

      <style jsx>{`
        .button-group {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 16px;
          align-items: center;
        }
        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
          color: #fff;
        }
        .btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .btn.add    { background: #4caf50; }
        .btn.export { background: #2196f3; }
        .btn.delete { background: #f44336; }
        .search {
          padding: 6px 10px;
          font-size: 14px;
          border: 1px solid #ccc;
          border-radius: 4px;
          flex: 1 0 200px;
        }

        /* Кастомные чекбоксы */
        .toggle-group { margin-bottom: 16px; }
        .checkbox-container {
          position: relative;
          display: inline-flex;
          align-items: center;
          margin-right: 12px;
          cursor: pointer;
          user-select: none;
          padding-left: 24px;
        }
        .checkbox-container input {
          position: absolute;
          opacity: 0;
          cursor: pointer;
          height: 0;
          width: 0;
        }
        .checkbox-container .checkmark {
          position: absolute;
          left: 0; top: 0;
          width: 18px; height: 18px;
          background: #eee;
          border-radius: 4px;
          transition: background 0.2s;
        }
        .checkbox-container input:checked + .checkmark {
          background: #4caf50;
        }
        .checkbox-container .checkmark::after {
          content: "✔";
          position: absolute;
          display: block;
          color: white;
          font-size: 14px;
          top: 1px; left: 2px;
        }

        .grid-container {
          width: 100%;
          height: 600px;
        }
      `}</style>
    </div>
  )
}
