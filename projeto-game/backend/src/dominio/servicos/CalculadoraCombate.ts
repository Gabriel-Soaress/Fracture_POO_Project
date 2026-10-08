/**
 * Serviço de Domínio Matemático do Combate (Stateless).
 * Centraliza as fórmulas de física do jogo: cálculo de dano líquido,
 * mitigação de armadura/defesa, chance probabilística de esquiva,
 * acertos críticos e rolagens de dados de iniciativa.
 */
export class CalculadoraCombate {
    private constructor() {}

    /**
     * Calcula o dano final desferido após passar pelas defesas do alvo.
     * RN05: O dano nunca pode ser menor que 1 ponto para evitar combates infinitos.
     */
    public static calcularDanoEfetivo(
        forcaAtacante: number,
        multiplicadorGolpe: number,
        defesaDefensor: number,
        estaDefendendo: boolean,
        bonusDanoExtra: number = 0
    ): { danoFinal: number; foiMitigadoPorDefesa: boolean } {
        // 1. Dano bruto gerado pelo ataque
        const danoBruto = Math.round((forcaAtacante * multiplicadorGolpe) + bonusDanoExtra);

        // 2. Redução natural da armadura (cada ponto de defesa absorve 50% de dano)
        const reducaoDefesa = Math.round(defesaDefensor * 0.5);
        let danoBase = Math.max(1, danoBruto - reducaoDefesa);

        // 3. Postura de defesa ativa: reduz mais 30% do impacto restante
        let foiMitigadoPorDefesa = false;
        if (estaDefendendo) {
            danoBase = Math.max(1, Math.round(danoBase * 0.7));
            foiMitigadoPorDefesa = true;
        }

        return {
            danoFinal: danoBase,
            foiMitigadoPorDefesa
        };
    }

    /**
     * Verifica se o defensor conseguiu se esquivar do golpe com base na agilidade relativa.
     * Retorna true se o defensor desviou completamente do ataque.
     */
    public static verificarEsquiva(agilidadeAtacante: number, agilidadeDefensor: number): boolean {
        // Chance base de 5%. A cada ponto de agilidade superior do defensor, ganha +3% (máximo 35% de teto).
        const diferenca = agilidadeDefensor - agilidadeAtacante;
        const chanceEsquiva = Math.min(35, Math.max(5, 5 + (diferenca * 3)));

        const rolagemD100 = Math.random() * 100;
        return rolagemD100 < chanceEsquiva;
    }

    /**
     * Avalia se o ataque desferido foi um acerto crítico (dano multiplicado por 1.5x).
     */
    public static verificarCritico(agilidadeAtacante: number): { ehCritico: boolean; multiplicador: number } {
        // Chance de crítico entre 5% e 25% baseada na agilidade do atacante
        const chanceCritico = Math.min(25, Math.max(5, agilidadeAtacante * 1.5));

        const rolagemD100 = Math.random() * 100;
        if (rolagemD100 < chanceCritico) {
            return { ehCritico: true, multiplicador: 1.5 };
        }

        return { ehCritico: false, multiplicador: 1.0 };
    }

    /**
     * Rola a iniciativa de combate (RN06) somando a agilidade com um dado d10 (1 a 10).
     */
    public static rolarIniciativa(agilidade: number): number {
        const dadoD10 = Math.floor(Math.random() * 10) + 1;
        return dadoD10 + agilidade;
    }
}
