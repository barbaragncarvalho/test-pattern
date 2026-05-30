import { CheckoutService } from '../src/services/CheckoutService.js';
import { CarrinhoBuilder } from '../tests/builders/CarrinhoBuilder.js';
import { UserMother } from '../tests/builders/UserMother.js';
import { jest } from '@jest/globals';

describe('CheckoutService', () => {
    describe('quando o pagamento falha', () => {

        test('deve cancelar o processamento e retornar null', async () => {
            const carrinho = CarrinhoBuilder.umCarrinho().build();
            const dadosCartao = { numero: '1234-5678-9012-3456', cvv: '123' };

            const gatewayStub = {
                cobrar: jest.fn().mockResolvedValue({ success: false })
            };

            const repositoryDummy = {};
            const emailServiceDummy = {};

            const checkoutService = new CheckoutService(
                gatewayStub,
                repositoryDummy,
                emailServiceDummy
            );

            const pedido = await checkoutService.processarPedido(carrinho, dadosCartao);
            expect(pedido).toBeNull();
        });

    });

    describe('quando um cliente Premium finaliza a compra', () => {

        test('deve aplicar desconto de 10%, cobrar o valor correto e enviar e-mail de confirmação', async () => {
            const usuarioPremium = UserMother.umUsuarioPremium();
            usuarioPremium.email = 'premium@email.com';

            const itensCustomizados = [
                { id: 201, nome: 'Item A', preco: 150.00, quantity: 1 },
                { id: 202, nome: 'Item B', preco: 50.00, quantity: 1 }
            ];
            const carrinho = CarrinhoBuilder.umCarrinho()
                .comUser(usuarioPremium)
                .comItens(itensCustomizados)
                .build();

            const dadosCartao = { numero: '1111-2222-3333-4444', cvv: '999' };

            const gatewayStub = {
                cobrar: jest.fn().mockResolvedValue({ success: true })
            };

            const pedidoRepositoryStub = {
                salvar: jest.fn().mockImplementation((pedido) => {
                    pedido.id = 42;
                    return Promise.resolve(pedido);
                })
            };

            const emailMock = {
                enviarEmail: jest.fn().mockResolvedValue(true)
            };

            const checkoutService = new CheckoutService(
                gatewayStub,
                pedidoRepositoryStub,
                emailMock
            );

            await checkoutService.processarPedido(carrinho, dadosCartao);

            expect(gatewayStub.cobrar).toHaveBeenCalledWith(180, dadosCartao);

            expect(emailMock.enviarEmail).toHaveBeenCalledTimes(1);

            expect(emailMock.enviarEmail).toHaveBeenCalledWith(
                'premium@email.com',
                'Seu Pedido foi Aprovado!',
                'Pedido 42 no valor de R$180'
            );
        });
    });
});