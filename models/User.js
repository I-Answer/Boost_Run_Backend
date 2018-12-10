module.exports = (sequelize, DataTypes) => {
    return sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        password: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        nick: {
            type: DataTypes.STRING(30),
            allowNull: false,
            unique: true,
        },
        bitflag: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    }, {
        timestamps: false,
    });
};
