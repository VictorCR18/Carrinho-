"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProdutoRepository = void 0;
const connection_1 = __importDefault(require("@/config/database/connection"));
class ProdutoRepository {
    async findAll() {
        return connection_1.default.produto.findMany();
    }
    async findById(id) {
        return connection_1.default.produto.findUnique({ where: { id } });
    }
    async create(data) {
        return connection_1.default.produto.create({ data });
    }
    async update(id, data) {
        return connection_1.default.produto.update({ where: { id }, data });
    }
    async delete(id) {
        return connection_1.default.produto.delete({ where: { id } });
    }
}
exports.ProdutoRepository = ProdutoRepository;
