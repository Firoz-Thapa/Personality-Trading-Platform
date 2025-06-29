import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import User from './User';

// Trait categories enum
export enum TraitCategory {
  CONFIDENCE = 'CONFIDENCE',
  COMMUNICATION = 'COMMUNICATION',
  LEADERSHIP = 'LEADERSHIP',
  CREATIVITY = 'CREATIVITY',
  EMPATHY = 'EMPATHY',
  HUMOR = 'HUMOR',
  ASSERTIVENESS = 'ASSERTIVENESS',
  CHARISMA = 'CHARISMA',
  PATIENCE = 'PATIENCE',
  NEGOTIATION = 'NEGOTIATION',
  PUBLIC_SPEAKING = 'PUBLIC_SPEAKING',
  OTHER = 'OTHER'
}

interface PersonalityTraitAttributes {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  category: TraitCategory;
  hourlyRate: number;
  dailyRate?: number;
  weeklyRate?: number;
  available: boolean;
  maxUsers: number;
  successRate: number;
  totalRentals: number;
  averageRating: number;
  verified: boolean;
  verificationData?: any;
  createdAt: Date;
  updatedAt: Date;
}

interface PersonalityTraitCreationAttributes extends Optional<PersonalityTraitAttributes, 
  'id' | 'dailyRate' | 'weeklyRate' | 'available' | 'maxUsers' | 'successRate' | 
  'totalRentals' | 'averageRating' | 'verified' | 'verificationData' | 'createdAt' | 'updatedAt'> {}

class PersonalityTrait extends Model<PersonalityTraitAttributes, PersonalityTraitCreationAttributes> 
  implements PersonalityTraitAttributes {
  
  public id!: string;
  public ownerId!: string;
  public name!: string;
  public description!: string;
  public category!: TraitCategory;
  public hourlyRate!: number;
  public dailyRate?: number;
  public weeklyRate?: number;
  public available!: boolean;
  public maxUsers!: number;
  public successRate!: number;
  public totalRentals!: number;
  public averageRating!: number;
  public verified!: boolean;
  public verificationData?: any;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Association helpers
  public getOwner!: () => Promise<User>;
  public setOwner!: (user: User) => Promise<void>;

  // Instance methods
  public calculateDailyRate(): number {
    return this.dailyRate || this.hourlyRate * 8;
  }

  public calculateWeeklyRate(): number {
    return this.weeklyRate || this.calculateDailyRate() * 5;
  }

  public isAffordable(budget: number): boolean {
    return this.hourlyRate <= budget;
  }

  public toJSON() {
    const values = { ...this.get() };
    return {
      ...values,
      // Include calculated rates
      calculatedDailyRate: this.calculateDailyRate(),
      calculatedWeeklyRate: this.calculateWeeklyRate(),
    };
  }
}

PersonalityTrait.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    ownerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        len: [3, 200],
        notEmpty: true,
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [10, 2000],
        notEmpty: true,
      },
    },
    category: {
      type: DataTypes.ENUM(...Object.values(TraitCategory)),
      allowNull: false,
    },
    hourlyRate: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 100, // Minimum $1.00
        max: 50000, // Maximum $500.00
      },
      comment: 'Rate in cents',
    },
    dailyRate: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 500, // Minimum $5.00
        max: 200000, // Maximum $2000.00
      },
      comment: 'Rate in cents',
    },
    weeklyRate: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 2000, // Minimum $20.00
        max: 1000000, // Maximum $10,000.00
      },
      comment: 'Rate in cents',
    },
    available: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    maxUsers: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      validate: {
        min: 1,
        max: 100,
      },
    },
    successRate: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0.00,
      validate: {
        min: 0,
        max: 100,
      },
    },
    totalRentals: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    averageRating: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0.00,
      validate: {
        min: 0,
        max: 5,
      },
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    verificationData: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'personality_traits',
    timestamps: true,
    indexes: [
      {
        fields: ['ownerId'],
      },
      {
        fields: ['category'],
      },
      {
        fields: ['available'],
      },
      {
        fields: ['category', 'available'],
      },
      {
        fields: ['averageRating'],
      },
      {
        fields: ['hourlyRate'],
      },
      {
        fields: ['verified'],
      },
    ],
  }
);

// Define associations
PersonalityTrait.belongsTo(User, {
  foreignKey: 'ownerId',
  as: 'owner',
});

User.hasMany(PersonalityTrait, {
  foreignKey: 'ownerId',
  as: 'traits',
});

export default PersonalityTrait;