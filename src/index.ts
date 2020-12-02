import WhereBuilder from './WhereBuilder';

const filtros = [
  {campo: 'autor', valores: ['1', '2', '3']},
  {campo: 'tipoPrato', valores: ['Entrada', 'Prato Principal']},
]

const where = WhereBuilder.create();

filtros.forEach(({ campo, valores }) => {
  where.and(campo, 'in', valores);
});

console.log(where.handle());