const data =  require('../data.js');
exports.seed = function(knex, Promise) {
  return knex('books')
  .del()
    .then(function () {
      return knex('books').insert(data);
    })
    .then(function(){
      return knex.raw("SELECT setval('books_id_seq', (SELECT MAX(id) FROM books));");
    });
};
