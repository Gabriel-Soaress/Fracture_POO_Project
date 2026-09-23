import { EntidadeCombatente } from "./EntidadeCombatente";
import { Item } from "./Item";

export class Monstro extends EntidadeCombatente {
    public tipoMonstro: 'COMUM' | 'ELITE' | 'CHEFE';
    public experienciaConcedida: number;
    public descricaoLore: string;
    public itemRecompensa?: Item;

    constructor(
        nome: string,
        nivel: number,
        vidaMaxima: number,
        vidaAtual: number,
        energiaMaxima: number,
        forca: number,
        defesa: number,
        agilidade: number,
        tipoMonstro: 'COMUM' | 'ELITE' | 'CHEFE',
        experienciaConcedida: number,
        descricaoLore: string,
        itemRecompensa?: Item,
        id?: number
    ) {
        super(nome, nivel, vidaMaxima, vidaAtual, energiaMaxima, forca, defesa, agilidade, id);
        this.tipoMonstro = tipoMonstro;
        this.experienciaConcedida = experienciaConcedida;
        this.descricaoLore = descricaoLore;
        this.itemRecompensa = itemRecompensa;
    }

    ataque(alvo: EntidadeCombatente, tipoAtaque: number): string {
        if (tipoAtaque === 1) {
            const custo = Math.round(this.energiaMaxima * 0.10);
            if (this.gastarEnergia(custo)) {
                const dano = super.atacar(alvo, 1);
                return `${this.nome} desferiu um Golpe Rápido em ${alvo.getNome()} com ${dano} de dano.`;
            } else {
                return `${this.nome} não tem energia para atacar.`;
            }
        } else if (tipoAtaque === 2) {
            const custo = Math.round(this.energiaMaxima * 0.25);
            if (this.gastarEnergia(custo)) {
                const dano = super.atacar(alvo, 1.5);
                return `${this.nome} desferiu um Golpe Pesado em ${alvo.getNome()} com ${dano} de dano.`;
            } else {
                return `${this.nome} não tem energia para atacar.`;
            }
        } else if (tipoAtaque === 3) {
            const custo = Math.round(this.energiaMaxima * 0.35);
            if (this.gastarEnergia(custo)) {
                const dano = super.atacar(alvo, 1.7);
                return `${this.nome} desferiu um Ataque Brutal em ${alvo.getNome()} com ${dano} de dano.`;
            } else {
                return `${this.nome} não tem energia para atacar.`;
            }
        }

        return "Tipo de ataque inválido.";
    }

    decidirAcao(alvo: EntidadeCombatente): { tipo: 'ATACAR' | 'DEFENDER' | 'ESPECIAL'; mensagem: string } {
        // Redefine a postura defensiva da rodada anterior antes de agir
        this.redefinirDefesa();

        // 1. IA de Sobrevivência/Recuperação: Se a energia estiver muito baixa (< 20%), defende para recuperar estamina
        if (this.energiaAtual < Math.round(this.energiaMaxima * 0.20)) {
            this.defender();
            return {
                tipo: 'DEFENDER',
                mensagem: `${this.nome} recuou em postura defensiva para recuperar energia e mitigar danos.`
            };
        }

        // 2. IA de Fúria/Desespero: Vida crítica (<= 35%) com energia suficiente (>= 50%) -> tenta Ação Especial
        const percentualVida = this.vidaAtual / this.vidaMaxima;
        const custoEspecial = Math.round(this.energiaMaxima * 0.50);

        if (percentualVida <= 0.35 && this.energiaAtual >= custoEspecial) {
            const mensagemEspecial = this.executarAcaoEspecial(alvo);
            return {
                tipo: 'ESPECIAL',
                mensagem: mensagemEspecial
            };
        }

        // 3. IA Tática de Seleção Autônoma entre os 3 Ataques:
        const custoAtaque3 = Math.round(this.energiaMaxima * 0.35);
        const custoAtaque2 = Math.round(this.energiaMaxima * 0.25);
        const custoAtaque1 = Math.round(this.energiaMaxima * 0.10);

        let tipoEscolhido = 1;

        if (this.energiaAtual >= custoAtaque3) {
            // Se tiver muita energia, pode escolher entre Ataque 2 ou 3 com mais agressividade
            tipoEscolhido = Math.random() > 0.4 ? 3 : 2;
        } else if (this.energiaAtual >= custoAtaque2) {
            // Energia intermediária: alterna entre ataque 1 e 2
            tipoEscolhido = Math.random() > 0.5 ? 2 : 1;
        } else if (this.energiaAtual >= custoAtaque1) {
            tipoEscolhido = 1;
        } else {
            // Se nem para o ataque 1 tem energia, defende
            this.defender();
            return {
                tipo: 'DEFENDER',
                mensagem: `${this.nome} tentou atacar, mas sem energia suficiente recuou em guarda defensiva!`
            };
        }

        const msgAtaque = this.ataque(alvo, tipoEscolhido);
        return {
            tipo: 'ATACAR',
            mensagem: msgAtaque
        };
    }

    executarAcaoEspecial(alvo: EntidadeCombatente): string {
        const custo = Math.round(this.energiaMaxima * 0.50);

        if (!this.gastarEnergia(custo)) {
            return `${this.nome} tentou conjurar seu poder sombrio, mas não possui energia suficiente!`;
        }

        if (this.tipoMonstro === 'CHEFE') {
            const danoDevastador = super.atacar(alvo, 2.3);
            return `🔥 [GOLPE DEVASTADOR] ${this.nome} canalizou a fúria das trevas de Vaslen e atingiu ${alvo.getNome()} com ${danoDevastador} de dano catastrófico!`;
        } else if (this.tipoMonstro === 'ELITE') {
            const danoPesado = super.atacar(alvo, 1.8);
            return `⚡ [ATAQUE DE ELITE] ${this.nome} desferiu um bote brutal sobre ${alvo.getNome()} causando ${danoPesado} de dano!`;
        } else {
            const danoComum = super.atacar(alvo, 1.5);
            return `💥 [FÚRIA SELVAGEM] ${this.nome} investiu descontroladamente contra ${alvo.getNome()} desferindo ${danoComum} de dano!`;
        }
    }

    droparLoot(): Item | null {
        return this.itemRecompensa ?? null;
    }

    getTipoMonstro(): string {
        return this.tipoMonstro;
    }

    getExperienciaConcedida(): number {
        return this.experienciaConcedida;
    }

    getDescricaoLore(): string {
        return this.descricaoLore;
    }

    getItemRecompensa(): Item | undefined {
        return this.itemRecompensa;
    }
}