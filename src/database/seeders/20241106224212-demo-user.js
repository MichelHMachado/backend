'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'users',
      [
        {
          uuid: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
          name: 'John Doe',
          email: 'john@example.com',
          password:
            '$2b$10$Wl1q84QbzGd7F0vZICt9DO0HZhrl7U2fXvbdVgk0Sjl3Xpg.Tbd3W', // hashed-password
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          uuid: '9b1deb4d-0e4a-4fbc-a7fc-1d8c7f5a7e17',
          name: 'Jane Smith',
          email: 'jane@example.com',
          password:
            '$2b$10$Wl1q84QbzGd7F0vZICt9DO0HZhrl7U2fXvbdVgk0Sjl3Xpg.Tbd3W', // hashed-password
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
