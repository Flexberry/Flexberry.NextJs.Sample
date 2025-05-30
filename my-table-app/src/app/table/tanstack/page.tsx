// src/app/table/tanstack/page.tsx
'use client'

import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from 'react'
import {
  useReactTable,
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table'
import { Person, initialData } from '@/data/sample-data'

// Чекбокс «выбрать все»
function SelectAll({ table }: { table: ReturnType<typeof useReactTable> }) {
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = table.getIsSomeRowsSelected()
  }, [table.getIsSomeRowsSelected()])
  return (
    <input
      type="checkbox"
      ref={ref}
      checked={table.getIsAllRowsSelected()}
      onChange={table.getToggleAllRowsSelectedHandler()}
    />
  )
}

// Чекбокс отдельной строки
function SelectRow({ row }: { row: any }) {
  return (
    <input
      type="checkbox"
      checked={row.getIsSelected()}
      onChange={row.getToggleSelectedHandler()}
    />
  )
}

export default function TanStackTablePage() {
  // 1) Данные и состояния
  const [data, setData] = useState<Person[]>(() =>
    initialData.map((r) => ({ ...r }))
  )
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnFilters, setColumnFilters] = useState<any[]>([])
  const [sorting, setSorting] = useState<any[]>([])
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 })
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(
    () => ({
      select: true,
      id: true,
      name: true,
      age: true,
      birthday: true,
      active: true,
    })
  )

  // 2) Обновление ячейки
  const updateCell = useCallback(
    (rowIndex: number, columnId: string, value: any) => {
      setData((old) =>
        old.map((row, idx) =>
          idx === rowIndex ? { ...row, [columnId]: value } : row
        )
      )
    },
    []
  )

  // 3) Колонки
  const columns = useMemo<ColumnDef<Person>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => <SelectAll table={table} />,
        cell: ({ row }) => <SelectRow row={row} />,
      },
      {
        accessorKey: 'id',
        header: 'ID',
        cell: (info) => info.getValue<number>(),
      },
      {
        accessorKey: 'name',
        header: 'Имя',
        filterFn: 'includesString',
        cell: ({ getValue, row, column }) => (
          <input
            value={getValue<string>()}
            onChange={(e) =>
              updateCell(row.index, column.id, e.target.value)
            }
            className="cell-input"
          />
        ),
      },
      {
        accessorKey: 'age',
        header: 'Возраст',
        filterFn: 'equals',
        cell: ({ getValue, row, column }) => (
          <input
            type="number"
            value={getValue<number>()}
            onChange={(e) =>
              updateCell(row.index, column.id, Number(e.target.value))
            }
            className="cell-input cell-number"
          />
        ),
      },
      {
        accessorKey: 'birthday',
        header: 'Дата рождения',
        cell: ({ getValue, row, column }) => (
          <input
            type="date"
            value={getValue<string>()}
            onChange={(e) =>
              updateCell(row.index, column.id, e.target.value)
            }
            className="cell-input cell-date"
          />
        ),
      },
      {
        accessorKey: 'active',
        header: 'Активен',
        cell: ({ getValue, row, column }) => (
          <input
            type="checkbox"
            checked={getValue<boolean>()}
            onChange={(e) =>
              updateCell(row.index, column.id, e.target.checked)
            }
          />
        ),
        filterFn: (row, colId, val) =>
          val == null ? true : row.getValue<boolean>(colId) === val,
      },
    ],
    [updateCell]
  )

  // 4) Таблица
  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      columnFilters,
      sorting,
      pagination,
      rowSelection,
      columnVisibility,
    },
    enableRowSelection: true,
    enableMultiRowSelection: true,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    globalFilterFn: 'includesString',
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  // 5) CRUD-утилиты
  const addRow = useCallback(() => {
    setData((prev) => {
      const newId = prev.length ? Math.max(...prev.map((r) => r.id)) + 1 : 1
      return [
        ...prev,
        {
          id: newId,
          name: 'Новый пользователь',
          age: 0,
          birthday: '2000-01-01',
          active: false,
        },
      ]
    })
  }, [])

  const deleteSelected = useCallback(() => {
    const selected = table.getSelectedRowModel().rows.map((r) => r.original)
    if (!selected.length) return
    setData((prev) =>
      prev.filter((r) => !selected.some((s) => s.id === r.id))
    )
    setRowSelection({})
  }, [table])

  const exportCSV = useCallback(() => {
    let csv = 'ID,Имя,Возраст,Дата рождения,Активен\n'
    table.getFilteredRowModel().rows.forEach((row) => {
      const line = row
        .getVisibleCells()
        .map((cell) => {
          const v = cell.getValue()
          return typeof v === 'string'
            ? `"${v.replace(/"/g, '""')}"`
            : v
        })
        .join(',')
      csv += line + '\n'
    })
    const blob = new Blob([csv], {
      type: 'text/csv;charset=utf-8;',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'tanstack-table.csv'
    a.click()
  }, [table])

  // 6) Рендер
  return (
    <div className="container">
      <h2>TanStack Table</h2>

      <div className="toolbar">
        <button className="btn add" onClick={addRow}>
          ➕ Добавить
        </button>
        <button
          className="btn delete"
          onClick={deleteSelected}
          disabled={!table.getFilteredRowModel().rows.some((r) => r.getIsSelected())}
        >
          🗑 Удалить
        </button>
        <button className="btn export" onClick={exportCSV}>
          📥 Экспорт
        </button>
        <input
          className="search"
          placeholder="🔍 Поиск..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
      </div>

      <div className="toggle">
        <strong>Показать/скрыть колонки:</strong>{' '}
        {Object.keys(columnVisibility).map((colId) => (
          <label key={colId}>
            <input
              type="checkbox"
              checked={columnVisibility[colId]}
              onChange={() =>
                setColumnVisibility((v) => ({
                  ...v,
                  [colId]: !v[colId],
                }))
              }
            />
            {columns.find((c) => (c.accessorKey as string) === colId)?.header}
          </label>
        ))}
      </div>

      <table className="grid">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={
                    header.column.getCanSort()
                      ? header.column.getToggleSortingHandler()
                      : undefined
                  }
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {header.column.getCanSort() &&
                    (header.column.getIsSorted() === 'asc'
                      ? ' 🔼'
                      : header.column.getIsSorted() === 'desc'
                      ? ' 🔽'
                      : ' ⬍')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          ←
        </button>
        <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          →
        </button>
        <span>
          Страница{' '}
          <strong>
            {table.getState().pagination.pageIndex + 1} из {table.getPageCount()}
          </strong>
        </span>
      </div>

      <style jsx>{`
        .container {
          padding: 1rem;
          color: #eee;
          font-family: sans-serif;
        }
        h2 {
          margin-bottom: 0.5rem;
        }
        .toolbar {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .btn {
          padding: 0.4rem 1rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: background 0.2s;
        }
        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .add {
          background: #4caf50;
          color: #fff;
        }
        .add:hover {
          background: #43a047;
        }
        .delete {
          background: #f44336;
          color: #fff;
        }
        .delete:hover {
          background: #e53935;
        }
        .export {
          background: #2196f3;
          color: #fff;
        }
        .export:hover {
          background: #1e88e5;
        }
        .search {
          flex: 1;
          padding: 0.4rem 0.8rem;
          border-radius: 4px;
          border: 1px solid #555;
          background: #222;
          color: #eee;
        }
        .toggle {
          margin-bottom: 1rem;
        }
        .toggle label {
          margin-right: 1rem;
          cursor: pointer;
        }
        .grid {
          width: 100%;
          border-collapse: collapse;
          background: #111;
        }
        .grid th,
        .grid td {
          border: 1px solid #444;
          padding: 0.5rem;
        }
        .grid thead {
          background: #333;
        }
        .grid tbody tr:nth-child(even) {
          background: #1f1f1f;
        }
        .grid tbody tr:nth-child(odd) {
          background: #222;
        }
        .cell-input {
          width: 100%;
          padding: 0.25rem;
          background: #222;
          color: #eee;
          border: 1px solid #555;
          border-radius: 2px;
        }
        .cell-number {
          width: 4rem;
        }
        .cell-date {
          max-width: 9rem;
        }
        .pagination {
          margin-top: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .pagination button {
          padding: 0.2rem 0.6rem;
          border: 1px solid #555;
          border-radius: 4px;
          background: #222;
          color: #eee;
          cursor: pointer;
        }
        .pagination button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  )
}
