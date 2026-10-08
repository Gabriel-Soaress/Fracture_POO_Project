import { Personagem } from "../entidades/personagem";
import { Monstro } from "../entidades/monstro";
import { CalculadoraCombate } from "./CalculadoraCombate";
import { Item } from "../entidades/Item";

// Possíveis estados da batalha
export type EstadoCombate = 'EM_ANDAMENTO' | 'VITORIA_JOGADOR' | 'DERROTA_JOGADOR';

// Ações possíveis do jogador no turno
export type TipoAcaoJogador = 'ATACAR' | 'DEFENDER' | 'HABILIDADE_ESPECIAL' | 'USAR_ITEM';

// Pacotes de dados que o jogador envia na rodada
export interface ParametrosAcaoJogador {
    tipo: TipoAcaoJogador;
    tipoAtaque?: number; // 1 (Rápido), 2 (Pesado) ou 3 (Brutal)
    indiceItem?: number; // Posição do item no array de inventário do herói
}

export interface ResultadoTurno {
    rodada: number;
    estado: EstadoCombate;
    mensagensTurno: string[];
    heroiStatus: {
        nome: string;
        vidaAtual: number;
        vidaMaxima: number;
        energiaAtual: number;
        energiaMaxima: number;
    };
    monstroStatus: {
        nome: string;
        vidaAtual: number;
        vidaMaxima: number;
        energiaAtual: number;
        energiaMaxima: number;
    };
    lootConcedido?: Item;
    experienciaGanha?: number;
}

export class MotorCombate {
    private heroi: Personagem;
    private monstro: Monstro;
    private rodadaAtual: number;
    private estado: EstadoCombate;
    private logsBatalha: string[];

    constructor(heroi: Personagem, monstro: Monstro) {
        this.heroi = heroi;
        this.monstro = monstro;
        this.rodadaAtual = 1;
        this.estado = "EM_ANDAMENTO";
        this.logsBatalha = [];
    }

    public iniciarCombate(): { primeiroAJogar: string; mensagem: string } {
        // Validações
        if (!this.heroi.ativo) {
            throw new Error("Herói inativo não pode entrar em combate.");
        }

        if (this.heroi.jaDerrotouMonstro(this.monstro.getId())) {
            throw new Error("Este monstro já foi expurgado de Vaslen.");
        }

        // Iniciativa
        const inicHeroi = CalculadoraCombate.rolarIniciativa(this.heroi.getAgilidade());
        const inicMonstro = CalculadoraCombate.rolarIniciativa(this.monstro.getAgilidade());

        let primeiroAJogar = "HEROI";

        if (inicMonstro > inicHeroi) {
            primeiroAJogar = "MONSTRO";
        }

        // Registrar início
        this.logsBatalha.push(`O combate começou! Iniciativa definida: Herói (${inicHeroi}) vs Monstro (${inicMonstro}).`);

        return {
            primeiroAJogar,
            mensagem: `A batalha entre ${this.heroi.getNome()} e ${this.monstro.getNome()} começou!`
        };
    }

