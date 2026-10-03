import { EntidadeCombatente } from "../entidades/EntidadeCombatente";
import { Item } from "../entidades/Item";

export class ItemComposto extends Item {
    private valorEnergia: number;

    constructor(
        id: number,
        nome: string,
        valorVida: number,
        valorEnergia: number,
        descricao: string
    ) {
        super(id, nome, "CURA_VIDA", valorVida, descricao);
        this.valorEnergia = valorEnergia;
    }

    override aplicarEfeito(alvo: EntidadeCombatente): string {
        alvo.curarVida(this.valorEfeito);
        alvo.recuperarEnergia(this.valorEnergia);
        return `${alvo.getNome()} usou ${this.nome}, restaurando ${this.valorEfeito} de vida e ${this.valorEnergia} de energia!`;
    }

    public getValorEnergia(): number {
        return this.valorEnergia;
    }
}

export class FabricaItens {
    private constructor() {}

    // --- CURA DE VIDA (Exemplo representativo de consumível de cura) ---
    public static criarMedulaEsqueletoAntigo(): Item {
        return new Item(101, "Medula de Esqueleto Antigo", "CURA_VIDA", 25, "Tutano calcificado que revitaliza o corpo cansado.");
    }
    public static criarPoDeOssosReanimados(): Item {
        return new Item(102, "Pó de Ossos Reanimados", "CURA_VIDA", 35, "Pó cinzento imbuído de energia residual que fecha ferimentos.");
    }
    public static criarSeivaNegraDoBosque(): Item {
        return new Item(103, "Seiva Negra do Bosque", "CURA_VIDA", 40, "Seiva espessa de casca retorcida que cauteriza cortes.");
    }
    public static criarCarneSecaTaurica(): Item {
        return new Item(104, "Carne Seca de Besta Táurica", "CURA_VIDA", 55, "Provisão rica em energia bruta que recupera o fôlego.");
    }
    public static criarLamentoEctoplasmatico(): Item {
        return new Item(105, "Lamento Ectoplasmático", "CURA_VIDA", 70, "Ectoplasma leitoso que cicatriza feridas espirituais e físicas.");
    }
    public static criarEscamaPetrificadaDaRainha(): Item {
        return new Item(106, "Escama Petrificada da Rainha", "CURA_VIDA", 80, "Relíquia do templo submerso capaz de estancar ferimentos graves.");
    }
    public static criarIncensoDoAscetaCaido(): Item {
        return new Item(107, "Incenso do Asceta Caído", "CURA_VIDA", 95, "Composto aromático de altares sagrados que sela hemorragias.");
    }

    // --- RECUPERAÇÃO DE ENERGIA (Exemplo representativo de consumível de estamina) ---
    public static criarCinzasDeFocoEspectral(): Item {
        return new Item(201, "Cinzas de Foco Espectral", "RECUPERA_ENERGIA", 35, "Cinzas que afiam os reflexos e restauram a estamina.");
    }
    public static criarOrvalhoDeMiasmaTribal(): Item {
        return new Item(202, "Orvalho de Miasma Tribal", "RECUPERA_ENERGIA", 45, "Extrato destilado em rituais tribais para renovar o vigor.");
    }
    public static criarLagrimaDeMedusa(): Item {
        return new Item(203, "Lágrima Cristalizada de Medusa", "RECUPERA_ENERGIA", 50, "Gota cristalizada que purifica o cansaço do guerreiro.");
    }
    public static criarPresaDoCacadorNoturno(): Item {
        return new Item(204, "Presa do Caçador Noturno", "RECUPERA_ENERGIA", 50, "Amuleto que desperta a adrenalina selvagem e fôlego de luta.");
    }
    public static criarCentelhaDeFogoFatuo(): Item {
        return new Item(205, "Centelha de Fogo Fátuo", "RECUPERA_ENERGIA", 60, "Chama azul imaterial que recarrega a energia arcanológica.");
    }

