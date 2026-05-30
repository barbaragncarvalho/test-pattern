import { Carrinho } from '../../src/domain/Carrinho.js';
import { UserMother } from './UserMother.js';

export class CarrinhoBuilder {
    constructor() {
        this.user = UserMother.umUsuarioPadrao();
        this.itens = [
            { id: 101, nome: 'Produto qualquer', preco: 50.00, quantidade: 1 }
        ];
    }

    static umCarrinho() {
        return new CarrinhoBuilder();
    }

    comUser(user) {
        this.user = user;
        return this;
    }

    comItens(novosItens) {
        this.itens = novosItens;
        return this;
    }

    vazio() {
        this.itens = [];
        return this;
    }

    build() {
        return new Carrinho(this.user, this.itens);
    }
}