import { EntidadeCombatente } from "../entidades/EntidadeCombatente";
import { Item } from "../entidades/Item";

/**
 * Subclasse especializada para itens de efeitos compostos (múltiplos atributos).
 * Demonstra Herança e Polimorfismo sobrescrevendo o método aplicarEfeito().
 */
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

/**
 * Fábrica de Domínio responsável por criar instâncias canônicas de Itens de Vaslen.
 * Implementa o Padrão de Projeto Factory com métodos estáticos, garantindo
 * centralização das regras de negócio, valores oficiais e imutabilidade dos modelos.
 */
export class FabricaItens {
    /**
     * Construtor privado para evitar instanciação direta (classe puramente estática).
     */
    private constructor() {}

    /**
     * Cria uma Poção de Vida Menor (+30 de Vida).
     * Item comum de recuperação básica.
     */
    public static criarPocaoVidaMenor(): Item {
        return new Item(
            1,
            "Poção de Vida Menor",
            "CURA_VIDA",
            30,
            "Um frasco com essência avermelhada que restaura 30 pontos de vida."
        );
    }

    /**
     * Cria uma Poção de Vida Maior (+70 de Vida).
     * Item potente para curar ferimentos profundos.
     */
    public static criarPocaoVidaMaior(): Item {
        return new Item(
            2,
            "Poção de Vida Maior",
            "CURA_VIDA",
            70,
            "Um frasco translúcido pulsando energia vital que restaura 70 pontos de vida."
        );
    }

    /**
     * Cria um Elixir de Energia (+40 de Energia).
     * Restaura estamina para habilidades e golpes especiais.
     */
    public static criarElixirEnergia(): Item {
        return new Item(
            3,
            "Elixir de Energia",
            "RECUPERA_ENERGIA",
            40,
            "Destilado revigorante de raízes de Vaslen que restaura 40 pontos de energia."
        );
    }

    /**
     * Cria um Frasco de Reforço de Dano (+8 de Bônus de Dano).
     * Potencializa a próxima ação ofensiva.
     */
    public static criarFrascoReforcoDano(): Item {
        return new Item(
            4,
            "Frasco de Reforço de Dano",
            "REFORCO_DANO",
            8,
            "Óleo alquímico bélico que adiciona +8 ao fator de impacto ofensivo."
        );
    }

    /**
     * Cria um Extrato de Névoa Purificada (+50 de Vida e +30 de Energia).
     * Item raro/misto que recupera vida e energia simultaneamente.
     */
    public static criarExtratoNevoaPurificada(): Item {
        return new ItemComposto(
            5,
            "Extrato de Névoa Purificada",
            50,
            30,
            "Rara essência destilada da Névoa de Vaslen. Restaura 50 pontos de vida e 30 de energia."
        );
    }

    /**
     * Retorna o catálogo completo com todos os modelos de itens disponíveis no jogo.
     * Útil para testes, inicialização de loots e vitrines de inventário.
     */
    public static obterCatalogo(): Item[] {
        return [
            FabricaItens.criarPocaoVidaMenor(),
            FabricaItens.criarPocaoVidaMaior(),
            FabricaItens.criarElixirEnergia(),
            FabricaItens.criarFrascoReforcoDano(),
            FabricaItens.criarExtratoNevoaPurificada(),
        ];
    }
}
