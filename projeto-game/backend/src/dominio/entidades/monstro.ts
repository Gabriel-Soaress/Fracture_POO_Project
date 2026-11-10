import { EntidadeCombatente } from "./EntidadeCombatente";
import { Item } from "./Item";

export type BiomaVaslen =
    | 'CRIPTAS'
    | 'BOSQUE_SOMBRIO'
    | 'LABIRINTO_CINZAS'
    | 'PANTANO_PETRIFICANTE'
    | 'COLINAS_LUA_SANGUE'
    | 'LIMBO_ESPECTRAL'
    | 'PINACULO_ECLIPSE';

export class Monstro extends EntidadeCombatente {
    public tipoMonstro: 'COMUM' | 'ELITE' | 'CHEFE';
    public experienciaConcedida: number;
    public descricaoLore: string;
    public itemRecompensa?: Item;
    public bioma: BiomaVaslen | string;
    private ultimoGolpe: number = 0; // 0 = defesa, 1 = rápido, 2 = pesado, 3 = brutal, 4 = especial
    private cooldownEspecial: number = 0;

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
        bioma: BiomaVaslen | string = 'CRIPTAS',
        id?: number
    ) {
        super(nome, nivel, vidaMaxima, vidaAtual, energiaMaxima, forca, defesa, agilidade, id);
        this.tipoMonstro = tipoMonstro;
        this.experienciaConcedida = experienciaConcedida;
        this.descricaoLore = descricaoLore;
        this.itemRecompensa = itemRecompensa;
        this.bioma = bioma;
    }

    ataque(alvo: EntidadeCombatente, tipoAtaque: number): string {
        if (tipoAtaque === 1) {
            const custo = 10;
            if (this.gastarEnergia(custo)) {
                const dano = super.atacar(alvo, 1.0);
                return `${this.nome} desferiu um Golpe Rápido em ${alvo.getNome()} com ${dano} de dano.`;
            } else {
                return `${this.nome} não tem energia para atacar.`;
            }
        } else if (tipoAtaque === 2) {
            const custo = 18;
            if (this.gastarEnergia(custo)) {
                const dano = super.atacar(alvo, 1.65);
                return `${this.nome} desferiu um Golpe Pesado em ${alvo.getNome()} com ${dano} de dano.`;
            } else {
                return `${this.nome} não tem energia para atacar.`;
            }
        } else if (tipoAtaque === 3) {
            const custo = 26;
            if (this.gastarEnergia(custo)) {
                const dano = super.atacar(alvo, 2.2);
                return `${this.nome} desferiu um Ataque Brutal em ${alvo.getNome()} com ${dano} de dano!`;
            } else {
                return `${this.nome} não tem energia para atacar.`;
            }
        }

        return "Tipo de ataque inválido.";
    }

    decidirAcao(alvo: EntidadeCombatente): { tipo: 'ATACAR' | 'DEFENDER' | 'ESPECIAL'; mensagem: string } {
        // Redefine a postura defensiva da rodada anterior antes de agir
        this.redefinirDefesa();
        if (this.cooldownEspecial > 0) {
            this.cooldownEspecial--;
        }

        const custoAtaque1 = 10;
        const custoAtaque2 = 18;
        const custoAtaque3 = 26;
        const custoEspecial = 32;

        const percentualVidaMonstro = this.vidaAtual / this.vidaMaxima;
        const percentualVidaHeroi = alvo.getVidaAtual() / alvo.getVidaMaxima();

        // 1. Sem energia nem para o Golpe Rápido: descansa e assume postura defensiva
        if (this.energiaAtual < custoAtaque1) {
            const rec = this.defender();
            this.ultimoGolpe = 0;
            return {
                tipo: 'DEFENDER',
                mensagem: `${this.nome} recuou em postura defensiva (+${rec} EN e guarda elevada).`
            };
        }

        // 2. IA de Reação Tática à Defesa do Jogador:
        // Se o jogador defendeu e o monstro está com pouca energia (< 22) e não defendeu no último turno,
        // aproveita a brecha para recuperar energia ou pune com Quebra-Guarda se tiver energia!
        if (alvo.isDefendendo()) {
            if (this.energiaAtual < 22 && this.ultimoGolpe !== 0 && Math.random() < 0.65) {
                const rec = this.defender();
                this.ultimoGolpe = 0;
                return {
                    tipo: 'DEFENDER',
                    mensagem: `${this.nome} percebeu sua guarda fechada e aproveitou para recompor fôlego (+${rec} EN)!`
                };
            }
            if (this.energiaAtual >= custoEspecial && this.cooldownEspecial === 0 && Math.random() < 0.55) {
                this.cooldownEspecial = 2;
                this.ultimoGolpe = 4;
                return {
                    tipo: 'ESPECIAL',
                    mensagem: this.executarAcaoEspecial(alvo)
                };
            }
            if (this.energiaAtual >= custoAtaque3 && this.ultimoGolpe !== 3) {
                this.ultimoGolpe = 3;
                return {
                    tipo: 'ATACAR',
                    mensagem: this.ataque(alvo, 3)
                };
            }
        }

        // 3. IA de Habilidade Especial (Fúria, Abertura de Boss/Elite ou Pressão):
        if (this.energiaAtual >= custoEspecial && this.cooldownEspecial === 0 && this.ultimoGolpe !== 4) {
            const chanceEspecial =
                percentualVidaMonstro <= 0.45
                    ? 0.68
                    : this.tipoMonstro === 'CHEFE'
                    ? 0.40
                    : this.tipoMonstro === 'ELITE'
                    ? 0.30
                    : 0.22;

            if (Math.random() < chanceEspecial) {
                this.cooldownEspecial = 2;
                this.ultimoGolpe = 4;
                return {
                    tipo: 'ESPECIAL',
                    mensagem: this.executarAcaoEspecial(alvo)
                };
            }
        }

        // 4. IA de Fôlego Estratégico: se a energia estiver baixa (< 20) e o herói não estiver prestes a morrer,
        // tem chance de defender para preparar um golpe pesado na próxima rodada (sem repetir defesa seguida).
        if (
            this.energiaAtual < 20 &&
            percentualVidaHeroi > 0.25 &&
            this.ultimoGolpe !== 0 &&
            Math.random() < 0.40
        ) {
            const rec = this.defender();
            this.ultimoGolpe = 0;
            return {
                tipo: 'DEFENDER',
                mensagem: `${this.nome} fechou a guarda e concentrou energia (+${rec} EN) preparando o próximo bote!`
            };
        }

        // 5. Seleção Dinâmica e Variada entre Ataque 1 (Rápido), 2 (Pesado) e 3 (Brutal):
        // Monta os golpes possíveis e evita repetir o mesmo golpe do turno anterior!
        const opcoesDisponiveis: number[] = [1];
        if (this.energiaAtual >= custoAtaque2) opcoesDisponiveis.push(2);
        if (this.energiaAtual >= custoAtaque3) opcoesDisponiveis.push(3);

        const opcoesSemRepetir =
            opcoesDisponiveis.length > 1
                ? opcoesDisponiveis.filter(op => op !== this.ultimoGolpe)
                : opcoesDisponiveis;

        let tipoEscolhido = 1;
        if (percentualVidaHeroi <= 0.30 && opcoesSemRepetir.length > 0) {
            // Instinto predatório: se o herói está com pouca vida, prioriza o golpe mais forte disponível
            tipoEscolhido = opcoesSemRepetir[opcoesSemRepetir.length - 1];
        } else {
            // Sorteio ponderado entre as opções não repetidas para variar animações e ritmo
            const indice = Math.floor(Math.random() * opcoesSemRepetir.length);
            tipoEscolhido = opcoesSemRepetir[indice];
        }

        this.ultimoGolpe = tipoEscolhido;
        const msgAtaque = this.ataque(alvo, tipoEscolhido);
        return {
            tipo: 'ATACAR',
            mensagem: msgAtaque
        };
    }

    executarAcaoEspecial(alvo: EntidadeCombatente): string {
        const custo = 32;

        if (!this.gastarEnergia(custo)) {
            return `${this.nome} tentou conjurar seu poder sombrio, mas não possui energia suficiente!`;
        }

        if (this.tipoMonstro === 'CHEFE') {
            const danoDevastador = super.atacar(alvo, 2.55);
            return `🔥 [GOLPE DEVASTADOR] ${this.nome} canalizou a fúria das trevas de Vaslen e atingiu ${alvo.getNome()} com ${danoDevastador} de dano catastrófico!`;
        } else if (this.tipoMonstro === 'ELITE') {
            const danoPesado = super.atacar(alvo, 2.3);
            return `⚡ [ATAQUE DE ELITE] ${this.nome} desferiu um bote brutal sobre ${alvo.getNome()} causando ${danoPesado} de dano!`;
        } else {
            const danoComum = super.atacar(alvo, 2.0);
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

    getBioma(): string {
        return this.bioma;
    }
}