"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const passport_local_mongoose_1 = __importDefault(require("passport-local-mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        default: "",
        trim: "true",
        required: "username is required",
    },
    email: {
        type: String,
        default: "",
        trim: "true",
        required: "email address is required",
    },
    displayName: {
        type: String,
        default: "",
        trim: "true",
        required: "Display Name is required",
    },
    created: {
        type: Date,
        default: Date.now(),
    },
    update: {
        type: Date,
        default: Date.now(),
    },
}, {
    collection: "users",
});
let options = { missingPasswordError: "Wrong/ Missing Password" };
UserSchema.plugin(passport_local_mongoose_1.default, options);
const User = mongoose_1.default.model("User", UserSchema);
exports.default = User;
//# sourceMappingURL=user.js.map