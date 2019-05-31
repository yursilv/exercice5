exports.up = (knex) => {
    return knex.schema.createTable('users', (table) => {
        table.increments();
        table.string('login').notNullable().unique();
        table.string('mail').notNullable().unique();
        table.string('password').notNullable();
        table.string('firstName');
        table.string('lastName');
        table.string('avatar');
    });
};

exports.down = (knex) => {
    return knex.schema.dropTable('users');
};