    public processarTurno(acao: ParametrosAcaoJogador): ResultadoTurno {
        // Validações de estado
        if (this.estado !== "EM_ANDAMENTO") {
            throw new Error("O combate já foi encerrado com estado: " + this.estado);
        }

        // Lista de mensagens da rodada atual
        const mensagensDestaRodada: string[] = [];

        // 1. Executa a ação do Jogador
        if (acao.tipo === "ATACAR") {
            const tipo = acao.tipoAtaque ?? 1; // 1 rápido, 2 pesado, 3 brutal
            const msgAtaque = this.heroi.ataque(this.monstro, tipo);
            mensagensDestaRodada.push(msgAtaque);
        } else if (acao.tipo === "DEFENDER") {
            this.heroi.defender();
            mensagensDestaRodada.push(`${this.heroi.getNome()} assumiu postura defensiva (+15 Energia e mitigação de dano).`);
        } else if (acao.tipo === "HABILIDADE_ESPECIAL") {
            const msgEsp = this.heroi.executarAcaoEspecial(this.monstro);
            mensagensDestaRodada.push(msgEsp);
        } else if (acao.tipo === "USAR_ITEM") {
            const idx = acao.indiceItem ?? 0;
            const msgItem = this.heroi.usarItemDoInventario(idx, this.heroi);
            mensagensDestaRodada.push(msgItem);
        }

        // 2. Checagem: O monstro morreu com o golpe do herói?
        if (this.monstro.estaDerrotado()) {
            const dadosVitoria = this.finalizarVitoria(mensagensDestaRodada);
            this.logsBatalha.push(...mensagensDestaRodada);
            return this.gerarRelatorioTurno(mensagensDestaRodada, dadosVitoria.loot, dadosVitoria.xp);
        } else {
            // 3. Monstro sobreviveu: contra-ataque imediato da IA
            const acaoMonstro = this.monstro.decidirAcao(this.heroi);
            mensagensDestaRodada.push(acaoMonstro.mensagem);

            // 4. Checagem: O herói morreu com o golpe do monstro?
            if (this.heroi.estaDerrotado()) {
                this.finalizarDerrota(mensagensDestaRodada);
                this.logsBatalha.push(...mensagensDestaRodada);
                return this.gerarRelatorioTurno(mensagensDestaRodada);
            }
        }

        // 5. Ambos continuam vivos: acumula os logs e avança para a próxima rodada
        this.logsBatalha.push(...mensagensDestaRodada);
        this.rodadaAtual++;

        return this.gerarRelatorioTurno(mensagensDestaRodada);
    }

    // --- MÉTODOS PRIVADOS AUXILIARES ---

    private finalizarVitoria(mensagens: string[]): { loot?: Item; xp: number } {
        this.estado = "VITORIA_JOGADOR";

        // Registra no mural de caçadas do herói
        this.heroi.registrarVitoriaContraMonstro(this.monstro.getId());

        // Concede experiência
        const xp = this.monstro.getExperienciaConcedida();
        this.heroi.ganharExperiencia(xp);
        mensagens.push(`🎉 Vitória! ${this.heroi.getNome()} derrotou ${this.monstro.getNome()} e ganhou ${xp} de XP.`);

        // Coleta e transfere o loot
        const loot = this.monstro.droparLoot();
        if (loot) {
            this.heroi.adicionarItemAoInventario(loot);
            mensagens.push(`🎁 [SISTEMA DE LOOT] Você saqueou: ${loot.getNome()}!`);
        }

        return { loot: loot ?? undefined, xp };
    }

    private finalizarDerrota(mensagens: string[]): void {
        this.estado = "DERROTA_JOGADOR";

        // Aplica o Soft Delete definitivo
        this.heroi.inativar();
        mensagens.push(`☠️ Derrota! ${this.heroi.getNome()} sucumbiu perante ${this.monstro.getNome()}. (Herói inativado via Soft Delete).`);
    }

    private gerarRelatorioTurno(mensagens: string[], loot?: Item, xp?: number): ResultadoTurno {
        return {
            rodada: this.rodadaAtual,
            estado: this.estado,
            mensagensTurno: [...mensagens],
            heroiStatus: {
                nome: this.heroi.getNome(),
                vidaAtual: this.heroi.getVidaAtual(),
                vidaMaxima: this.heroi.getVidaMaxima(),
                energiaAtual: this.heroi.getEnergiaAtual(),
                energiaMaxima: this.heroi.getEnergiaMaxima()
            },
            monstroStatus: {
                nome: this.monstro.getNome(),
                vidaAtual: this.monstro.getVidaAtual(),
                vidaMaxima: this.monstro.getVidaMaxima(),
                energiaAtual: this.monstro.getEnergiaAtual(),
                energiaMaxima: this.monstro.getEnergiaMaxima()
            },
            lootConcedido: loot,
            experienciaGanha: xp
        };
    }

    // --- GETTERS DE CONSULTA ---

    public getHeroi(): Personagem {
        return this.heroi;
    }

    public getMonstro(): Monstro {
        return this.monstro;
    }

    public getRodadaAtual(): number {
        return this.rodadaAtual;
    }

    public getEstado(): EstadoCombate {
        return this.estado;
    }

    public getLogsBatalha(): string[] {
        return [...this.logsBatalha];
    }
}