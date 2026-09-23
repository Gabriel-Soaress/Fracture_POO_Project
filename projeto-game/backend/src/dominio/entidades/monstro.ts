import { EntidadeCombatente } from "./EntidadeCombatente";

export class Monstro extends EntidadeCombatente {
    public tipoMonstro: 'COMUM' | 'ELITE' | 'CHEFE';
    public experienciaConcedida: number;
    public descricaoLore: string;

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
        id?: number
    ) {
        super(nome, nivel, vidaMaxima, vidaAtual, energiaMaxima, forca, defesa, agilidade, id);
        this.tipoMonstro = tipoMonstro;
        this.experienciaConcedida = experienciaConcedida;
        this.descricaoLore = descricaoLore;
    }

    decidirAcao(alvo: EntidadeCombatente): { tipo: 'ATACAR' | 'DEFENDER' | 'ESPECIAL'; mensagem: string } {
        // Redefine a postura defensiva da rodada anterior antes de agir
        this.redefinirDefesa();

        // 1. IA Tática de Energia: Se estiver exausto (< 25% da energia máxima), defende para descansar e mitigar dano
        if (this.energiaAtual < Math.round(this.energiaMaxima * 0.25)) {
            this.defender();
            return {
                tipo: 'DEFENDER',
                mensagem: `${this.nome} entrou em postura defensiva para recuperar energia e mitigar danos futuros.`
            };
        }

        // 2. IA de Desespero/Fúria: Vida crítica (< 35%) com energia suficiente (> 40%) -> dispara Ação Especial
        const percentualVida = this.vidaAtual / this.vidaMaxima;
        const custoEspecial = Math.round(this.energiaMaxima * 0.40);

        if (percentualVida <= 0.35 && this.energiaAtual >= custoEspecial) {
            const mensagemEspecial = this.executarAcaoEspecial(alvo);
            return {
                tipo: 'ESPECIAL',
                mensagem: mensagemEspecial
            };
        }

        // 3. IA Padrão: Ataque Físico comum consumindo energia (15% da estamina máxima)
        const custoAtaque = Math.round(this.energiaMaxima * 0.15);
        if (this.gastarEnergia(custoAtaque)) {
            const dano = this.atacar(alvo, 1.2);
            return {
                tipo: 'ATACAR',
                mensagem: `${this.nome} atacou ferozmente ${alvo.getNome()} causando ${dano} de dano!`
            };
        } else {
            // Se faltou energia para o ataque padrão, descansa
            this.defender();
            return {
                tipo: 'DEFENDER',
                mensagem: `${this.nome} tentou atacar, mas sem energia suficiente recuou em guarda defensiva!`
            };
        }
    }

    executarAcaoEspecial(alvo: EntidadeCombatente): string {
        const custo = Math.round(this.energiaMaxima * 0.40);

        if (!this.gastarEnergia(custo)) {
            return `${this.nome} tentou conjurar seu poder sombrio, mas não possui energia suficiente!`;
        }

        if (this.tipoMonstro === 'CHEFE') {
            const danoDevastador = this.atacar(alvo, 2.3);
            return `🔥 [GOLPE DEVASTADOR] ${this.nome} canalizou a fúria das trevas de Vaslen e atingiu ${alvo.getNome()} com ${danoDevastador} de dano catastrófico!`;
        } else if (this.tipoMonstro === 'ELITE') {
            const danoPesado = this.atacar(alvo, 1.8);
            return `⚡ [ATAQUE DE ELITE] ${this.nome} desferiu um bote brutal sobre ${alvo.getNome()} causando ${danoPesado} de dano!`;
        } else {
            const danoComum = this.atacar(alvo, 1.5);
            return `💥 [FÚRIA SELVAGEM] ${this.nome} investiu descontroladamente contra ${alvo.getNome()} desferindo ${danoComum} de dano!`;
        }
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
}