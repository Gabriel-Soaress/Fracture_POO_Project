import { Personagem } from "./personagem";

export type TipoUsuario = 'JOGADOR' | 'ADMINISTRADOR';

export class Usuario {
    private id: number;
    private nome: string;
    private email: string;
    private senhaHash: string;
    private tipoUsuario: TipoUsuario;
    private personagens: Personagem[] = [];
    private dataCriacao: Date = new Date();

    constructor(
        id: number,
        nome: string,
        email: string,
        senhaHash: string,
        tipoUsuario: TipoUsuario = 'JOGADOR'
    ) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senhaHash = senhaHash;
        this.tipoUsuario = tipoUsuario;
    }

    autenticarComHash(hashInformado: string): boolean {
        return this.senhaHash === hashInformado;
    }

    atualizarSenhaHash(novoSenhaHash: string): void {
        if (!novoSenhaHash || novoSenhaHash.trim().length === 0) {
            throw new Error("O hash da senha não pode ser vazio.");
        }
        this.senhaHash = novoSenhaHash;
        console.log(`Senha do usuário ${this.nome} atualizada com sucesso.`);
    }

    ehAdministrador(): boolean {
        return this.tipoUsuario === 'ADMINISTRADOR';
    }

    adicionarPersonagem(personagem: Personagem): void {
        if (this.personagens.length >= 5) {
            console.log(`Usuário ${this.nome} já possui o limite máximo de 5 personagens.`);
            return;
        }

        this.personagens.push(personagem);
        console.log(`Personagem ${personagem.getNome()} adicionado ao usuário ${this.nome}.`);
    }

    obterPersonagensAtivos(): Personagem[] {
        return this.personagens.filter(personagem => personagem.ativo);
    }

    obterPersonagemPorId(id: number | string): Personagem | undefined {
        return this.personagens.find(personagem => {
            const idPersonagem = personagem.getId();
            return idPersonagem !== undefined && idPersonagem.toString() === id.toString();
        });
    }

    inativarPersonagem(id: number | string): string {
        const personagem = this.obterPersonagemPorId(id);
        if (personagem) {
            personagem.inativar();
            return `Personagem ${personagem.getNome()} inativado com sucesso.`;
        } else {
            return `Personagem com id ${id} não encontrado.`;
        }
    }

    getId(): number {
        return this.id;
    }

    getNome(): string {
        return this.nome;
    }

    getEmail(): string {
        return this.email;
    }

    getSenhaHash(): string {
        return this.senhaHash;
    }

    getTipoUsuario(): TipoUsuario {
        return this.tipoUsuario;
    }

    getPersonagens(): Personagem[] {
        return this.personagens;
    }

    getDataCriacao(): Date {
        return this.dataCriacao;
    }
}