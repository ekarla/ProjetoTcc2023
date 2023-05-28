'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('Partidas',{
      type: 'foreign key',
      fields:['usuarioId'],
      name:'partida_usuario_fk',
      references:{
        table:'Usuarios',
        field:'id'
      },
      onDelete: 'restrict',
      onUpdate: 'restrict'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Partidas','foreign key');
  }
};
