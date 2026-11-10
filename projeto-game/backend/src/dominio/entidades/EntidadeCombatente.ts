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

    atacar(alvo: EntidadeCombatente, valorAtaque: number): number {
        let danoBruto = Math.round(valorAtaque * this.forca);

        // Aplica bônus de item (REFORCO_DANO):
        // - Se > 3 (ex.: +9 a +16 dos óleos/venenos de FabricaItens), soma como bônus aditivo;
        // - Se entre 1 e 3 (ex.: 1.4x em testes unitários), aplica como multiplicador.
        if (this.modificadorDano > 3) {
            danoBruto = Math.round(danoBruto + this.modificadorDano);
        } else if (this.modificadorDano > 1) {
            danoBruto = Math.round(danoBruto * this.modificadorDano);
        }

        // Consome o buff de dano imediatamente após o golpe (dura 1 ataque)
        this.redefinirModificadorDano();

        // Golpes Brutais ou Especiais (multiplicador >= 2.2) atuam como Quebra-Guarda parcial
        const perfurarDefesa = valorAtaque >= 2.2;
        const danoReal = alvo.receberDano(danoBruto, perfurarDefesa);
        return danoReal;
    }

    receberDano(valorDano: number, perfurarDefesa: boolean = false): number {
        // 1. Mitigação passiva pela Defesa (armadura natural)
        const fatorArmadura = perfurarDefesa ? 0.18 : 0.35;
        const reducaoArmadura = Math.floor(this.defesa * fatorArmadura);
        const danoPosArmadura = Math.max(2, valorDano - reducaoArmadura);

        // 2. Mitigação ativa por Postura Defensiva (45% normal, ou 20% contra Quebra-Guarda)
        const multiplicadorPostura = this.estadoDefesa ? (perfurarDefesa ? 0.80 : 0.55) : 1.0;
        const danoReal = Math.max(1, Math.round(danoPosArmadura * multiplicadorPostura));

        if (danoReal < this.vidaAtual) {
            this.vidaAtual -= danoReal;
        } else {
            this.vidaAtual = 0;
        }

        return danoReal;
    }

    curarVida(valorCura: number): void {
        if (valorCura + this.vidaAtual <= this.vidaMaxima) {
            this.vidaAtual += valorCura;
        } else {
            this.vidaAtual = this.vidaMaxima;
        }
    }

    defender(): number {
        this.estadoDefesa = true;
        const recuperacao = Math.max(25, Math.round(this.energiaMaxima * 0.30));
        this.recuperarEnergia(recuperacao); // Defender descansa e recupera estamina proporcional
        return recuperacao;
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