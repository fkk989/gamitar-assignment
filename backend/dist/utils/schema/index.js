"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageSchmea = void 0;
const zod_1 = require("zod");
exports.messageSchmea = zod_1.z.object({
    type: zod_1.z.string(),
    payload: zod_1.z.object({
        row: zod_1.z.number(),
        col: zod_1.z.number(),
        char: zod_1.z.string(),
    }),
});
