'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('categories', [
      {
        uuid: '8f14e45f-ea57-4d8a-88ee-ff1b64b7b7b0',
        name: 'Energy',
        userUuid: '9b1deb4d-0e4a-4fbc-a7fc-1d8c7f5a7e17',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('categories', null, {});
  },
};
