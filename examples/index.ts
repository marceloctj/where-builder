import { WhereBuilder } from '../src';

const filters = [
  {field: 'autor', values: ['1', '2', '3']},
  {field: 'tipoPrato', values: ['Entrada', 'Prato Principal']},
]

const where = WhereBuilder.create();

filters.forEach(({ field, values }) => {
  where.and(field, 'in', values);
});

console.log(where.handle());