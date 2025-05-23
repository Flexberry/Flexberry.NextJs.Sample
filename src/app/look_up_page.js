import React from 'react';
import LookUp from './look_up';

export default function LookUpPage() {
  const handleChange = (selected) => {
    console.log('Выбранный элемент:', selected);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Страница LookUp (look_up_page.js)</h2>
      <LookUp required={true} onChange={handleChange} />
    </div>
  );
}
