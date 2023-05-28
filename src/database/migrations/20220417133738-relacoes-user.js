'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('Usuarios',{
      type: 'foreign key',
      fields:['cursoId'],
      name:'user_curso_fk',
      references:{
        table:'Cursos',
        field:'id'
      },
      onDelete: 'restrict',
      onUpdate: 'restrict'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Usuarios','foreign key');
  }
};
