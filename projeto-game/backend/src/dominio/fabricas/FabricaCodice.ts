import { EntradaCodice } from "../entidades/EntradaCodice";

export class FabricaCodice {
    private constructor() {}

    public static criarEntradasIniciais(): EntradaCodice[] {
        return [
            // =================================================================
            // HISTÓRIA DE VASLEN
            // =================================================================
            new EntradaCodice(
                1,
                "A Grande Fratura de Vaslen",
                "HISTORIA",
                "O cataclismo arcano que rompeu a barreira da realidade e mergulhou o reino na Névoa.",
                "Há três séculos, os arquimagos da corte de Vaslen tentaram canalizar o Núcleo Cósmico sob as fundações da capital. O experimento rompeu a própria tessitura do espaço-tempo em um evento conhecido como A Grande Fratura. Uma névoa densa e corruptora emergiu das entranhas da terra, reanimando mortos, deformando a fauna e corrompendo guardiões espirituais.",
                ["fratura", "cataclismo", "origem", "nevoa", "historia"]
            ),
            new EntradaCodice(
                2,
                "O Reino dos Ecos",
                "HISTORIA",
                "Como a sociedade humana ruiu e os sobreviventes refugiaram-se em fortalezas muradas.",
                "Após a Fratura, cidades inteiras transformaram-se em necrópoles silenciosas. As antigas leis ruíram e o reino passou a ser chamado de Os Ecos de Vaslen, pois tudo o que nele habita é apenas um eco distorcido de sua antiga glória. Apenas guerreiros e conjuradores treinados ousam cruzar as fronteiras fortificadas.",
                ["sociedade", "ecos", "queda", "sobreviventes", "fortaleza"]
            ),

            // =================================================================
            // REGIÕES / BIOMAS
            // =================================================================
            new EntradaCodice(
                3,
                "As Criptas de Vaslen",
                "REGIAO",
                "Necrópole subterrânea onde repousam as hostes sepultadas da antiga dinastia.",
                "Labirinto de catacumbas de pedra calcária esculpido sob a antiga capital. A infiltração constante da Névoa reanima ossadas antigas, forçando os mortos a repetirem eternamente suas patrulhas marciais.",
                ["criptas", "esqueletos", "tumbas", "subterraneo", "mortos-vivos"]
            ),
            new EntradaCodice(
                4,
                "O Bosque Sombrio",
                "REGIAO",
                "Florestas retorcidas onde a seiva das árvores tornou-se negra e venenosa.",
                "Outrora o refúgio natural de Vaslen, este bosque foi asfixiado por raízes venenosas. Criaturas tribais de feições caprinas tomaram o território, emboscando qualquer forasteiro que ouse perturbar o silêncio da mata.",
                ["bosque", "floresta", "satiros", "colinas", "tribal"]
            ),
            new EntradaCodice(
                5,
                "O Labirinto de Cinzas",
                "REGIAO",
                "Ruínas colossais e galerias de escória vulcânica habitadas por bestas de chifres.",
                "Complexo subterrâneo escavado nas encostas vulcânicas de Vaslen. Labirintos de pedra sem saída abrigam guerreiros táuricos de força colossal forjados no submundo.",
                ["labirinto", "cinzas", "minotauros", "vulcanico", "pedra"]
            ),
            new EntradaCodice(
                6,
                "O Pântano Petrificante",
                "REGIAO",
                "Brejo tóxico pontilhado de estátuas de guerreiros que olharam para o terror.",
                "Brejo alimentado por miasmas venenosos. Viajantes que adentram o pântano encontram figuras esculpidas em pedra com expressões de pânico: vítimas do olhar de górgones.",
                ["pantano", "medusa", "gorgone", "petrificacao", "veneno"]
            ),
            new EntradaCodice(
                7,
                "As Colinas da Lua de Sangue",
                "REGIAO",
                "Terras altas varridas por ventos cortantes e dominadas pelo uivo das feras.",
                "As cristas montanhosas de Vaslen ficam sob o foco direto da lua rasgada pela Fratura. Alcateias de licantropos ferozes caçam sob a liderança do lendário Alfa Albino.",
                ["colinas", "lua", "lobisomem", "sangue", "alcateia"]
            ),
            new EntradaCodice(
                8,
                "O Limbo Espectral",
                "REGIAO",
                "Fenda etérea entre o mundo físico e o plano das almas atormentadas.",
                "Região onde a gravidade e o tempo perdem consistência. Labaredas azuis flutuam no vácuo, e os lamentos dos que pereceram ecoam através de aparições e espíritos vingativos.",
                ["limbo", "espectro", "youkai", "almas", "etereo"]
            ),
            new EntradaCodice(
                9,
                "O Pináculo do Eclipse",
                "REGIAO",
                "O ponto mais alto de Vaslen, banhado em penumbra perpétua e corrupção primordial.",
                "Santuário ancestral sobre o pico mais íngreme de Vaslen. Sob o eclipse perpétuo, demônios alados e a majestosa Kitsune governam as cinzas celestiais.",
                ["pinaculo", "eclipse", "demonios", "tengu", "kitsune", "topo"]
            ),

            // =================================================================
            // MONSTROS E FERAS
            // =================================================================
            new EntradaCodice(
                10,
                "A Soberana dos Nove Ecos",
                "MONSTRO",
                "A lenda da Kitsune primordial que comanda as chamas e ilusões de Vaslen.",
                "Guardava os portais espirituais antes da Fratura. Quando o véu ruiu, absorveu a dor de milhares de mortos, tornando-se uma deusa de fogo espectral e destreza transcendental.",
                ["kitsune", "chefe", "nove-caudas", "fogo", "ilusao", "demonio"]
            ),
            new EntradaCodice(
                11,
                "A Maldição da Licantropia Carmesim",
                "MONSTRO",
                "A transformação selvagem que assola os guerreiros sobreviventes.",
                "Infecção arcanológica da Névoa no sangue dos mais fortes. A transformação retira a humanidade, concedendo garras de ferro e ferocidade insaciável.",
                ["lobisomem", "licantropia", "maldicao", "ferocidade"]
            ),
            new EntradaCodice(
                12,
                "A Rainha Petrificante de Escamas Negras",
                "MONSTRO",
                "A matriarca górgone que governa o coração do Pântano.",
                "Donzela que se banhou no veneno abissal para defender seu templo. Seu corpo fundiu-se a serpentes e seu olhar solidifica o fluxo de energia dos oponentes.",
                ["medusa", "gorgone", "petrificacao", "chefe", "rainha"]
            ),

            // =================================================================
            // RELÍQUIAS E ESPÓLIOS DE MONSTROS
            // =================================================================
            new EntradaCodice(
                13,
                "Ossadas e Cinzas das Criptas",
                "RELÍQUIA",
                "Propriedades curativas e místicas extraídas dos mortos-vivos das catacumbas.",
                "A Medula de Esqueleto Antigo e o Pó de Ossos retêm o eco da força física que sustentava os guerreiros caídos, agindo como cauterizantes rápidos de feridas. Já as Cinzas de Foco dos arqueiros guardam a disciplina de mira, restaurando a estamina de combate.",
                ["esqueleto", "medula", "cinzas", "cura", "energia", "criptas"]
            ),
            new EntradaCodice(
                14,
                "Seivas e Alquimia Tribal dos Sátiros",
                "RELÍQUIA",
                "Compostos rústicos produzidos pelas tribos caprinas do Bosque Sombrio.",
                "A Seiva Negra do Bosque coagula cortes instantaneamente, enquanto o Orvalho de Miasma é inalado por xamãs para estender seus transes de combate. O temido Unguento de Fúria Carniceira, feito com gordura de besta, cobre lâminas aumentando a força de impacto.",
                ["satiro", "seiva", "orvalho", "unguento", "dano", "bosque"]
            ),
            new EntradaCodice(
                15,
                "Espólios Táuricos e Óleos de Forja",
                "RELÍQUIA",
                "Materiais densos e combustíveis recolhidos nos restos dos minotauros do Labirinto.",
                "A Carne Seca Táurica é densa e altamente calórica, recuperando grande quantidade de vitalidade. O Óleo da Forja Vulcânica arde em contato com o ar quando espalhado em armas. O Bálsamo de Coração de Touro é um item composto raro que revitaliza tanto a vida quanto a estamina.",
                ["minotauro", "forja", "oleo", "balsamo", "labirinto", "dano"]
            ),
            new EntradaCodice(
                16,
                "Venenos e Lágrimas das Górgones",
                "RELÍQUIA",
                "Secreções ácidas e minerais retiradas das serpentes do Pântano Petrificante.",
                "O Veneno de Presa Serpentina corrói armaduras ao ser aplicado em lâminas. A Lágrima Cristalizada de Medusa dissipa o torpor muscular devolvendo agilidade. Por fim, a Escama Petrificada da Matriarca é uma couraça impenetrável que regenera vigorosamente a vida do usuário.",
                ["gorgone", "veneno", "lagrima", "escama", "pantano", "medusa"]
            ),
            new EntradaCodice(
                17,
                "Garras e Corações Licantropos",
                "RELÍQUIA",
                "Óleos ferventes e núcleos anatômicos colhidos dos lobisomens das Colinas.",
                "A Presa do Caçador Noturno estimula a adrenalina pura de batalha. O Óleo de Garra de Fera amplia a letalidade cortante das armas. O lendário Coração Gélido do Alfa Albino bombeia poder primordial restaurando imensos pontos de vida e energia.",
                ["lobisomem", "garra", "oleo", "coracao", "alfa", "sangue"]
            ),
            new EntradaCodice(
                18,
                "Ectoplasmas e Fogos do Limbo",
                "RELÍQUIA",
                "Manifestações intangíveis capturadas das aparições e do rancor espectral.",
                "A Centelha de Fogo Fátuo reabastece instantaneamente reservas mágicas de energia. O Lamento Ectoplasmático das Yureis absorve ferimentos físicos. A Essência do Rancor Primordial pacifica o espírito do guerreiro, concedendo restauração mista maciça.",
                ["espectro", "fogo-fatuo", "lamento", "rancor", "limbo", "youkai"]
            ),
            new EntradaCodice(
                19,
                "Relíquias Sagradas do Pináculo",
                "RELÍQUIA",
                "Artefatos celestiais e essências supremas dos mestres do Pináculo do Eclipse.",
                "A Pena Cortante de Tengu confere penetração laminar absoluta aos ataques. O Incenso do Asceta Caído expurga qualquer dor física. O Orbe dos Nove Ecos da Kitsune é a relíquia máxima de Vaslen, restaurando plenamente o corpo e o espírito do herói.",
                ["tengu", "kitsune", "pena", "incenso", "orbe", "pinaculo", "reliquia"]
            ),
        ];
    }

    public static obterPorCategoria(categoria: 'MONSTRO' | 'REGIAO' | 'RELÍQUIA' | 'HISTORIA'): EntradaCodice[] {
        return FabricaCodice.criarEntradasIniciais().filter(
            entrada => entrada.getCategoria().toUpperCase() === categoria.toUpperCase()
        );
    }

    public static buscar(termo: string): EntradaCodice[] {
        return FabricaCodice.criarEntradasIniciais().filter(entrada => entrada.contemTermo(termo));
    }
}
