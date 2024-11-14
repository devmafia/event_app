'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.addColumn('Bookings', 'totalPrice', {
          type: Sequelize.FLOAT,
          allowNull: false,
      });
  },

  down: async (queryInterface, Sequelize) => {
      await queryInterface.removeColumn('Bookings', 'totalPrice');
  },
};
