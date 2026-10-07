import { Monstro, BiomaVaslen } from "../entidades/monstro";
import { FabricaItens } from "./FabricaItens";

export class FabricaMonstros {
    private constructor() {}

    // --- CRIPTAS DE VASLEN ---
    public static criarGuerreiroEsqueletico(): Monstro {
        return new Monstro(
            "Guerreiro Esquelético", 1, 80, 80, 50, 7, 5, 4,
            "COMUM", 100,
            "Infantaria esquelética reanimada pela névoa da Fratura.",
            FabricaItens.criarMedulaEsqueletoAntigo(), "CRIPTAS", 1
        );
    }
    public static criarLanceiroEsqueletico(): Monstro {
        return new Monstro(
            "Lanceiro Esquelético", 2, 90, 90, 60, 8, 6, 5,
            "COMUM", 130,
            "Guarda de honra das tumbas profundas de Vaslen.",
            FabricaItens.criarPoDeOssosReanimados(), "CRIPTAS", 2
        );
    }
    public static criarArqueiroEspectral(): Monstro {
        return new Monstro(
            "Arqueiro Espectral", 3, 110, 110, 75, 11, 7, 9,
            "ELITE", 220,
            "Atirador cadavérico com flechas que drenam a estamina.",
            FabricaItens.criarCinzasDeFocoEspectral(), "CRIPTAS", 3
        );
    }

    // --- BOSQUE SOMBRIO ---
    public static criarDegoladorSatiro(): Monstro {
        return new Monstro(
            "Degolador dos Bosques", 3, 105, 105, 65, 10, 6, 8,
            "COMUM", 180,
            "Espírito pastoril corrompido munido de lâminas curvas.",
            FabricaItens.criarSeivaNegraDoBosque(), "BOSQUE_SOMBRIO", 4
        );
    }
    public static criarXamaDosChifres(): Monstro {
        return new Monstro(
            "Xamã dos Chifres", 4, 125, 125, 85, 12, 8, 9,
            "ELITE", 260,
            "Líder místico que canaliza o sopro da névoa viva.",
            FabricaItens.criarOrvalhoDeMiasmaTribal(), "BOSQUE_SOMBRIO", 5
        );
    }
    public static criarLordeCarniceiro(): Monstro {
        return new Monstro(
            "Lorde Carniceiro", 5, 145, 145, 80, 15, 10, 6,
            "ELITE", 320,
            "Besta tribal monumental cuja clava despedaça armaduras.",
            FabricaItens.criarUnguentoFuriaCarniceira(), "BOSQUE_SOMBRIO", 6
        );
    }

    // --- LABIRINTO DE CINZAS ---
    public static criarBrutoDoLabirinto(): Monstro {
        return new Monstro(
            "Bruto do Labirinto", 5, 140, 140, 70, 14, 11, 5,
            "COMUM", 250,
            "Criatura gladiatória subterrânea movida a fúria.",
            FabricaItens.criarCarneSecaTaurica(), "LABIRINTO_CINZAS", 7
        );
    }
    public static criarRompedorDeFalanges(): Monstro {
        return new Monstro(
            "Rompedor de Falanges", 6, 165, 165, 85, 17, 13, 6,
            "ELITE", 350,
            "Veterano de armadura pesada de escória vulcânica.",
            FabricaItens.criarOleoDaForjaVulcanica(), "LABIRINTO_CINZAS", 8
        );
    }
    public static criarGeneralTaurico(): Monstro {
        return new Monstro(
            "General Táurico", 7, 190, 190, 95, 19, 14, 7,
            "ELITE", 420,
            "Besta lendária com chifres rúnicos e investida brutal.",
            FabricaItens.criarBalsamoDoCoracaoDeTouro(), "LABIRINTO_CINZAS", 9
        );
    }

    // --- PÂNTANO PETRIFICANTE ---
    public static criarDonzelaRastejante(): Monstro {
        return new Monstro(
            "Donzela Rastejante", 7, 150, 150, 80, 16, 9, 12,
            "COMUM", 320,
            "Sacerdotisa corrompida em fera com presas ácidas.",
            FabricaItens.criarVenenoDePresaSerpentina(), "PANTANO_PETRIFICANTE", 10
        );
    }
    public static criarGorgoneOlharCinzento(): Monstro {
        return new Monstro(
            "Górgone do Olhar Cinzento", 8, 175, 175, 90, 18, 12, 13,
            "ELITE", 460,
            "Seu olhar petrificante drena a energia e agilidade do alvo.",
            FabricaItens.criarLagrimaDeMedusa(), "PANTANO_PETRIFICANTE", 11
        );
    }
    public static criarMatriarcaGorgone(): Monstro {
        return new Monstro(
            "Matriarca Górgone", 9, 240, 240, 120, 23, 16, 15,
            "CHEFE", 700,
            "Rainha soberana do templo submerso com lâminas petrificantes.",
            FabricaItens.criarEscamaPetrificadaDaRainha(), "PANTANO_PETRIFICANTE", 12
        );
    }

