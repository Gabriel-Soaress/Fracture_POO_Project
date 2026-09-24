import { Personagem } from "./personagem";

export type TipoUsuario = 'JOGADOR' | 'ADMINISTRADOR';

export class Usuario {
    private id: number;
    private nome: string;
    private email: string;
    private senha: string;
    private tipoUsuario: TipoUsuario;
    private personagens: Personagem[] = [];
    private dataCriacao: Date = new Date();

    constructor(
        id: number,
        nome: string,
        email: string,
        senha: string,
        tipoUsuario: TipoUsuario = 'JOGADOR'
    ) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.tipoUsuario = tipoUsuario;
    }

    autenticar(senhaInformada: string): boolean {
        return this.senha === senhaInformada;
    }

    alterarSenha(senhaAtual: string, novaSenha: string): boolean {
        if (!this.autenticar(senhaAtual)) {
            console.log("Erro: Senha atual incorreta.");
            return false;
        }

        if (!novaSenha || novaSenha.trim().length < 4) {
            console.log("Erro: A nova senha deve conter pelo menos 4 caracteres.");
            return false;
        }

        this.senha = novaSenha;
        console.log(`Senha do usuário ${this.nome} alterada com sucesso.`);
        return true;
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

    getSenha(): string {
        return this.senha;
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