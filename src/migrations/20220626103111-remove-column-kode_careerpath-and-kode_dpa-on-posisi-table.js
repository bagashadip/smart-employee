"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('tbl_posisi', 'kode_careerpath'),
      queryInterface.removeColumn('tbl_posisi', 'kode_dpa')
    ]);
  },
  down: (queryInterface, Sequelize) => {
    
  },
};
