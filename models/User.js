module.exports = (sequelize, DataTypes) => {
    return sequelize.define('User', {
        id: {
            type: DataTypes.STRING(30),
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
        },
        maxSpeed: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        maxTime: {
            type: DataTypes.INTEGER,
            allowNull: true,
        }
    }, {
        timestamps: false,
    });
};
