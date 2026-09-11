import { EntidadeCombatente } from "./EntidadeCombatente";


export class Item{
    protected id: number;
    protected nome: string;
    protected tipo: 'CURA_VIDA' | 'RECUPERA_ENERGIA' |'REFORCO_DANO';
    protected valorEfeito: number;
    protected descricao: string;


    constructor(
        id: number,
        nome: string,
        tipo: 'CURA_VIDA' | 'RECUPERA_ENERGIA' |'REFORCO_DANO',
        valorEfeito: number,
        descricao: string

    ){
        this.id = id;
        this.nome = nome;
        this.tipo = tipo;
        this.valorEfeito = valorEfeito;
        this.descricao = descricao;
    }

    aplicarEfeito(alvo: EntidadeCombatente):string{
        let mensagem = "";
        if(this.tipo === 'CURA_VIDA'){
            alvo.curarVida(this.valorEfeito);
            mensagem = `${alvo.getNome()} usou ${this.nome} e recuperou ${this.valorEfeito} de vida.`;
        }else if(this.tipo === 'RECUPERA_ENERGIA'){
            alvo.recuperarEnergia(this.valorEfeito);
            mensagem = `${alvo.getNome()} usou ${this.nome} e recuperou ${this.valorEfeito} de energia.`;
        }else if(this.tipo === 'REFORCO_DANO'){
            alvo.aplicarModificadorDano(this.valorEfeito);
            mensagem = `${alvo.getNome()} usou ${this.nome} e nessa rodada aplica ${this.valorEfeito} de dano extra.`;
        }
        return mensagem;
    }

     getId(): number {
        return this.id;
    }

    getNome(): string {
        return this.nome;
    }

    getTipo(): string {
        return this.tipo;
    }

    getValorEfeito(): number {
        return this.valorEfeito;
    }

    getDescricao(): string {
        return this.descricao;
    }


}