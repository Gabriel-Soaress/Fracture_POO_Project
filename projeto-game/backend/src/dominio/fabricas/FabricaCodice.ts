import { EntradaCodice } from "../entidades/EntradaCodice";

export class FabricaCodice {
    private constructor() {}

    public static criarEntradasIniciais(): EntradaCodice[] {
        return [
            // =================================================================
            // 1. HISTÓRIA & CRÔNICAS DE VASLEN
            // =================================================================
            new EntradaCodice(
                1,
                "A Grande Fratura de Vaslen",
                "HISTORIA",
                "O cataclismo arcano primordial que rompeu a barreira dimensional e cobriu o reino com a Névoa dos Ecos.",
                `Há mais de três séculos, Vaslen representava o zênite da civilização humana, guiado pelo Colégio Arcano Imperial. Em busca de uma fonte ilimitada de vigor e energia para alimentar cidades flutuantes e forjas eternas, os Sete Grão-Magos tentaram drenar o Núcleo Cósmico nas profundezas abissais da capital.

O experimento ultrapassou o limiar de contenção mágica. A membrana que separava a existência material do plano do Limbo colapsou em uma detonação silenciosa que despedaçou montanhas e abriu fendas abissais por todo o reino. Desse abismo ascendeu a "Névoa da Fratura": uma bruma esmeralda e etérea carregada de micropartículas de éter bruto e memórias de almas mortas.

A Névoa não apenas asfixiou os vivos, mas gravou-se no solo, animando cadáveres milenares, deformando os animais selvagens em quimeras carnívoras e corrompendo os espíritos guardiões da natureza em divindades enlouquecidas.`,
                ["fratura", "cataclismo", "origem", "nevoa", "historia", "grao-magos"]
            ),
            new EntradaCodice(
                2,
                "A Queda dos Sete Bastiões",
                "HISTORIA",
                "O cerco ininterrupto que esmagou a linha defensiva das províncias imperiais.",
                `Durante o primeiro século pós-Fratura, o Exército Imperial ergueu os chamados Sete Bastiões — muralhas monumentais de pedra basáltica banhadas em runas protetoras com o intuito de conter o avanço das feras da Névoa.

No entanto, a corrupção não vinha apenas de fora: ela brotava das nascentes de água, das criptas familiares e do desespero dos sitiados. Um a um, cada baluarte caiu sob o peso de traições internas, peste mágica e investidas de bestas monumentais guiadas por instinto destrutivo. 

O último grande feudo a resistir transformou-se no refúgio fortificado onde hoje os poucos sobreviventes treinam novos caçadores e canalizadores, guardando as últimas forjas de ferro rúnico de Vaslen.`,
                ["bastioes", "queda", "muralhas", "guerra", "sobreviventes", "feudo"]
            ),
            new EntradaCodice(
                3,
                "A Natureza dos Ecos e a Corrupção",
                "HISTORIA",
                "Como a Névoa da Fratura absorve o sofrimento e cria ecos distorcidos da realidade.",
                `A Névoa da Fratura não é mera névoa atmosférica; é uma consciência entrópica líquida e etérea. Quando um ser vivo perece sob sua influência, sua força vital não viaja ao descanso eterno. Em vez disso, seu medo, arrependimento e instintos primordiais são duplicados e cristalizados no mundo material.

É por essa razão que os habitantes de Vaslen chamam essas manifestações de "Ecos". Um soldado esqueleto não recorda seu nome nem sua família, mas seu eco o compele a brandir sua espada com exata memória muscular; um sátiro outrora pacífico torna-se uma máquina de decapitação sem piedade. Vencer um combate em Vaslen não significa apenas esmagar carne e osso, mas dissipar e purificar o eco que o sustenta.`,
                ["ecos", "corrupcao", "alma", "entropia", "eter", "lore"]
            ),
            new EntradaCodice(
                4,
                "A Tríade dos Campeões: As Três Ordens",
                "HISTORIA",
                "A filosofia marcial e espiritual que moldou Guerreiros, Magos e Samurais.",
                `Sem um exército regular para proteger os remanescentes de Vaslen, três vias distintas de combate emergiram como bastiões da sobrevivência:

• A Ordem da Guarda de Ferro (Guerreiros): Cavaleiros que apostam no treinamento com aço temperado, postura defensiva impenetrável e golpes brutais de quebra-guarda para desarticular inimigos com armaduras densas.
• O Conclave do Éter Condensado (Magos): Eruditos que recusam o temor à Névoa e decidiram estudá-la, canalizando mana para conjurar labaredas místicas, explosões arcanas e barreiras defensivas capazes de desafiar feras incorpóreas.
• O Clã das Sombras de Kenshi (Samurais): Espadachins originários dos cumes orientais do Pináculo, devotos da velocidade letal, do corte em ponto vital e do foco espiritual profundo, utilizando pílulas e elixires ancestrais para lutar em perfeita comunhão de mente e reflexos.`,
                ["classes", "guerreiro", "mago", "samurai", "ordens", "filosofia"]
            ),

            // =================================================================
            // 2. OS 7 BIOMAS DO ARQUIPÉLAGO DA FRATURA
            // =================================================================
            new EntradaCodice(
                5,
                "Região I: As Criptas de Vaslen",
                "REGIAO",
                "Necrópole monumental e catacumbas ancestrais sob as fundações do império caído.",
                `Profundamente esculpidas em calcário cinzento e mármore oxidado, as Criptas abrigam os ossos de três dinastias de governantes, soldados e plebeus. Com a ruptura da Fratura, as câmaras inferiores foram alagadas por sedimentos da névoa, ressuscitando falanges inteiras.

O ar é gelado e exala enxofre antigo. As paredes são marcadas por arranhões desesperados dos que foram sepultados vivos durante o cataclismo. Apesar de ser a primeira fronteira de caçada de qualquer novato, seus corredores labirínticos guardam arqueiros e lanceiros que mantêm viva a disciplina militar de séculos passados.`,
                ["criptas", "esqueletos", "regiao", "necropole", "etapa1"]
            ),
            new EntradaCodice(
                6,
                "Região II: O Bosque Sombrio",
                "REGIAO",
                "Florestas primitivas com raízes carnívoras e clãs de sátiros corrompidos.",
                `Outrora a floresta dos druidas sagrados de Vaslen, o Bosque foi asfixiado por raízes carnívoras pretas que drenam sangue e magia do solo. As copas das árvores são tão espessas que a luz do sol jamais toca a relva venenosa.

O bioma é governado por clãs de sátiros cruéis, criaturas com pernas caprinas e chifres retorcidos que sacrificam viajantes em altares de pedra bruta. É uma região marcada por emboscadas rápidas, espinhos tóxicos e xamanismo primal que desafia qualquer investida despreparada.`,
                ["bosque", "satiros", "floresta", "natureza", "etapa2"]
            ),
            new EntradaCodice(
                7,
                "Região III: O Labirinto de Cinzas",
                "REGIAO",
                "Desfiladeiros vulcânicos e forjas táuricas de magma incandescente.",
                `Cânions basálticos e cavernas esculpidas pelas veias de lava do vulcão Gor'Thul. O calor sufocante e as cinzas suspensas tornam o ar abrasivo para pulmões não protegidos por elixires.

Neste território colapsado habitam os minotauros de Vaslen: gigantes com couraças forjadas em escória vulcânica e machados monumentais. A sociedade táurica valoriza o combate de arena e a honra brutal; invasores não são apenas rechaçados, mas pulverizados nas bigornas e forjas subterrâneas.`,
                ["labirinto", "cinzas", "minotauro", "vulcao", "fogo", "etapa3"]
            ),
            new EntradaCodice(
                8,
                "Região IV: O Pântano Petrificante",
                "REGIAO",
                "Manguezais ácidos e lagoas mortas repletas de guerreiros transformados em calcário.",
                `Um brejo lamacento saturado de vapores sulfúricos e poças alcalinas que dissolvem botas e armaduras. O solo traiçoeiro esconde raízes submersas e presas de víboras d'água gigantes.

O aspecto mais aterrorizante do pântano é seu museu natural macabro: centenas de estátuas de caçadores, com expressões de desespero e espadas erguidas, congelados no tempo pelo olhar petrificante das serpentes górgones que nidificam sob as ruínas dos templos afundados.`,
                ["pantano", "petrificacao", "gorgone", "veneno", "etapa4"]
            ),
            new EntradaCodice(
                9,
                "Região V: As Colinas da Lua de Sangue",
                "REGIAO",
                "Picos escarpados e falésias expostas à luz rubra da lua fraturada.",
                `Cordilheira escarpada de ventos gélidos cortantes, localizada diretamente abaixo do vórtice onde a lua cósmica de Vaslen foi partida ao meio. Durante todas as noites, a luz emitida pelos fragmentos lunares banha as rochas com uma cor carmesim ameaçadora.

O brilho rubro ativa um frenesi sanguíneo irreversível nos predadores locais, gerando alcateias de lobisomens bípedes de reflexos sobre-humanos, liderados pelo lendário Alfa Albino, uma abominação que comanda o vento nevado e uivos paralisantes.`,
                ["colinas", "lua", "sangue", "lobisomem", "gelo", "etapa5"]
            ),
            new EntradaCodice(
                10,
                "Região VI: O Limbo Espectral",
                "REGIAO",
                "Garganta de vácuo onde as leis da física e da morte entram em colapso.",
                `No Limbo Espectral, o tecido espacial foi completamente dissolvido pela Fratura. Ilhas de rocha flutuam sem gravidade sobre abismos cósmicos, e chamas azuis conhecidas como fogos-fátuos bailam sem consumir oxigênio.

Entidades não-corpóreas, yureis desoladas e espíritos vingativos (onryo) assombram as ruínas dos mosteiros astrais. Neste bioma, escudos convencionais e aço físico oferecem pouca proteção: os ataques das entidades visam diretamente a alma, a estamina e a mente do aventureiro.`,
                ["limbo", "espectros", "youkai", "almas", "vazio", "etapa6"]
            ),
            new EntradaCodice(
                11,
                "Região VII: O Pináculo do Eclipse",
                "REGIAO",
                "O zênite divino de Vaslen, coroado sob um eclipse solar sem fim.",
                `A montanha sagrada que toca o topo do firmamento. No cume inalcançável repousa o Grande Santuário Solar, agora congelado em um eclipse celestial permanente: uma coroa dourada flamejante em torno de um disco de trevas absolutas.

Ali a Névoa da Fratura refinou-se em energia pura. Demônios celestiais Tengu patrulham os céus cortando ventos com katanas cerimoniais, enquanto a Suprema Kitsune dos Nove Ecos aguarda no trono de pétalas negras, testando a alma do campeão que aspira libertar Vaslen de seu ciclo de perdição.`,
                ["pinaculo", "eclipse", "tengu", "kitsune", "topo", "chefe_final", "etapa7"]
            ),

            // =================================================================
            // 3. BESTIÁRIO: AS 21 AMEAÇAS COLOSSAIS
            // =================================================================
            // --- CRIPTAS ---
            new EntradaCodice(
                12,
                "Guerreiro Esquelético [Nv. 1]",
                "MONSTRO",
                "Infantaria óssea reanimada armada com gladio e escudo corroído.",
                `Primeira fera encontrada nas catacumbas. Embora seus ossos estejam ressecados pelo tempo, a Névoa preenche suas articulações com uma força surpreendente. 

Costuma alternar entre golpes velozes de espada e investidas súbitas quando vê aberturas na guarda do herói. Não sente dor ou cansaço, exigindo golpes contundentes para desarticular sua bacia e crânio.
• Ponto Forte: Imunidade a medo e sangramento.
• Fraqueza: Ataques pesados e brutais quebram sua estrutura óssea rapidamente.`,
                ["monstro", "esqueleto", "guerreiro", "criptas", "nv1"]
            ),
            new EntradaCodice(
                13,
                "Lanceiro Esquelético [Nv. 2]",
                "MONSTRO",
                "Guarda sepulcral de lança longa e perfuração de armadura.",
                `Guerreiros de elite das antigas cortes fúnebres de Vaslen. Empunham lanças com pontas enferrujadas tratadas com sal mineral necrosante.

Mantêm distância calculada do alvo e utilizam o alcance da haste para desferir ataques perfurantes precisos que ignoram parte da armadura de couro ou malha. Quando acuados, fecham a guarda com tenacidade militar.`,
                ["monstro", "esqueleto", "lanceiro", "criptas", "nv2"]
            ),
            new EntradaCodice(
                14,
                "Arqueiro Espectral [Nv. 3 - Elite]",
                "MONSTRO",
                "Atirador cadavérico com flechas etéreas que drenam estamina vital.",
                `Habita nichos elevados e galerias superiores das Criptas. Seu arco curvo dispara flechas envoltas em névoa espectral azul. 

Cada acerto não fere apenas o corpo físico, mas esfria o sangue do caçador, drenando porções críticas de sua energia de combate. Em distâncias curtas, é capaz de estocar flechas diretamente no peito do adversário em um movimento desesperado.`,
                ["monstro", "esqueleto", "arqueiro", "elite", "criptas", "nv3"]
            ),

            // --- BOSQUE SOMBRIO ---
            new EntradaCodice(
                15,
                "Degolador dos Bosques [Nv. 3]",
                "MONSTRO",
                "Sátiro batedor veloz munido de adagas recurvadas com seiva ácida.",
                `Patrulha as clareiras escuras do Bosque Sombrio camuflado pela folhagem densa. Seus cascos caprinos permitem saltar entre troncos com agilidade desconcertante.

Ataca em rajadas de cortes rápidos mirando artérias expostas. Suas lâminas são untadas na seiva negra das árvores mortas, causando feridas que queimam como brasa viva.`,
                ["monstro", "satiro", "bosque", "degolador", "nv3"]
            ),
            new EntradaCodice(
                16,
                "Xamã dos Chifres [Nv. 4 - Elite]",
                "MONSTRO",
                "Líder místico tribal que invoca feitiços de miasma e drenagem de fôlego.",
                `Ancião dos clãs sátiros que ostenta chifres decorados com crânios de pássaros e penas corrompidas. Carrega um cajado rústico talhado em madeira carnívora.

Em combate, canaliza a fumaça de incensos de miasma tribal para ofuscar a visão do caçador e restaurar seu próprio vigor. Seus ataques mágicos golpeiam em arco, desgastando a postura de quem tenta apenas bloquear passivamente.`,
                ["monstro", "xama", "satiro", "elite", "bosque", "nv4"]
            ),
            new EntradaCodice(
                17,
                "Lorde Carniceiro [Nv. 5 - Chefe de Setor]",
                "MONSTRO",
                "Colosso caprino cuja clava de pedra bruta despedaça defesas pesadas.",
                `O patriarca guerreiro do Bosque Sombrio. Possui o dobro da altura de um homem comum e carrega um tronco cravejado de dentes de feras como maça de combate.

Seus golpes não são refinados, mas carregam inércia descomunal: um impacto direto quebra a guarda do herói e o arremessa contra as raízes. Quando enfurecido, entra em estado de frenesi violento que aumenta drasticamente o dano de suas investidas.`,
                ["monstro", "carniceiro", "satiro", "chefe", "bosque", "nv5"]
            ),

            // --- LABIRINTO DE CINZAS ---
            new EntradaCodice(
                18,
                "Bruto do Labirinto [Nv. 5]",
                "MONSTRO",
                "Gladiador minotauro movido a fúria cega nas galerias estreitas de basalto.",
                `Nascido nas forjas subterrâneas, este guerreiro meio-homem meio-touro foi condicionado para o combate contínuo nas arenas basálticas. 

Avança com a cabeça baixa em investidas que estilhaçam escudos leves. Seu couro espesso atua como armadura natural contra cortes superficiais, exigindo do herói manobras contundentes e paciência tática.`,
                ["monstro", "minotauro", "bruto", "labirinto", "cinzas", "nv5"]
            ),
            new EntradaCodice(
                19,
                "Rompedor de Falanges [Nv. 6 - Elite]",
                "MONSTRO",
                "Minotauro encouraçado em placas de escória vulcânica e maça ardente.",
                `Veterano das guerras de conquista dos desfiladeiros. Seu peitoral de ferro bruto é soldado diretamente sobre suas escamas e couro, tornando-o quase impenetrável pela frente.

Utiliza maças pesadas e técnicas de esmagamento contínuo. É capaz de suportar punições severas sem recuar um único passo, obrigando o caçador a utilizar ataques brutais que quebram postura para abrir brechas.`,
                ["monstro", "minotauro", "rompedor", "elite", "labirinto", "cinzas", "nv6"]
            ),
            new EntradaCodice(
                20,
                "General Táurico [Nv. 7 - Chefe Táurico]",
                "MONSTRO",
                "Líder supremo dos minotauros armado com machado duplo forjado em lava viva.",
                `Comandante militar da fortaleza de magma. Ostenta chifres monumentais polidos com runas de fogo e empunha um machado de guerra duplo que incandesce a cada golpe.

Combina a brutalidade física ancestral táurica com estratégia militar impiedosa: alterna golpes de abertura rápida com machadadas verticais capazes de fender a rocha basáltica ao meio. Derrotá-lo rende o cobiçado Bálsamo do Coração de Touro.`,
                ["monstro", "general", "minotauro", "chefe", "labirinto", "cinzas", "nv7"]
            ),

            // --- PÂNTANO PETRIFICANTE ---
            new EntradaCodice(
                21,
                "Donzela Rastejante [Nv. 7]",
                "MONSTRO",
                "Sacerdotisa corrompida com cauda ofídica e presas embebidas em veneno ácido.",
                `Outrora guardiã dos banhos termais sagrados, esta criatura teve seu corpo fundido ao de serpentes d'água gigantes pela Névoa. Move-se sem fazer ruído pela lama profunda.

Desfere botes velozes mirando juntas e tendões do oponente. Suas presas injetam secreções ácidas que corroem a pele e diminuem a capacidade de reação muscular do herói ao longo da luta.`,
                ["monstro", "donzela", "gorgone", "pantano", "veneno", "nv7"]
            ),
            new EntradaCodice(
                22,
                "Górgone do Olhar Cinzento [Nv. 8 - Elite]",
                "MONSTRO",
                "Matrona serpentina cujo relance petrifica as articulações do combatente.",
                `Górgone que completou a metamorfose do olhar mineral. Seu cabelo é formado por serpentes ativas que sibilam avisos em todas as direções, impedindo qualquer tentativa de flanqueamento fácil.

Ao fixar seu olhar cinzento no oponente, causa calcificação imediata nas extremidades musculares: o herói sente o peso do ferro em suas pernas, dificultando a esquiva e elevando o custo de suas manobras.`,
                ["monstro", "gorgone", "cinzento", "elite", "pantano", "nv8"]
            ),
            new EntradaCodice(
                23,
                "Matriarca Górgone [Nv. 9 - Rainha do Pântano]",
                "MONSTRO",
                "Soberana do templo submerso: cauda blindada, lâminas duplas e olhar supremo de pedra.",
                `A Rainha indiscutível do Pântano Petrificante. Medindo mais de quatro metros quando erguida sobre sua cauda escamada, comanda as serpentes das lagoas e empunha cimitarras gêmeas banhadas em veneno negro.

Sua presença de batalha é asfixiante: alterna cortes circulares de cimitarra, pancadas destrutivas com a cauda e feixes de energia petrificante emitidos pelos seus olhos dourados. Seus restos guardam a cobiçada Escama Petrificada da Rainha.`,
                ["monstro", "matriarca", "rainha", "chefe", "pantano", "gorgone", "nv9"]
            ),

            // --- COLINAS DA LUA DE SANGUE ---
            new EntradaCodice(
                24,
                "Espreitador da Noite [Nv. 8]",
                "MONSTRO",
                "Lobo bípede esguio com sentidos predatórios apurados sob o brilho lunar.",
                `Predador que caça nas bordas dos penhascos íngremes. Possui pelagem escura como piche que se mescla perfeitamente com a noite das colinas.

Embora possua menor armadura que os brutos de cinzas, compensa com reflexos inacreditáveis: esquiva-se de investidas mal calculadas e ataca os flancos do herói com mordidas profundas que provocam sangramento acelerado.`,
                ["monstro", "espreitador", "lobo", "colinas", "sangue", "nv8"]
            ),
            new EntradaCodice(
                25,
                "Fera Carmesim [Nv. 9 - Elite]",
                "MONSTRO",
                "Monstruosidade lupina em permanente estado de frenesi de sangue.",
                `Um licantropo cujo sistema circulatório foi completamente saturado pela luz da lua fraturada. Seus músculos rompem a própria pele nas costas, emanando calor e vapor carmesim.

Quanto mais a batalha avança e mais sangue é derramado, mais veloz e letal ela se torna. Seus uivos de combate aumentam a taxa crítica de seus golpes, tornando escudos e defesas ativas ferramentas cruciais para sobreviver.`,
                ["monstro", "fera", "carmesim", "lobisomem", "elite", "colinas", "nv9"]
            ),
            new EntradaCodice(
                26,
                "Alfa Albino de Vaslen [Nv. 10 - Chefe das Colinas]",
                "MONSTRO",
                "O predador ápice das montanhas nevadas; pelagem prateada, garras de ferro e uivo paralisante.",
                `Lenda viva temida por todos os viajantes de Vaslen. Com pelo branco como a neve eterna dos cumes e olhos de fogo rubro, o Alfa Albino é o patriarca supremo de todas as matilhas licantropas.

Não luta como uma fera cega: possui astúcia predatória assustadora. Seu uivo ecoa pela montanha gelando a espinha do campeão e drenando metade de sua energia de reação, seguido por saltos vertiginosos que despedaçam couraças pesadas. O Coração Gélido do Alfa é uma das relíquias mais poderosas de Vaslen.`,
                ["monstro", "alfa", "albino", "chefe", "colinas", "lobisomem", "nv10"]
            ),

            // --- LIMBO ESPECTRAL ---
            new EntradaCodice(
                27,
                "Gotoku das Chamas [Nv. 9]",
                "MONSTRO",
                "Espírito do fogo azul que rouba o calor corpóreo e consome reservas de mana.",
                `Manifestação elemental nascida das cinzas dos mosteiros destruídos. Apresenta-se como um vaso ritual cerâmico flutuante cercado por línguas de chama cerúlea.

Não desfere ataques físicos diretos: arremessa projéteis de fogo espectral que ignoram armaduras de placas metálicas e evaporam as reservas de energia mágica e estamina de combate do oponente.`,
                ["monstro", "gotoku", "fogo", "limbo", "espectro", "nv9"]
            ),
            new EntradaCodice(
                28,
                "Yurei das Águas Mortas [Nv. 10 - Elite]",
                "MONSTRO",
                "Aparição feminina translúcida cujos movimentos flutuantes desafiam a gravidade e a sanidade.",
                `Espírito atormentado de donzelas que pereceram afogadas quando as represas do reino romperam durante a Fratura. Flutua no vácuo com vestes brancas desgarradas e longos cabelos pretos que ocultam sua face decomposta.

Seus lamentos fúnebres produzem ondas de choque psíquicas no ar. É capaz de desmaterializar-se parcialmente no exato instante de um golpe, forçando o caçador a calcular seus ataques com paciência mística.`,
                ["monstro", "yurei", "fantasma", "limbo", "elite", "nv10"]
            ),
            new EntradaCodice(
                29,
                "Onryo do Rancor Eterno [Nv. 11 - Chefe do Limbo]",
                "MONSTRO",
                "Entidade vingativa primordial com garras etéreas e gritos capazes de rachar a alma.",
                `A soma de todo o rancor e desespero acumulado pelas vítimas inocentes da Grande Fratura. Uma aparição monumental coroada de fogo espectral e lamentos dissonantes.

Comanda as leis do vácuo no Limbo: desfere rajadas de energia cósmica, invoca garras do solo que prendem os pés do herói e desfere ataques brutais com garras etéreas que sangram a vitalidade máxima. Sua Essência do Rancor Primordial sintetiza o pico da alquimia mística.`,
                ["monstro", "onryo", "rancor", "chefe", "limbo", "espectro", "nv11"]
            ),

            // --- PINÁCULO DO ECLIPSE ---
            new EntradaCodice(
                30,
                "Karasu-Tengu da Névoa [Nv. 10 - Elite]",
                "MONSTRO",
                "Guerreiro alado dos céus corrompidos armado com nodachi veloz e domínio das correntes de vento.",
                `Guardião ancestral dos portões celestiais do Santuário. Possui asas emplumadas de corvo negro e corpo de mestre samurai, empunhando uma lendária nodachi de dois metros com uma única mão.

Desce dos céus em mergulhos rasantes que cortam o ar com silvo ensurdecedor. Seus ataques combinam dano de vento com penetração laminar cirúrgica, exigindo leitura precisa de tempo de guarda.`,
                ["monstro", "tengu", "karasu", "pinaculo", "eclipse", "nodachi", "nv10"]
            ),
            new EntradaCodice(
                31,
                "Yamabushi dos Picos [Nv. 11 - Elite]",
                "MONSTRO",
                "Asceta divino corrompido que domina feitiços celestiais e ventos mortais.",
                `Um monge eremita que buscava a iluminação no topo do mundo quando a Fratura ocorreu. Sua mente ascendeu, mas seu espírito fundiu-se à entropia do eclipse.

Comanda as correntes térmicas dos picos nevados e canaliza mantras budistas corrompidos que emitem explosões de luz e trevas combinadas. Possui alta defesa mágica e postura de combate quase inabalável.`,
                ["monstro", "yamabushi", "monge", "pinaculo", "eclipse", "elite", "nv11"]
            ),
            new EntradaCodice(
                32,
                "Kitsune dos Nove Ecos [Nv. 12 - Chefe Supremo de Vaslen]",
                "MONSTRO",
                "A Soberana imortal de Vaslen: dona das nove caudas flamejantes, das ilusões cósmicas e do eclipse.",
                `A guardiã primordial de todo o reino de Vaslen antes do mundo ser quebrado. Uma divindade raposa que absorveu em suas nove caudas o poder do Núcleo Cósmico colapsado. 

Ostenta quimono cerimonial banhado em chamas solares e empunha espelhos astrais que duplicam seus movimentos e distorcem a percepção do desafiante. No combate final de Vaslen, a Kitsune testa se o herói possui a coragem, sabedoria marcial e temperança necessárias para transcender o ciclo da Fratura.

Seus ataques variam entre feitiços devastadores de fogo cósmico, cortes velozes com lâminas de ilusão e posturas defensivas onde chamas espirituais reabastecem continuamente sua força divina.`,
                ["monstro", "kitsune", "soberana", "nove_caudas", "chefe_final", "pinaculo", "eclipse", "nv12"]
            ),

            // =================================================================
            // 4. ALQUIMIA, RELÍQUIAS E CONSUMÍVEIS (SISTEMA DE ITENS)
            // =================================================================
            new EntradaCodice(
                33,
                "Tratado de Alquimia de Vaslen: Óleos, Elixires e Poções",
                "RELÍQUIA",
                "Os fundamentos herméticos que regem a fabricação de consumíveis vitais para a sobrevivência.",
                `Na terra de Vaslen, nenhum caçador sobrevive confiando apenas em sua lâmina ou feitiço. A alquimia ancestral divide os compostos de caçada em quatro ramificações vitais:

1. Poções de Vitalidade (❤️): Destilados biológicos que fecham tecidos rompidos, estancam hemorragias e regeneram a integridade dos órgãos vitais durante o calor da batalha.
2. Elixires de Energia (⚡): Compostos voláteis ricos em éter mineral que restauram instantaneamente o fôlego, a velocidade de sinapse e a reserva de mana para novas manobras.
3. Óleos de Lâmina e Forja (🗡️): Resinas e gorduras animais concentradas que, quando aplicadas no fio do aço ou na ponta da equipe mágica, concedem um bônus devastador de dano plano no golpe seguinte.
4. Relíquias e Itens Compostos (✨): Artefatos celestiais e essências primordiais que operam cura simultânea de Vida e Energia através de polimorfismo alquímico sagrado.`,
                ["alquimia", "pocoes", "elixires", "oleos", "reliquia", "sistema"]
            ),
            new EntradaCodice(
                34,
                "Espólios das Criptas: Medulas e Cinzas Cadavéricas",
                "RELÍQUIA",
                "O poder catalisador retido nas ossadas e cinzas dos mortos-vivos.",
                `Mesmo após a decomposição completa da carne, os ossos dos guerreiros das Criptas permanecem impregnados pelo fluxo de éter da Fratura:

• Medula de Esqueleto Antigo: Substância gelatinosa cinzenta encontrada no interior de fêmures seculares. Quando ingerida ou aplicada sobre cortes profundos, cauteriza feridas restaurando +35 de Vida.
• Pó de Ossos Reanimados: Farinha mineral triturada com propriedades tônicas imediatas, reabastecendo +40 de Energia para o guerreiro cansado.
• Cinzas de Foco Espectral: Pó translúcido colhido das aljavas dos arqueiros esqueléticos. Ao untar a lâmina ou ponta da flecha, imbui o próximo golpe com +10 de dano direto.`,
                ["criptas", "medula", "po_de_ossos", "cinzas", "cura", "reliquia"]
            ),
            new EntradaCodice(
                35,
                "Seivas e Alquimia Tribal dos Bosques",
                "RELÍQUIA",
                "Os segredos medicinais e extratos venenosos das tribos sátiros.",
                `As árvores carnívoras e os xamãs do Bosque Sombrio desenvolveram unguentos rústicos de extrema eficácia marcial:

• Seiva Negra do Bosque: Coagulante natural espesso que regenera +50 de Vida contra cortes hemorrágicos.
• Orvalho de Miasma Tribal: Líquido aromático inalado durante transes ritualísticos para restaurar +50 de Energia sem causar torpor muscular.
• Unguento de Fúria Carniceira: Gordura animal densa extraída do Lorde Carniceiro; confere impacto bruto devastador, concedendo +12 de dano no golpe seguinte do caçador.`,
                ["bosque", "seiva", "orvalho", "unguento", "satiro", "reliquia"]
            ),
            new EntradaCodice(
                36,
                "Espólios Táuricos e Óleos de Forja Vulcânica",
                "RELÍQUIA",
                "Nutrientes hiperdensos e combustíveis minerais colhidos nos minotauros do Labirinto.",
                `O calor das forjas vulcânicas do Labirinto de Cinzas permitiu a síntese de compostos de alta resistência calórica:

• Carne Seca Táurica: Tiras de carne preservadas em salitre de cinzas. Densas e nutritivas, curam +70 de Vida em poucos segundos.
• Óleo da Forja Vulcânica: Hidrocarboneto mineral que entra em ignição em contato com o ar ao ser espalhado em lâminas, concedendo +14 de dano brutal no próximo golpe.
• Bálsamo do Coração de Touro: Item Composto nobre sintetizado das glândulas do General Táurico. Restaura simultaneamente +45 de Vida e +45 de Energia com grande equilíbrio.`,
                ["labirinto", "cinzas", "minotauro", "oleo_forja", "carne_seca", "balsamo", "reliquia"]
            ),
            new EntradaCodice(
                37,
                "Venenos e Lágrimas das Górgones",
                "RELÍQUIA",
                "Secreções oftálmicas e ácidos serpentinos colhidos no Pântano Petrificante.",
                `As propriedades minerais do veneno das górgones operam tanto como dissolventes de metal quanto como catalisadores de agilidade:

• Veneno de Presa Serpentina: Ácido límpido que corrói couraças inimigas, adicionando +14 de dano fulminante no próximo ataque do caçador.
• Lágrima Cristalizada de Medusa: Secreção cristalina expelida pelas górgones ao serem derrotadas; limpa os canais de estamina restaurando +65 de Energia.
• Escama Petrificada da Rainha: Placa dérmica impenetrável que armazena a essência da Matriarca, proporcionando regeneração massiva de +90 de Vida.`,
                ["pantano", "veneno", "lagrima", "escama", "medusa", "gorgone", "reliquia"]
            ),
            new EntradaCodice(
                38,
                "Garras e Corações Licantropos",
                "RELÍQUIA",
                "Extratos hormonais e núcleos anatômicos colhidos dos lobisomens das Colinas.",
                `A biologia dos licantropos da Lua de Sangue opera em taxa metabólica sobrenatural:

• Presa do Caçador Noturno: Estimulante adrenérgico que agiliza os reflexos e restaura +75 de Energia no auge da fadiga.
• Óleo de Garra de Fera: Secreção viscosa e rica em ferro que afia gumes de espadas e katanas, garantindo +16 de dano perfurante.
• Coração Gélido do Alfa: O lendário núcleo do Alfa Albino. Pulsa com frio glacial e poder vital bruto, recuperando +65 de Vida e +65 de Energia em comunhão mística.`,
                ["colinas", "lobisomem", "coracao_alfa", "oleo_garra", "presa", "reliquia"]
            ),
            new EntradaCodice(
                39,
                "Ectoplasmas e Relíquias do Limbo Espectral",
                "RELÍQUIA",
                "Substâncias de matéria intangível colhidas das aparições e do rancor.",
                `Materiais que desafiam as leis da química física e operam na interface das almas:

• Centelha de Fogo-Fátuo: Chama azul engarrafada que queima sem fumaça, restaurando +90 de Energia para o lançador de magias ou espadachim veloz.
• Lamento Ectoplasmático: Resíduo translúcido das Yureis que alivia dores profundas na alma, devolvendo +115 de Vida.
• Essência do Rancor Primordial: Destilado de rancor purificado obtido ao banir o Onryo. Um elixir composto supremo que regenera +85 de Vida e +85 de Energia.`,
                ["limbo", "fogo_fatuo", "lamento", "rancor", "espectro", "reliquia"]
            ),
            new EntradaCodice(
                40,
                "Artefatos Celestiais do Pináculo do Eclipse",
                "RELÍQUIA",
                "As relíquias divinas máximas guardadas pelos mestres do Santuário Solar.",
                `No pico do mundo de Vaslen repousam as três relíquias sagradas definitivas:

• Pena Cortante de Tengu: Pluma de aço negro do mestre alado que confere precisão cirúrgica definitiva: adiciona +16 de dano devastador ao próximo golpe.
• Incenso do Asceta Caído: Ervas sagradas do Yamabushi que purificam todo cansaço mundano, restaurando +140 de Vida pura.
• Orbe dos Nove Ecos da Kitsune: A relíquia máxima de Vaslen. Uma esfera de fogo cósmico e éter primordial que restaura integralmente +120 de Vida e +120 de Energia, tornando o herói um semideus sobre a terra.`,
                ["pinaculo", "eclipse", "tengu", "kitsune", "orbe", "reliquia_maxima"]
            )
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
