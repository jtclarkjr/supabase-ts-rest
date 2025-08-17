"use strict";
/**
 * Supabase REST Client for TypeScript/Node.js
 *
 * A lightweight, flexible TypeScript client designed to simplify interactions
 * with Supabase's REST API, providing a seamless middleware solution for
 * handling authenticated requests and Row Level Security (RLS) integrations.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSupabaseClient = void 0;
exports.createClient = createClient;
const index_1 = require("./client/index");
Object.defineProperty(exports, "createSupabaseClient", { enumerable: true, get: function () { return index_1.createSupabaseClient; } });
__exportStar(require("./types"), exports);
__exportStar(require("./utils/constants"), exports);
// Convenience function to create a new client
function createClient(baseUrl, apiKey, token) {
    return (0, index_1.createSupabaseClient)({ baseUrl, apiKey, token });
}
//# sourceMappingURL=index.js.map