    // --- REFORÇO DE DANO (Exemplo representativo de buff tático temporário) ---
    public static criarUnguentoFuriaCarniceira(): Item {
        return new Item(301, "Unguento de Fúria Carniceira", "REFORCO_DANO", 9, "Graxa que potencializa a força bruta das armas.");
    }
    public static criarVenenoDePresaSerpentina(): Item {
        return new Item(302, "Veneno de Presa Serpentina", "REFORCO_DANO", 10, "Toxina ácida que corrói defesas e amplia o corte.");
    }
    public static criarOleoDaForjaVulcanica(): Item {
        return new Item(303, "Óleo da Forja Vulcânica", "REFORCO_DANO", 12, "Óleo mineral incandescente que faz lâminas arderem.");
    }
    public static criarOleoDeGarraDeFera(): Item {
        return new Item(304, "Óleo de Garra de Fera", "REFORCO_DANO", 14, "Substância fervente que multiplica o poder cortante.");
    }
    public static criarPenaCortanteDeTengu(): Item {
        return new Item(305, "Pena Cortante de Tengu", "REFORCO_DANO", 16, "Pena afiada como aço que amplia a penetração dos golpes.");
    }

    // --- ITEM COMPOSTO (Exemplo polimórfico: cura vida e restaura energia) ---
    public static criarBalsamoDoCoracaoDeTouro(): Item {
        return new ItemComposto(401, "Balsamo do Coração de Touro", 60, 35, "Bálsamo vigoroso que restaura 60 de vida e 35 de energia.");
    }
    public static criarCoracaoGelidoDoAlfa(): Item {
        return new ItemComposto(402, "Coração Gélido do Alfa", 90, 45, "Núcleo da fera branca que restaura 90 de vida e 45 de energia.");
    }
    public static criarEssenciaDoRancorPrimordial(): Item {
        return new ItemComposto(403, "Essência do Rancor Primordial", 100, 50, "Eco purificado que restaura 100 de vida e 50 de energia.");
    }
    public static criarOrbeDosNoveEcos(): Item {
        return new ItemComposto(404, "Orbe dos Nove Ecos Celestes", 130, 70, "Relíquia suprema da Kitsune que restaura 130 de vida e 70 de energia.");
    }

    // --- ITENS BÁSICOS DE SUPORTE ---
    public static criarPocaoVidaMenor(): Item {
        return new Item(1, "Poção de Vida Menor", "CURA_VIDA", 30, "Restaura 30 pontos de vida.");
    }
    public static criarPocaoVidaMaior(): Item {
        return new Item(2, "Poção de Vida Maior", "CURA_VIDA", 70, "Restaura 70 pontos de vida.");
    }
    public static criarElixirEnergia(): Item {
        return new Item(3, "Elixir de Energia", "RECUPERA_ENERGIA", 40, "Restaura 40 pontos de energia.");
    }
    public static criarFrascoReforcoDano(): Item {
        return new Item(4, "Frasco de Reforço de Dano", "REFORCO_DANO", 8, "Adiciona +8 ao dano.");
    }
    public static criarExtratoNevoaPurificada(): Item {
        return new ItemComposto(5, "Extrato de Névoa Purificada", 50, 30, "Restaura 50 de vida e 30 de energia.");
    }

    public static obterCatalogo(): Item[] {
        return [
            FabricaItens.criarMedulaEsqueletoAntigo(),
            FabricaItens.criarPoDeOssosReanimados(),
            FabricaItens.criarCinzasDeFocoEspectral(),
            FabricaItens.criarSeivaNegraDoBosque(),
            FabricaItens.criarOrvalhoDeMiasmaTribal(),
            FabricaItens.criarUnguentoFuriaCarniceira(),
            FabricaItens.criarCarneSecaTaurica(),
            FabricaItens.criarOleoDaForjaVulcanica(),
            FabricaItens.criarBalsamoDoCoracaoDeTouro(),
            FabricaItens.criarVenenoDePresaSerpentina(),
            FabricaItens.criarLagrimaDeMedusa(),
            FabricaItens.criarEscamaPetrificadaDaRainha(),
            FabricaItens.criarPresaDoCacadorNoturno(),
            FabricaItens.criarOleoDeGarraDeFera(),
            FabricaItens.criarCoracaoGelidoDoAlfa(),
            FabricaItens.criarCentelhaDeFogoFatuo(),
            FabricaItens.criarLamentoEctoplasmatico(),
            FabricaItens.criarEssenciaDoRancorPrimordial(),
            FabricaItens.criarPenaCortanteDeTengu(),
            FabricaItens.criarIncensoDoAscetaCaido(),
            FabricaItens.criarOrbeDosNoveEcos(),
        ];
    }
}
