// src/app/head.tsx
export default function Head() {
    return (
      <>
        {/* AG Grid CSS из CDN */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/ag-grid-community/styles/ag-grid.css"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/ag-grid-community/styles/ag-theme-alpine-dark.css"
        />
  
        {/* PrimeReact */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/primereact/resources/themes/lara-dark-indigo/theme.css"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/primereact/resources/primereact.min.css"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/primeicons/primeicons.css"
        />
  
        {/* Ваши собственные стили */}
        <link
          rel="stylesheet"
          href="/styles/tanstack-table.css"
        />
      </>
    );
  }
  