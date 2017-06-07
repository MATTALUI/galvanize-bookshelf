exports.up = function(knex, Promise) {
  return knex.schema.createTable('favorites', function(table){
    table.increments('id');
    table.integer('book_id').notNullable().index().references('books.id').onDelete('CASCADE');
    table.integer('user_id').notNullable().index().references('users.id').onDelete('CASCADE');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('favorites');
};
