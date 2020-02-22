module.exports = function(sequelize, DataTypes) {
  var Flight = sequelize.define("Flight", {
    price: DataTypes.STRING,
    departureDate: DataTypes.STRING,
    arrivalDate: DataTypes.STRING
    // price: DataTypes.INTEGER,
    // departureDate: DataTypes.DATEONLY,
    // arrivalDate: DataTypes.DATEONLY
  });

  Flight.associate = function(models) {
    // We're saying that a s should belong to an Trip
    // An event can't be created without an Trip due to the foreign key constraint
    Flight.belongsTo(models.Trip, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Flight;
};