    // --- COLINAS DA LUA DE SANGUE ---
    public static criarEspreitadorDaNoite(): Monstro {
        return new Monstro(
            "Espreitador da Noite", 8, 160, 160, 90, 18, 10, 15,
            "COMUM", 360,
            "Lobo negro das falésias com velocidade predatória.",
            FabricaItens.criarPresaDoCacadorNoturno(), "COLINAS_LUA_SANGUE", 13
        );
    }
    public static criarFeraCarmesim(): Monstro {
        return new Monstro(
            "Fera Carmesim", 9, 195, 195, 100, 22, 13, 16,
            "ELITE", 520,
            "Monstruosidade em permanente frenesi de sangue.",
            FabricaItens.criarOleoDeGarraDeFera(), "COLINAS_LUA_SANGUE", 14
        );
    }
    public static criarAlfaAlbinoDeVaslen(): Monstro {
        return new Monstro(
            "Alfa Albino de Vaslen", 10, 270, 270, 135, 26, 17, 18,
            "CHEFE", 850,
            "Predador ápice das montanhas nevadas cujo uivo paralisa.",
            FabricaItens.criarCoracaoGelidoDoAlfa(), "COLINAS_LUA_SANGUE", 15
        );
    }

    // --- LIMBO ESPECTRAL ---
    public static criarGotokuDasChamas(): Monstro {
        return new Monstro(
            "Gotoku das Chamas", 9, 170, 170, 100, 20, 11, 14,
            "COMUM", 400,
            "Espírito do fogo azul que rouba a estamina vital.",
            FabricaItens.criarCentelhaDeFogoFatuo(), "LIMBO_ESPECTRAL", 16
        );
    }
    public static criarYureiAguasMortas(): Monstro {
        return new Monstro(
            "Yurei das Águas Mortas", 10, 205, 205, 110, 23, 14, 16,
            "ELITE", 580,
            "Aparição translúcida cujos movimentos silenciosos aterrorizam.",
            FabricaItens.criarLamentoEctoplasmatico(), "LIMBO_ESPECTRAL", 17
        );
    }
    public static criarOnryoDoRancor(): Monstro {
        return new Monstro(
            "Onryo do Rancor Eterno", 11, 290, 290, 150, 28, 19, 19,
            "CHEFE", 1000,
            "Espírito vingativo primordial com gritos rasgadores.",
            FabricaItens.criarEssenciaDoRancorPrimordial(), "LIMBO_ESPECTRAL", 18
        );
    }

    // --- PINÁCULO DO ECLIPSE ---
    public static criarKarasuTengu(): Monstro {
        return new Monstro(
            "Karasu-Tengu da Névoa", 10, 220, 220, 120, 25, 16, 20,
            "ELITE", 650,
            "Guerreiro alado dos céus corrompidos com nodachi veloz.",
            FabricaItens.criarPenaCortanteDeTengu(), "PINACULO_ECLIPSE", 19
        );
    }
    public static criarYamabushiDosPicos(): Monstro {
        return new Monstro(
            "Yamabushi dos Picos", 11, 245, 245, 130, 27, 18, 18,
            "ELITE", 750,
            "Mestre asceta corrompido que domina ventos mortais.",
            FabricaItens.criarIncensoDoAscetaCaido(), "PINACULO_ECLIPSE", 20
        );
    }
    public static criarKitsuneNoveEcos(): Monstro {
        return new Monstro(
            "Kitsune dos Nove Ecos", 12, 340, 340, 180, 32, 22, 22,
            "CHEFE", 1500,
            "A soberana das ilusões e dos fogos celestes de Vaslen.",
            FabricaItens.criarOrbeDosNoveEcos(), "PINACULO_ECLIPSE", 21
        );
    }

    // --- CONSULTAS ---
    public static obterCatalogo(): Monstro[] {
        return [
            FabricaMonstros.criarGuerreiroEsqueletico(),
            FabricaMonstros.criarLanceiroEsqueletico(),
            FabricaMonstros.criarArqueiroEspectral(),
            FabricaMonstros.criarDegoladorSatiro(),
            FabricaMonstros.criarXamaDosChifres(),
            FabricaMonstros.criarLordeCarniceiro(),
            FabricaMonstros.criarBrutoDoLabirinto(),
            FabricaMonstros.criarRompedorDeFalanges(),
            FabricaMonstros.criarGeneralTaurico(),
            FabricaMonstros.criarDonzelaRastejante(),
            FabricaMonstros.criarGorgoneOlharCinzento(),
            FabricaMonstros.criarMatriarcaGorgone(),
            FabricaMonstros.criarEspreitadorDaNoite(),
            FabricaMonstros.criarFeraCarmesim(),
            FabricaMonstros.criarAlfaAlbinoDeVaslen(),
            FabricaMonstros.criarGotokuDasChamas(),
            FabricaMonstros.criarYureiAguasMortas(),
            FabricaMonstros.criarOnryoDoRancor(),
            FabricaMonstros.criarKarasuTengu(),
            FabricaMonstros.criarYamabushiDosPicos(),
            FabricaMonstros.criarKitsuneNoveEcos(),
        ];
    }

    public static obterPorBioma(bioma: BiomaVaslen | string): Monstro[] {
        return FabricaMonstros.obterCatalogo().filter(
            monstro => monstro.getBioma().toUpperCase() === bioma.toUpperCase()
        );
    }

    public static sortearPorBioma(bioma: BiomaVaslen | string): Monstro {
        const monstrosDoBioma = FabricaMonstros.obterPorBioma(bioma);
        if (monstrosDoBioma.length === 0) {
            throw new Error(`Nenhum monstro encontrado para o bioma: ${bioma}`);
        }
        const indiceSorteado = Math.floor(Math.random() * monstrosDoBioma.length);
        return monstrosDoBioma[indiceSorteado];
    }
}
