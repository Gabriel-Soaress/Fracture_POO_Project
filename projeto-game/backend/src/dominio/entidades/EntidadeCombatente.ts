export abstract class EntidadeCombatente {
    protected id?: number;
    protected nome: string;
    protected nivel: number;
    protected vidaMaxima: number;
    protected vidaAtual: number;
    protected energiaMaxima: number;
    protected energiaAtual: number;
    protected forca: number;
    protected defesa: number;
    protected agilidade: number;
    protected estadoDefesa: boolean;
    protected modificadorDano: number;

    constructor(
        nome: string,
        nivel: number,
        vidaMaxima: number,
        vidaAtual: number,
        energiaMaxima: number,
        forca: number,
        defesa: number,
        agilidade: number,
        id?: number
    ) {
        this.id = id ?? 0;
        this.nome = nome;
        this.nivel = nivel;
        this.vidaMaxima = vidaMaxima;
        this.vidaAtual = vidaAtual;
        this.forca = forca;
        this.defesa = defesa;
        this.agilidade = agilidade;
        this.estadoDefesa = false;
        this.energiaMaxima = energiaMaxima;
        this.energiaAtual = energiaMaxima;
        this.modificadorDano = 1;
    }

    atacar(alvo: EntidadeCombatente): void {
        const dano = Math.round(this.forca * this.modificadorDano);
        alvo.receberDano(dano);
    }

    receberDano(valorDano: number): void {
        const danoReal = Math.round(this.estadoDefesa ? valorDano * 0.70 : valorDano);

        if (danoReal < this.vidaAtual) {
            this.vidaAtual -= danoReal;
        } else {
            this.vidaAtual = 0;
        }
    }

    curarVida(valorCura: number): void {
        if (valorCura + this.vidaAtual <= this.vidaMaxima) {
            this.vidaAtual += valorCura;
        } else {
            this.vidaAtual = this.vidaMaxima;
        }
    }

    defender(): void {
        this.estadoDefesa = true;
        this.recuperarEnergia(15); // Defender descansa e recupera estamina
    }

    redefinirDefesa(): void {
        this.estadoDefesa = false;
    }

    estaDerrotado(): boolean {
        return this.vidaAtual === 0;
    }

    calcularIniciativa(): number {
        return this.agilidade + Math.random() * 10;
    }

    gastarEnergia(valorGasto: number): boolean {
        if (this.energiaAtual >= valorGasto) {
            this.energiaAtual -= valorGasto;
            return true;
        } else {
            return false;
        }
    }

    recuperarEnergia(valorRecuperado: number): void {
        this.energiaAtual += valorRecuperado;

        if (this.energiaAtual > this.energiaMaxima) {
            this.energiaAtual = this.energiaMaxima;
        }
    }

    aplicarModificadorDano(fator: number): void {
        this.modificadorDano = fator;
    }

    redefinirModificadorDano(): void {
        this.modificadorDano = 1;
    }

    abstract executarAcaoEspecial(alvo: EntidadeCombatente): string;

    // Métodos Getters (Encapsulamento: leitura segura de atributos protegidos)
    getId(): number {
        return this.id ?? 0;
    }

    getNome(): string {
        return this.nome;
    }

    getNivel(): number {
        return this.nivel;
    }

    getVidaAtual(): number {
        return this.vidaAtual;
    }

    getVidaMaxima(): number {
        return this.vidaMaxima;
    }

    getEnergiaAtual(): number {
        return this.energiaAtual;
    }

    getEnergiaMaxima(): number {
        return this.energiaMaxima;
    }

    getForca(): number {
        return this.forca;
    }

    getDefesa(): number {
        return this.defesa;
    }

    getAgilidade(): number {
        return this.agilidade;
    }

    isDefendendo(): boolean {
        return this.estadoDefesa;
    }

    getModificadorDano(): number {
        return this.modificadorDano;
    }
}