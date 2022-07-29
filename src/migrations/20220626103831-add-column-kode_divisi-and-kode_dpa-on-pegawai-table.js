"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('tbl_pegawai', 'kode_divisi', {
        type: Sequelize.STRING
      }),
      queryInterface.addColumn('tbl_pegawai', 'kode_dpa', {
        type: Sequelize.STRING
      })
    ]);
  },
  down: (queryInterface, Sequelize) => {
    
  },
};
