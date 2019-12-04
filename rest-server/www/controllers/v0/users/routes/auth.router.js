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
const User_1 = require("../models/User");
const bcrypt = __importStar(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
const EmailValidator = __importStar(require("email-validator"));
const config_1 = require("../../../../config/config");
const router = express_1.Router();
function generatePassword(plainTextPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        //@TODO Use Bcrypt to Generated Salted Hashed Passwords
        const saltRounds = 5;
        const salt = yield bcrypt.genSalt(saltRounds);
        const hashedPass = yield bcrypt.hash(plainTextPassword, salt);
        return hashedPass;
    });
}
function comparePasswords(plainTextPassword, hash) {
    return __awaiter(this, void 0, void 0, function* () {
        //@TODO Use Bcrypt to Compare your password to your Salted Hashed Password
        return yield bcrypt.compare(plainTextPassword, hash);
    });
}
function generateJWT(user) {
    //@TODO Use jwt to create a new JWT Payload containing
    return jwt.sign(user, config_1.config.jwt.secret);
}
function requireAuth(req, res, next) {
    if (!req.headers || !req.headers.authorization) {
        return res.status(401).send({ message: 'No authorization headers.' });
    }
    const token_bearer = req.headers.authorization.split(' ');
    if (token_bearer.length != 2) {
        return res.status(401).send({ message: 'Malformed token.' });
    }
    const token = token_bearer[1];
    return jwt.verify(token, config_1.config.jwt.secret, (err, decoded) => {
        if (err) {
            return res.status(500).send({ auth: false, message: 'Failed to authenticate.' });
        }
        return next();
    });
}
exports.requireAuth = requireAuth;
router.get('/verification', requireAuth, (req, res) => __awaiter(this, void 0, void 0, function* () {
    return res.status(200).send({ auth: true, message: 'Authenticated.' });
}));
router.post('/login', (req, res) => __awaiter(this, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    // check email is valid
    if (!email || !EmailValidator.validate(email)) {
        return res.status(400).send({ auth: false, message: 'Email is required or malformed' });
    }
    // check email password valid
    if (!password) {
        return res.status(400).send({ auth: false, message: 'Password is required' });
    }
    const user = yield User_1.User.findByPk(email);
    // check that user exists
    if (!user) {
        return res.status(401).send({ auth: false, message: 'Unauthorized' });
    }
    // check that the password matches
    const authValid = yield comparePasswords(password, user.password_hash);
    if (!authValid) {
        return res.status(401).send({ auth: false, message: 'Unauthorized' });
    }
    // Generate JWT
    const jwt = generateJWT(user);
    res.status(200).send({ auth: true, token: jwt, user: user.short() });
}));
//register a new user
router.post('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
    const email = req.body.email;
    const plainTextPassword = req.body.password;
    // check email is valid
    if (!email || !EmailValidator.validate(email)) {
        return res.status(400).send({ auth: false, message: 'Email is required or malformed' });
    }
    // check email password valid
    if (!plainTextPassword) {
        return res.status(400).send({ auth: false, message: 'Password is required' });
    }
    // find the user
    const user = yield User_1.User.findByPk(email);
    // check that user doesnt exists
    if (user) {
        return res.status(422).send({ auth: false, message: 'User may already exist' });
    }
    const password_hash = yield generatePassword(plainTextPassword);
    const newUser = yield new User_1.User({
        email: email,
        password_hash: password_hash
    });
    let savedUser;
    try {
        savedUser = yield newUser.save();
    }
    catch (e) {
        throw e;
    }
    // Generate JWT
    const jwt = generateJWT(savedUser);
    res.status(201).send({ token: jwt, user: savedUser.short() });
}));
router.get('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.send('auth');
}));
exports.AuthRouter = router;
//# sourceMappingURL=auth.router.js.map