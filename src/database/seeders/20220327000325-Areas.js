'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Areas', [
      {
      nome: 'Ciências Exatas',
      createdAt: new Date(),
      updatedAt: new Date(),
      },
      {
        nome: 'Ciências Humanas',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nome: 'Ciências Biológicas',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
