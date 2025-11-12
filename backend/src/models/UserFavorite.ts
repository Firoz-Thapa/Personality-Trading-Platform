// backend/src/models/UserFavorite.ts
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import User from './User';
import PersonalityTrait from './PersonalityTrait';

interface UserFavoriteAttributes {
  id: string;
  userId: string;
  traitId: string;
  createdAt: Date;
}

interface UserFavoriteCreationAttributes extends Optional<UserFavoriteAttributes, 'id' | 'createdAt'> {}

class UserFavorite extends Model<UserFavoriteAttributes, UserFavoriteCreationAttributes> 
  implements UserFavoriteAttributes {
  
  public id!: string;
  public userId!: string;
  public traitId!: string;
  public readonly createdAt!: Date;
}

UserFavorite.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    traitId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: PersonalityTrait,
        key: 'id',
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'user_favorites',
    timestamps: false, // We're managing createdAt manually
    indexes: [
      {
        unique: true,
        fields: ['userId', 'traitId'],
      },
      {
        fields: ['userId'],
      },
      {
        fields: ['traitId'],
      },
    ],
  }
);

// Define associations
UserFavorite.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

UserFavorite.belongsTo(PersonalityTrait, {
  foreignKey: 'traitId',
  as: 'trait',
});

User.hasMany(UserFavorite, {
  foreignKey: 'userId',
  as: 'favorites',
});

PersonalityTrait.hasMany(UserFavorite, {
  foreignKey: 'traitId',
  as: 'favoritedBy',
});

export default UserFavorite;