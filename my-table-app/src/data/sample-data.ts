// src/data/sample-data.ts

// Определяем интерфейс для наших данных (TypeScript):
export interface Person {
  id: number
  name: string
  age: number
  birthday: string    // дата рождения в формате YYYY-MM-DD
  active: boolean
}

// Массив объектов Person
export const initialData: Person[] = [
  { id: 1, name: 'Алексей Смирнов',      age: 29, birthday: '1996-02-14', active: true  },
  { id: 2, name: 'Мария Иванова',        age: 34, birthday: '1989-08-03', active: false },
  { id: 3, name: 'Дмитрий Кузнецов',     age: 42, birthday: '1981-11-22', active: true  },
  { id: 4, name: 'Елена Петрова',        age: 27, birthday: '1996-05-30', active: true  },
  { id: 5, name: 'Сергей Николаев',      age: 38, birthday: '1985-01-18', active: false },
  { id: 6, name: 'Ольга Попова',         age: 31, birthday: '1992-12-07', active: true  },
  { id: 7, name: 'Андрей Волков',        age: 45, birthday: '1978-06-15', active: true  },
  { id: 8, name: 'Наталья Соколова',     age: 24, birthday: '1999-10-02', active: false },
]
