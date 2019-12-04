"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = require("../models/User");
const auth_router_1 = require("./auth.router");
const router = express_1.Router();
router.use('/auth', auth_router_1.AuthRouter);
router.get('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
}));
router.get('/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
    let { id } = req.params;
    const item = yield User_1.User.findByPk(id);
    res.send(item);
}));
exports.UserRouter = router;
//# sourceMappingURL=user.router.js.map