module.exports = function(sequelize, DataTypes) {
  var Trip = sequelize.define("Trip", {
    // cityName: DataTypes.STRING,
    // departureDate: DataTypes.STRING,
    // arrivalDate: DataTypes.STRING,
    cityName: DataTypes.STRING,
    departureDate: DataTypes.DATEONLY,
    arrivalDate: DataTypes.DATEONLY
  });

  Trip.associate = function(models) {
    // We're saying that a Trip should belong to an User
    // An event can't be created without an User due to the foreign key constrain
    Trip.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
    // Associating Trip with Events and Flights
    // When an Trip is deleted, also delete any associated Events and Flights
    Trip.hasMany(models.Event, {
      onDelete: "cascade"
    });

    Trip.hasMany(models.Flight, {
      onDelete: "cascade"
    });
  };

  return Trip;
};
