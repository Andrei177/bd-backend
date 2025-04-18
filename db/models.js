import { sequelize } from "./db.js";
import { DataTypes } from "sequelize";

// hasOne (Один-к-одному)
// belongsTo (Принадлежит)
// hasMany (Один-ко-многим)
// belongsToMany (Многие-ко-многим)

export const User = sequelize.define('users', {
    user_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_snils: { type: DataTypes.STRING, unique: true},
    user_password: { type: DataTypes.STRING },
    role_id: { type: DataTypes.INTEGER },
},
{
    timestamps: false
})
export const Role = sequelize.define('role', {
    role_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    role_name: { type: DataTypes.STRING }
},
{
    timestamps: false,
    tableName: 'role'
})

export const Enrollee = sequelize.define('enrollee', {
    enrollee_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    first_name: { type: DataTypes.STRING },
    last_name: { type: DataTypes.STRING },
    patronymic: { type: DataTypes.STRING },
    passport_series: {type: DataTypes.INTEGER},
    passport_number: {type: DataTypes.INTEGER},
    user_id: {type: DataTypes.INTEGER}
},
{
    timestamps: false,
    tableName: 'enrollee'
})
export const Subject = sequelize.define('subject', {
    subject_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name_subject: { type: DataTypes.STRING }
},
{
    timestamps: false,
    tableName: 'subject'
})
export const EnrolleeSubject = sequelize.define('enrollee_subject', {
    enrollee_subject_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    enrollee_id: {type: DataTypes.INTEGER},
    subject_id: {type: DataTypes.INTEGER},
    result: { type: DataTypes.SMALLINT }
},
{
    timestamps: false,
    tableName: 'enrollee_subject'
})

export const EnrolleePassport = sequelize.define('enrollee_passport', {
    enrollee_passport_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    enrollee_id: {type: DataTypes.INTEGER},
    passport_img_url: {type: DataTypes.STRING}
},
{
    timestamps: false,
    tableName: 'enrollee_passport'
})

export const Direction = sequelize.define('direction', {
    direction_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name_direction: { type: DataTypes.STRING },
    faculty_id: { type: DataTypes.INTEGER},
    plan: {type: DataTypes.SMALLINT},
    number_direction: {type: DataTypes.STRING}
},
{
    timestamps: false,
    tableName: 'direction'
})
export const Faculty = sequelize.define('faculty', {
    faculty_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name_faculty: { type: DataTypes.STRING }
},
{
    timestamps: false,
    tableName: 'faculty'
})

export const Achievement = sequelize.define('achievement', {
    achievement_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name_achievement: { type: DataTypes.STRING },
    bonus: {type: DataTypes.SMALLINT}
},
{
    timestamps: false,
    tableName: 'achievement'
})

export const DirectionEnrollee = sequelize.define('direction_enrollee', {
    direction_enrollee_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    enrollee_id: {type: DataTypes.INTEGER},
    direction_id: {type: DataTypes.INTEGER}
},
{
    timestamps: false,
    tableName: 'direction_enrollee'
})

export const DirectionSubject = sequelize.define('direction_subject', {
    direction_subject_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    subject_id: {type: DataTypes.INTEGER},
    direction_id: {type: DataTypes.INTEGER},
    min_result: {type: DataTypes.SMALLINT}
},
{
    timestamps: false,
    tableName: 'direction_subject'
})

export const EnrolleeAchievement = sequelize.define('enrollee_achievement', {
    enrollee_achiev_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    enrollee_id: {type: DataTypes.INTEGER},
    achievement_id: {type: DataTypes.INTEGER},
    achievement_file_url: {type: DataTypes.STRING}
},
{
    timestamps: false,
    tableName: 'enrollee_achievement'
})

export const EnrolleeCertificate = sequelize.define('enrollee_certificate', {
    enrollee_certificate_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    enrollee_id: {type: DataTypes.INTEGER},
    certificate_img_url: {type: DataTypes.STRING}
},
{
    timestamps: false,
    tableName: 'enrollee_certificate'
})

Role.hasMany(User, {foreignKey: 'role_id'}) //Роль имеет много пользователей
User.belongsTo(Role, {foreignKey: 'role_id'}) //Пользователь принадлежит одной роли

Faculty.hasMany(Direction, {foreignKey: 'faculty_id'})
Direction.belongsTo(Faculty, {foreignKey: 'faculty_id'})

Enrollee.belongsToMany(Subject, {through: EnrolleeSubject, foreignKey: "enrollee_id", otherKey: "subject_id"})
Subject.belongsToMany(Enrollee, {through: EnrolleeSubject, foreignKey: "subject_id", otherKey: "enrollee_id"})

Enrollee.hasMany(EnrolleePassport, {foreignKey: 'enrollee_id'})
EnrolleePassport.belongsTo(Enrollee, {foreignKey: 'enrollee_id'})

Enrollee.belongsToMany(Direction, {through: DirectionEnrollee, foreignKey: "enrollee_id", otherKey: "direction_id"})
Direction.belongsToMany(Enrollee, {through: DirectionEnrollee, foreignKey: "direction_id", otherKey: "enrollee_id"})

Direction.belongsToMany(Subject, {through: DirectionSubject, foreignKey: "direction_id", otherKey: "subject_id"})
Subject.belongsToMany(Direction, {through: DirectionSubject, foreignKey: "subject_id", otherKey: "direction_id"})

Enrollee.belongsToMany(Achievement, {
    through: EnrolleeAchievement,
    foreignKey: 'enrollee_id',       // Поле в промежуточной таблице
    otherKey: 'achievement_id'       // Поле для связанной модели
  })
  
  Achievement.belongsToMany(Enrollee, {
    through: EnrolleeAchievement,
    foreignKey: 'achievement_id',    // Поле в промежуточной таблице
    otherKey: 'enrollee_id'          // Поле для связанной модели
  })

Enrollee.hasMany(EnrolleeCertificate, {foreignKey: 'enrollee_id'})
EnrolleeCertificate.belongsTo(Enrollee, {foreignKey: 'enrollee_id'})