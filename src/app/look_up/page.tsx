'use client';
import React from 'react';
import LookUp from '../look_up/look_up';

export default function LookUpPage() {
  const handleChange = (selected: any) => {
    console.log('Выбранный элемент:', selected);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>LookUp страница</h2>
      <LookUp required={true} onChange={handleChange} />
    </div>
  );
}
