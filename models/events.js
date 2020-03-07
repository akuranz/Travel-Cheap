module.exports = function(sequelize, DataTypes) {
  var Event = sequelize.define("Event", {
    cityName: DataTypes.STRING,
    name: DataTypes.STRING,
    date: DataTypes.STRING,
    time: DataTypes.STRING,
    venue: DataTypes.STRING,
    URL: DataTypes.STRING
  });

  Event.associate = function(models) {
    // We're saying that a Events should belong to an Trip
    // An event can't be created without an Trip due to the foreign key constraint
    Event.belongsTo(models.Trip, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Event;
};
