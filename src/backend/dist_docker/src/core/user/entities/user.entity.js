"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEntity = void 0;
class UserEntity {
    id;
    email;
    phone;
    hashedPassword;
    name;
    avatar;
    gender;
    birthdate;
    address;
    search;
    updatedAt;
    createdAt;
    roleId;
    role;
    constructor(id, email, phone, hashedPassword, name, avatar, gender, birthdate, address, search, updatedAt, createdAt, roleId, role) {
        this.id = id;
        this.email = email;
        this.phone = phone;
        this.hashedPassword = hashedPassword;
        this.name = name;
        this.avatar = avatar;
        this.gender = gender;
        this.birthdate = birthdate;
        this.address = address;
        this.search = search;
        this.updatedAt = updatedAt;
        this.createdAt = createdAt;
        this.roleId = roleId;
        this.role = role;
    }
    toJSON() {
        return {
            id: this.id,
            roleId: this.roleId,
            role: this.role ? this.role.toJSON() : undefined,
            name: this.name,
            email: this.email,
            phone: this.phone,
            avatar: this.avatar,
            gender: this.gender,
            birthdate: this.birthdate,
            address: this.address,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}
exports.UserEntity = UserEntity;
//# sourceMappingURL=user.entity.js.map