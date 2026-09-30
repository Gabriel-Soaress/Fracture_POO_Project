
export class EntradaCodice {



    private id: number;
    private titulo: string;
    private categoria: 'MONSTRO' | 'REGIAO' | 'RELÍQUIA' | 'HISTORIA';
    private resumo: string;
    private conteudoCompleto: string;
    private tags: string[];


    constructor(
        id: number,
        titulo: string,
        categoria: 'MONSTRO' | 'REGIAO' | 'RELÍQUIA' | 'HISTORIA',
        resumo: string,
        conteudo: string,
        tags: string[],
    ) {
        this.id = id;
        this.titulo = titulo;
        this.categoria = categoria;
        this.resumo = resumo;
        this.conteudoCompleto = conteudo;
        this.tags = tags;
    }

    contemTermo(termo: string): boolean {
        if (!termo) {
            return false;
        }

        const termoNormalizado = termo.toLowerCase().trim();

        const noTitulo = this.titulo.toLowerCase().includes(termoNormalizado);
        const noResumo = this.resumo.toLowerCase().includes(termoNormalizado);
        const nasTags = this.tags.some(tag => tag.toLowerCase().includes(termoNormalizado));

        return noTitulo || noResumo || nasTags;
    }

    formatarParaCard(): { id: string; titulo: string; categoria: string; resumo: string } {
        return {
            id: this.id.toString(),
            titulo: this.titulo,
            categoria: this.categoria,
            resumo: this.resumo
        };
    }

    getId(): number {
        return this.id;
    }

    getTitulo(): string {
        return this.titulo;
    }

    getCategoria(): string {
        return this.categoria;
    }


    getResumo(): string {
        return this.resumo;
    }

    getConteudoCompleto(): string {
        return this.conteudoCompleto;
    }

    getTags(): string[] {
        return [...this.tags];
    }

}