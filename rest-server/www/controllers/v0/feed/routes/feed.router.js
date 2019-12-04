"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const FeedItem_1 = require("../models/FeedItem");
const auth_router_1 = require("../../users/routes/auth.router");
const AWS = __importStar(require("../../../../aws"));
const router = express_1.Router();
// Get all feed items
router.get('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
    const items = yield FeedItem_1.FeedItem.findAndCountAll({ order: [['id', 'DESC']] });
    items.rows.map((item) => {
        if (item.url) {
            item.url = AWS.getGetSignedUrl(item.url);
        }
    });
    res.send(items);
}));
//@TODO
//Add an endpoint to GET a specific resource by Primary Key
router.get('/:id', auth_router_1.requireAuth, (req, res) => __awaiter(this, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        return res.status(400).send('Feed Id is Required');
    }
    const feedItem = yield FeedItem_1.FeedItem.findByPk(id);
    if (!feedItem) {
        return res.status(404).json({
            statusCode: 404,
            message: `FeedItem With id ${id} Was Not Found`
        });
    }
    if (feedItem.url) {
        feedItem.url = AWS.getGetSignedUrl(feedItem.url);
    }
    return res.status(200).send(feedItem);
}));
// update a specific resource
router.patch('/:id', auth_router_1.requireAuth, (req, res) => __awaiter(this, void 0, void 0, function* () {
    //@TODO try it yourself
    const { id } = req.params;
    const { body: update } = req;
    if (!id) {
        res.status(400).send('Id to update is required');
    }
    const updatedData = yield FeedItem_1.FeedItem.update({ caption: update.caption }, { where: { id } });
    res.status(200).send(updatedData);
}));
// Get a signed url to put a new item in the bucket
router.get('/signed-url/:fileName', auth_router_1.requireAuth, (req, res) => __awaiter(this, void 0, void 0, function* () {
    let { fileName } = req.params;
    const url = AWS.getPutSignedUrl(fileName);
    res.status(201).send({ url: url });
}));
// Post meta data and the filename after a file is uploaded 
// NOTE the file name is they key name in the s3 bucket.
// body : {caption: string, fileName: string};
router.post('/', auth_router_1.requireAuth, (req, res) => __awaiter(this, void 0, void 0, function* () {
    const caption = req.body.caption;
    const fileName = req.body.url;
    // check Caption is valid
    if (!caption) {
        return res.status(400).send({ message: 'Caption is required or malformed' });
    }
    // check Filename is valid
    if (!fileName) {
        return res.status(400).send({ message: 'File url is required' });
    }
    const item = yield new FeedItem_1.FeedItem({
        caption: caption,
        url: fileName
    });
    const saved_item = yield item.save();
    saved_item.url = AWS.getGetSignedUrl(saved_item.url);
    res.status(201).send(saved_item);
}));
exports.FeedRouter = router;
//# sourceMappingURL=feed.router.js.map