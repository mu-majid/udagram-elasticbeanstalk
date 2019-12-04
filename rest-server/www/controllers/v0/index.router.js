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
const feed_router_1 = require("./feed/routes/feed.router");
const user_router_1 = require("./users/routes/user.router");
const router = express_1.Router();
router.use('/feed', feed_router_1.FeedRouter);
router.use('/users', user_router_1.UserRouter);
router.get('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.send(`V0`);
}));
exports.IndexRouter = router;
//# sourceMappingURL=index.router.js.map