import { EntidadeCombatente } from "./EntidadeCombatente";
import { Item } from "./Item";

export class Personagem extends EntidadeCombatente {
    public classeHeroi: 'GUERREIRO' | 'MAGO' | 'ARQUEIRO';
    public experienciaAtual: number;
    public experienciaNecessaria: number;
    public pontosLivres: number;
    public ativo: boolean;
    public idUsuario: string | number;
    public inventario: Item[];
    public monstrosDerrotados: number[];

    constructor(
        nome: string,
        nivel: number,
        vidaMaxima: number,
        vidaAtual: number,
        energiaMaxima: number,
        forca: number,
        defesa: number,
        agilidade: number,
        classeHeroi: 'GUERREIRO' | 'MAGO' | 'ARQUEIRO',
        experienciaAtual: number,
        experienciaNecessaria: number,
        pontosLivres: number,
        ativo: boolean,
        idUsuario: string | number,
        inventario: Item[] = [],
        id?: number,
        monstrosDerrotados: number[] = []
    ) {
        super(nome, nivel, vidaMaxima, vidaAtual, energiaMaxima, forca, defesa, agilidade, id);
        this.classeHeroi = classeHeroi;
        this.experienciaAtual = experienciaAtual;
        this.experienciaNecessaria = experienciaNecessaria;
        this.pontosLivres = pontosLivres;
        this.ativo = ativo;
        this.idUsuario = idUsuario;
        this.inventario = inventario;
        this.monstrosDerrotados = monstrosDerrotados;

        if (forca + defesa + agilidade !== 20) {
            throw new Error("Erro ao cadastrar personagem: A soma das estatísticas deve ser igual a 20.");
        }
    }

    adicionarItemAoInventario(item: Item): string {
        this.inventario.push(item);
        return `Item ${item.getNome()} foi adicionado ao inventário.`;
    }

    usarItemDoInventario(indice: number, alvo: EntidadeCombatente): string {
        const item = this.inventario[indice];
        item.aplicarEfeito(alvo);
        this.inventario.splice(indice, 1);
        return `Item ${item.getNome()} foi usado em ${alvo.getNome()}.`;
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

    executarAcaoEspecial(alvo: EntidadeCombatente): string {
        const custo = Math.round(this.energiaMaxima * 0.40);

        if (!this.gastarEnergia(custo)) {
            return `${this.nome} tentou usar sua habilidade especial, mas não tem energia suficiente!`;
        }

        if (this.classeHeroi === 'GUERREIRO') {
            const dano = super.atacar(alvo, 2.0);
            return `⚔️ [GOLPE DEVASTADOR] ${this.nome} desferiu um golpe esmagador com sua espada em ${alvo.getNome()} causando ${dano} de dano!`;
        } else if (this.classeHeroi === 'MAGO') {
            const dano = super.atacar(alvo, 2.2);
            return `🔥 [EXPLOSÃO ARCANA] ${this.nome} canalizou os ecos da Fratura e atingiu ${alvo.getNome()} com ${dano} de dano mágico!`;
        } else if (this.classeHeroi === 'ARQUEIRO') {
            const dano = super.atacar(alvo, 1.9);
            return `🏹 [DISPARO PERFURANTE] ${this.nome} disparou uma flecha certeira no ponto vital de ${alvo.getNome()} causando ${dano} de dano!`;
        }

        return `${this.nome} executou uma ação especial em ${alvo.getNome()}.`;
    }

    ganharExperiencia(quantidade: number): void {
        this.experienciaAtual += quantidade;
        while (this.experienciaAtual >= this.experienciaNecessaria) {
            this.subirNivel();
        }
    }

    subirNivel(): void {
        this.nivel += 1;
        this.experienciaAtual -= this.experienciaNecessaria;
        this.experienciaNecessaria = this.nivel * 100;
        this.pontosLivres += 3;
        this.vidaMaxima += 20;
        this.vidaAtual = this.vidaMaxima;
        this.energiaMaxima += 15;
        this.energiaAtual = this.energiaMaxima;
    }

    distribuirPontos(forcaAdd: number, defesaAdd: number, agilidadeAdd: number): void {
        if (forcaAdd < 0 || defesaAdd < 0 || agilidadeAdd < 0) {
            throw new Error("Os pontos distribuídos não podem ser negativos.");
        }
        const total = forcaAdd + defesaAdd + agilidadeAdd;
        if (total > this.pontosLivres) {
            throw new Error(`Pontos livres insuficientes. Você tem ${this.pontosLivres} ponto(s) disponível(is).`);
        }
        this.forca += forcaAdd;
        this.defesa += defesaAdd;
        this.agilidade += agilidadeAdd;
        this.pontosLivres -= total;
    }

    inativar(): void {
        this.ativo = false;
    }

    registrarVitoriaContraMonstro(idMonstro: number): void {
        if (!this.monstrosDerrotados.includes(idMonstro)) {
            this.monstrosDerrotados.push(idMonstro);
        }
    }

    jaDerrotouMonstro(idMonstro: number): boolean {
        return this.monstrosDerrotados.includes(idMonstro);
    }

    obterTotalMonstrosDerrotados(): number {
        return this.monstrosDerrotados.length;
    }
}