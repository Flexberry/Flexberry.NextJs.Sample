// src/app/page.tsx
'use client'

import React from 'react'
import Link from 'next/link'
import { Button, Stack, Typography } from '@mui/material'

export default function HomePage() {
  return (
    <main style={{ padding: '2rem', textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Выберите библиотеку таблиц
      </Typography>
      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        alignItems="center"
        sx={{ flexWrap: 'wrap', gap: 2 }}
      >
        <Button
          variant="contained"
          component={Link}
          href="/table/ag-grid"
        >
          AG Grid
        </Button>
        <Button
          variant="contained"
          component={Link}
          href="/table/mui"
        >
          MUI DataGrid
        </Button>
        <Button
          variant="contained"
          component={Link}
          href="/table/primereact"
        >
          PrimeReact
        </Button>
        <Button
          variant="contained"
          component={Link}
          href="/table/tanstack"
        >
          TanStack Table
        </Button>
      </Stack>
    </main>
  )
}
