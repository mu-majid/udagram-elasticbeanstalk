"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sequelize_1 = require("./sequelize");
const index_router_1 = require("./controllers/v0/index.router");
const body_parser_1 = __importDefault(require("body-parser"));
const model_index_1 = require("./controllers/v0/model.index");
(() => __awaiter(this, void 0, void 0, function* () {
    yield sequelize_1.sequelize.addModels(model_index_1.V0MODELS);
    yield sequelize_1.sequelize.sync();
    const app = express_1.default();
    const port = process.env.PORT || 8080; // default port to listen
    app.use(body_parser_1.default.json());
    //CORS Should be restricted
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "http://localhost:8100");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        next();
    });
    app.use('/api/v0/', index_router_1.IndexRouter);
    // Root URI call
    app.get("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
        res.send("/api/v0/");
    }));
    // Start the Server
    app.listen(port, () => {
        console.log(`server running http://localhost:${port}`);
        console.log(`press CTRL+C to stop server`);
    });
}))();
//# sourceMappingURL=server.js.map