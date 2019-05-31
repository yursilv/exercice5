const h = require('../../utils/hash');

exports.seed = (knex, Promise) => {
    return knex('users').del()
        .then(async () => {
            const p = await h.hashPassword('val123');
            return knex('users').insert({
                login: 'valentin23',
                mail: 'valentin23@gmail.com',
                password: p,
                firstName: 'Валентин',
                lastName: 'Громов',
                avatar: 'http://yursilv.alwaysdata.net/img/val.jpg',
            });
        })
        .then(async () => {
            const p = await h.hashPassword('oleg2348');
            return knex('users').insert({
                login: 'oleghari',
                mail: 'oleghari@gmail.com',
                password: p,
                firstName: 'Олег',
                lastName: 'Харитонов',
            });
        })
        .then(async () => {
            const p = await h.hashPassword('Natamur332');
            return knex('users').insert({
                login: 'natamur',
                mail: 'natamur@mail.ru',
                password: p,
                firstName: 'Наталья',
                lastName: 'Муравьёва',
                avatar: 'http://yursilv.alwaysdata.net/img/nat.jpg',
            });
        })
        .then(async () => {
            const p = await h.hashPassword('matveeva50');
            return knex('users').insert({
                login: 'laragoe',
                mail: 'laragoe@rambler.ru',
                password: p,
                firstName: 'Лариса',
                lastName: 'Матвеева',
                avatar: 'http://yursilv.alwaysdata.net/img/lar.jpg',
            });
        })
        .then(async () => {
            const p = await h.hashPassword('std33fb');
            return knex('users').insert({
                login: 'stepka44',
                mail: 'stepka44@yahoo.com',
                password: p,
                firstName: 'Степан',
                lastName: 'Кудрявцев',
                avatar: 'http://yursilv.alwaysdata.net/img/step.jpg',
            });
        });
};
