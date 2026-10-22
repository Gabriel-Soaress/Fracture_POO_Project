import { MotorCombate } from "../../dominio/servicos/MotorCombate";
import { Personagem } from "../../dominio/entidades/personagem";
import { Monstro } from "../../dominio/entidades/monstro";
import crypto from "crypto";

export interface SessaoCombate {
    id: string;
    usuarioId: number;
    personagemId: number;
    monstroId: number;
    motor: MotorCombate;
    criadoEm: Date;
    ultimaAtividade: Date;
}

/**
 * Gerenciador de Sessões de Combate em Memória (Singleton).
 * Controla os duelos ativos em tempo real no servidor para evitar manipulação de estado.
 */
export class GerenciadorSessaoCombate {
    private static instancia: GerenciadorSessaoCombate;
    private sessoes: Map<string, SessaoCombate>;

    private constructor() {
        this.sessoes = new Map();
        // Limpeza periódica de batalhas abandonadas (a cada 15 minutos)
        setInterval(() => this.limparSessoesAntigas(30), 15 * 60 * 1000).unref();
    }

    public static getInstancia(): GerenciadorSessaoCombate {
        if (!GerenciadorSessaoCombate.instancia) {
            GerenciadorSessaoCombate.instancia = new GerenciadorSessaoCombate();
        }
        return GerenciadorSessaoCombate.instancia;
    }

    /**
     * Cria e registra uma nova sessão de batalha para o jogador.
     */
    public criarSessao(usuarioId: number, heroi: Personagem, monstro: Monstro): SessaoCombate {
        const id = crypto.randomUUID();
        const motor = new MotorCombate(heroi, monstro);

        const sessao: SessaoCombate = {
            id,
            usuarioId,
            personagemId: heroi.getId()!,
            monstroId: monstro.getId(),
            motor,
            criadoEm: new Date(),
            ultimaAtividade: new Date()
        };

        this.sessoes.set(id, sessao);
        return sessao;
    }

    /**
     * Localiza uma sessão de combate ativa.
     */
    public obterSessao(sessaoId: string): SessaoCombate | undefined {
        const sessao = this.sessoes.get(sessaoId);
        if (sessao) {
            sessao.ultimaAtividade = new Date();
        }
        return sessao;
    }

    /**
     * Remove a sessão após a finalização do combate.
     */
    public encerrarSessao(sessaoId: string): void {
        this.sessoes.delete(sessaoId);
    }

    /**
     * Remove sessões inativas há mais de X minutos.
     */
    public limparSessoesAntigas(minutosValidade: number): void {
        const agora = Date.now();
        const limite = minutosValidade * 60 * 1000;

        for (const [id, sessao] of this.sessoes.entries()) {
            if (agora - sessao.ultimaAtividade.getTime() > limite) {
                this.sessoes.delete(id);
            }
        }
    }
}
