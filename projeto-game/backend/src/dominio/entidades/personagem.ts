import { EntidadeCombatente } from "./EntidadeCombatente";
import { Item } from "./Item";

export class Personagem extends EntidadeCombatente{
    public classeHeroi: 'GUERREIRO' | 'MAGO' | 'ARQUEIRO';
    public experienciaAtual: number;
    public experienciaNecessaria: number;
    public pontosLivres: number;
    public ativo: boolean;
    public idUsuario: string | number;
    public inventario: Item[];

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
        id?: number
    ) {
        super(nome, nivel, vidaMaxima, vidaAtual, energiaMaxima, forca, defesa, agilidade, id);
        this.classeHeroi = classeHeroi;
        this.experienciaAtual = experienciaAtual;
        this.experienciaNecessaria = experienciaNecessaria;
        this.pontosLivres = pontosLivres;
        this.ativo = ativo;
        this.idUsuario = idUsuario;
        this.inventario = inventario;

        if(forca + defesa + agilidade !=20){
            throw new Error("Erro ao cadastrar personagem: A soma das estatísticas deve ser igual a 20.");
        }

        
    }

    adicionarItemAoInventario(item: Item): string{
        this.inventario.push(item);
        return `Item ${item.getNome()} foi adicionado ao inventário.`; 
    }

    usarItemDoInventario(indice: number, alvo: EntidadeCombatente):string{
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
                return `${this.nome} atacou ${alvo.getNome()} com ${dano} de dano.`;
            } else {
                return `${this.nome} não tem energia para atacar.`;
            }
        } else if (tipoAtaque === 2) {
            const custo = Math.round(this.energiaMaxima * 0.25);
            if (this.gastarEnergia(custo)) {
                const dano = super.atacar(alvo, 1.5);
                return `${this.nome} atacou ${alvo.getNome()} com ${dano} de dano.`;
            } else {
                return `${this.nome} não tem energia para atacar.`;
            }
        } else if (tipoAtaque === 3) {
            const custo = Math.round(this.energiaMaxima * 0.35);
            if (this.gastarEnergia(custo)) {
                const dano = super.atacar(alvo, 1.7);
                return `${this.nome} atacou ${alvo.getNome()} com ${dano} de dano.`;
            } else {
                return `${this.nome} não tem energia para atacar.`;
            }
        }

        return "Tipo de ataque inválido.";
    }

    executarAcaoEspecial(alvo: EntidadeCombatente): string {
        if (this.classeHeroi === 'GUERREIRO') {
            if (!this.gastarEnergia(Math.round(this.energiaMaxima * 0.5))) {
                return `${this.nome} não tem energia suficiente para usar a ação especial (necessário 50).`;
            }
            this.aplicarModificadorDano(1.5);
            return `${this.nome} ativou o modo fúria gastando 50 de energia! Seu dano foi aumentado em 1.5x neste turno.`;
        } else if (this.classeHeroi === 'MAGO') {
            this.recuperarEnergia(this.energiaMaxima);
            this.aplicarModificadorDano(0.5);
            return `${this.nome} canalizou suas forças e recuperou toda a sua energia instantaneamente, mas seu dano foi reduzido em 50% neste turno.`;
        } else if (this.classeHeroi === 'ARQUEIRO') {
            const itensPossiveis = [
                new Item(Date.now(), 'Poção de Vida', 'CURA_VIDA', 30, 'Recupera 30 pontos de vida.'),
                new Item(Date.now() + 1, 'Poção de Energia', 'RECUPERA_ENERGIA', 30, 'Recupera 30 pontos de energia.'),
                new Item(Date.now() + 2, 'Flecha Precisa', 'REFORCO_DANO', 1.3, 'Aumenta o modificador de dano em 30%.')
            ];
            const itemSorteado = itensPossiveis[Math.floor(Math.random() * itensPossiveis.length)];
            this.adicionarItemAoInventario(itemSorteado);
            return `${this.nome} vasculhou seus suprimentos de arqueiro e obteve um item extra: ${itemSorteado.getNome()}!`;
        }

        return "Classe não possui ação especial definida.";
    }

    ganharExperiencia(qtd: number): void {
        if (qtd <= 0) return;
        this.experienciaAtual += qtd;
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
    
}