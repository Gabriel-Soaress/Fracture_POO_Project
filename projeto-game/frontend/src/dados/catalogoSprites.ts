// ARQUIVO GERADO AUTOMATICAMENTE por scratch/gerar_sprites.cjs a partir de sprites2d_personagens.
// Frames medidos diretamente da largura de cada PNG (128px por frame).

export interface AnimacaoSprite {
  src: string;
  frames: number;
  ms: number;
  frameInicial?: number;
}

export interface SpritesCombatente {
  idle: AnimacaoSprite;
  hurt: AnimacaoSprite;
  dead: AnimacaoSprite;
  a1: AnimacaoSprite;
  a2: AnimacaoSprite;
  a3: AnimacaoSprite;
  esp?: AnimacaoSprite;
  def?: AnimacaoSprite;
}

export const SPRITES_MONSTROS: Record<number, SpritesCombatente & { pasta: string }> = {
  "1": {
    "pasta": "squeleto/Skeleton_Warrior",
    "idle": {
      "src": "/sprites/monstros/esqueleto_guerreiro/Idle.png",
      "frames": 7,
      "ms": 910
    },
    "hurt": {
      "src": "/sprites/monstros/esqueleto_guerreiro/Hurt.png",
      "frames": 2,
      "ms": 280
    },
    "dead": {
      "src": "/sprites/monstros/esqueleto_guerreiro/Dead.png",
      "frames": 4,
      "ms": 600
    },
    "a1": {
      "src": "/sprites/monstros/esqueleto_guerreiro/Attack_1.png",
      "frames": 5,
      "ms": 500
    },
    "a2": {
      "src": "/sprites/monstros/esqueleto_guerreiro/Attack_2.png",
      "frames": 6,
      "ms": 660
    },
    "a3": {
      "src": "/sprites/monstros/esqueleto_guerreiro/Attack_3.png",
      "frames": 4,
      "ms": 420
    },
    "esp": {
      "src": "/sprites/monstros/esqueleto_guerreiro/Run%2Battack.png",
      "frames": 7,
      "ms": 735
    },
    "def": {
      "src": "/sprites/monstros/esqueleto_guerreiro/Protect.png",
      "frames": 1,
      "ms": 120
    }
  },
  "2": {
    "pasta": "squeleto/Skeleton_Spearman",
    "idle": {
      "src": "/sprites/monstros/esqueleto_lanceiro/Idle.png",
      "frames": 7,
      "ms": 910
    },
    "hurt": {
      "src": "/sprites/monstros/esqueleto_lanceiro/Hurt.png",
      "frames": 3,
      "ms": 420
    },
    "dead": {
      "src": "/sprites/monstros/esqueleto_lanceiro/Dead.png",
      "frames": 5,
      "ms": 750
    },
    "a1": {
      "src": "/sprites/monstros/esqueleto_lanceiro/Attack_1.png",
      "frames": 4,
      "ms": 400
    },
    "a2": {
      "src": "/sprites/monstros/esqueleto_lanceiro/Attack_2.png",
      "frames": 4,
      "ms": 440
    },
    "a3": {
      "src": "/sprites/monstros/esqueleto_lanceiro/Run%2Battack.png",
      "frames": 5,
      "ms": 525
    },
    "esp": {
      "src": "/sprites/monstros/esqueleto_lanceiro/Fall.png",
      "frames": 6,
      "ms": 630
    },
    "def": {
      "src": "/sprites/monstros/esqueleto_lanceiro/Protect.png",
      "frames": 2,
      "ms": 240
    }
  },
  "3": {
    "pasta": "squeleto/Skeleton_Archer",
    "idle": {
      "src": "/sprites/monstros/esqueleto_arqueiro/Idle.png",
      "frames": 7,
      "ms": 910
    },
    "hurt": {
      "src": "/sprites/monstros/esqueleto_arqueiro/Hurt.png",
      "frames": 2,
      "ms": 280
    },
    "dead": {
      "src": "/sprites/monstros/esqueleto_arqueiro/Dead.png",
      "frames": 5,
      "ms": 750
    },
    "a1": {
      "src": "/sprites/monstros/esqueleto_arqueiro/Attack_1.png",
      "frames": 5,
      "ms": 500
    },
    "a2": {
      "src": "/sprites/monstros/esqueleto_arqueiro/Attack_3.png",
      "frames": 3,
      "ms": 330
    },
    "a3": {
      "src": "/sprites/monstros/esqueleto_arqueiro/Shot_1.png",
      "frames": 15,
      "ms": 1575
    },
    "esp": {
      "src": "/sprites/monstros/esqueleto_arqueiro/Shot_2.png",
      "frames": 15,
      "ms": 1575
    },
    "def": {
      "src": "/sprites/monstros/esqueleto_arqueiro/Evasion.png",
      "frames": 6,
      "ms": 720
    }
  },
  "4": {
    "pasta": "cabra_fraco/Satyr_1",
    "idle": {
      "src": "/sprites/monstros/satiro_degolador/Idle.png",
      "frames": 7,
      "ms": 910
    },
    "hurt": {
      "src": "/sprites/monstros/satiro_degolador/Hurt.png",
      "frames": 4,
      "ms": 560
    },
    "dead": {
      "src": "/sprites/monstros/satiro_degolador/Dead.png",
      "frames": 4,
      "ms": 600
    },
    "a1": {
      "src": "/sprites/monstros/satiro_degolador/Attack.png",
      "frames": 4,
      "ms": 380
    },
    "a2": {
      "src": "/sprites/monstros/satiro_degolador/Charge.png",
      "frames": 5,
      "ms": 500
    },
    "a3": {
      "src": "/sprites/monstros/satiro_degolador/Charge.png",
      "frames": 6,
      "ms": 600,
      "frameInicial": 4
    },
    "esp": {
      "src": "/sprites/monstros/satiro_degolador/Charge.png",
      "frames": 10,
      "ms": 900
    },
    "def": {
      "src": "/sprites/monstros/satiro_degolador/Walk.png",
      "frames": 4,
      "ms": 480
    }
  },
  "5": {
    "pasta": "cabra_fraco/Satyr_2",
    "idle": {
      "src": "/sprites/monstros/satiro_xama/Idle.png",
      "frames": 7,
      "ms": 910
    },
    "hurt": {
      "src": "/sprites/monstros/satiro_xama/Hurt.png",
      "frames": 4,
      "ms": 560
    },
    "dead": {
      "src": "/sprites/monstros/satiro_xama/Dead.png",
      "frames": 4,
      "ms": 600
    },
    "a1": {
      "src": "/sprites/monstros/satiro_xama/Attack.png",
      "frames": 4,
      "ms": 380
    },
    "a2": {
      "src": "/sprites/monstros/satiro_xama/Attack.png",
      "frames": 4,
      "ms": 420,
      "frameInicial": 4
    },
    "a3": {
      "src": "/sprites/monstros/satiro_xama/Charge.png",
      "frames": 8,
      "ms": 760
    },
    "esp": {
      "src": "/sprites/monstros/satiro_xama/Attack.png",
      "frames": 8,
      "ms": 760
    },
    "def": {
      "src": "/sprites/monstros/satiro_xama/Walk.png",
      "frames": 4,
      "ms": 480
    }
  },
  "6": {
    "pasta": "cabra_fraco/Satyr_3",
    "idle": {
      "src": "/sprites/monstros/satiro_lorde/Idle.png",
      "frames": 6,
      "ms": 780
    },
    "hurt": {
      "src": "/sprites/monstros/satiro_lorde/Hurt.png",
      "frames": 4,
      "ms": 560
    },
    "dead": {
      "src": "/sprites/monstros/satiro_lorde/Dead.png",
      "frames": 4,
      "ms": 600
    },
    "a1": {
      "src": "/sprites/monstros/satiro_lorde/Attack.png",
      "frames": 4,
      "ms": 380
    },
    "a2": {
      "src": "/sprites/monstros/satiro_lorde/Attack.png",
      "frames": 5,
      "ms": 525,
      "frameInicial": 4
    },
    "a3": {
      "src": "/sprites/monstros/satiro_lorde/Attack.png",
      "frames": 9,
      "ms": 855
    },
    "esp": {
      "src": "/sprites/monstros/satiro_lorde/Walk.png",
      "frames": 8,
      "ms": 680
    },
    "def": {
      "src": "/sprites/monstros/satiro_lorde/Idle.png",
      "frames": 6,
      "ms": 720
    }
  },
  "7": {
    "pasta": "minotauro_fraco/Minotaur_1",
    "idle": {
      "src": "/sprites/monstros/minotauro_bruto/Idle.png",
      "frames": 10,
      "ms": 1300
    },
    "hurt": {
      "src": "/sprites/monstros/minotauro_bruto/Hurt.png",
      "frames": 3,
      "ms": 420
    },
    "dead": {
      "src": "/sprites/monstros/minotauro_bruto/Dead.png",
      "frames": 5,
      "ms": 750
    },
    "a1": {
      "src": "/sprites/monstros/minotauro_bruto/Attack.png",
      "frames": 3,
      "ms": 270,
      "frameInicial": 1
    },
    "a2": {
      "src": "/sprites/monstros/minotauro_bruto/Attack.png",
      "frames": 5,
      "ms": 550
    },
    "a3": {
      "src": "/sprites/monstros/minotauro_bruto/Walk.png",
      "frames": 7,
      "ms": 595
    },
    "esp": {
      "src": "/sprites/monstros/minotauro_bruto/Attack.png",
      "frames": 5,
      "ms": 625
    },
    "def": {
      "src": "/sprites/monstros/minotauro_bruto/Idle.png",
      "frames": 4,
      "ms": 480
    }
  },
  "8": {
    "pasta": "minotauro_fraco/Minotaur_2",
    "idle": {
      "src": "/sprites/monstros/minotauro_rompedor/Idle.png",
      "frames": 10,
      "ms": 1300
    },
    "hurt": {
      "src": "/sprites/monstros/minotauro_rompedor/Hurt.png",
      "frames": 3,
      "ms": 420
    },
    "dead": {
      "src": "/sprites/monstros/minotauro_rompedor/Dead.png",
      "frames": 5,
      "ms": 750
    },
    "a1": {
      "src": "/sprites/monstros/minotauro_rompedor/Attack.png",
      "frames": 3,
      "ms": 270,
      "frameInicial": 1
    },
    "a2": {
      "src": "/sprites/monstros/minotauro_rompedor/Attack.png",
      "frames": 5,
      "ms": 550
    },
    "a3": {
      "src": "/sprites/monstros/minotauro_rompedor/Walk.png",
      "frames": 7,
      "ms": 595
    },
    "esp": {
      "src": "/sprites/monstros/minotauro_rompedor/Attack.png",
      "frames": 5,
      "ms": 625
    },
    "def": {
      "src": "/sprites/monstros/minotauro_rompedor/Idle.png",
      "frames": 4,
      "ms": 480
    }
  },
  "9": {
    "pasta": "minotauro_fraco/Minotaur_3",
    "idle": {
      "src": "/sprites/monstros/minotauro_general/Idle.png",
      "frames": 10,
      "ms": 1300
    },
    "hurt": {
      "src": "/sprites/monstros/minotauro_general/Hurt.png",
      "frames": 3,
      "ms": 420
    },
    "dead": {
      "src": "/sprites/monstros/minotauro_general/Dead.png",
      "frames": 5,
      "ms": 750
    },
    "a1": {
      "src": "/sprites/monstros/minotauro_general/Attack.png",
      "frames": 2,
      "ms": 210
    },
    "a2": {
      "src": "/sprites/monstros/minotauro_general/Attack.png",
      "frames": 3,
      "ms": 330,
      "frameInicial": 1
    },
    "a3": {
      "src": "/sprites/monstros/minotauro_general/Walk.png",
      "frames": 7,
      "ms": 595
    },
    "esp": {
      "src": "/sprites/monstros/minotauro_general/Attack.png",
      "frames": 4,
      "ms": 500
    },
    "def": {
      "src": "/sprites/monstros/minotauro_general/Idle.png",
      "frames": 4,
      "ms": 480
    }
  },
  "10": {
    "pasta": "medusa/Gorgon_1",
    "idle": {
      "src": "/sprites/monstros/gorgone_donzela/Idle.png",
      "frames": 7,
      "ms": 910
    },
    "hurt": {
      "src": "/sprites/monstros/gorgone_donzela/Hurt.png",
      "frames": 3,
      "ms": 420
    },
    "dead": {
      "src": "/sprites/monstros/gorgone_donzela/Dead.png",
      "frames": 3,
      "ms": 450
    },
    "a1": {
      "src": "/sprites/monstros/gorgone_donzela/Attack_2.png",
      "frames": 7,
      "ms": 700
    },
    "a2": {
      "src": "/sprites/monstros/gorgone_donzela/Attack_3.png",
      "frames": 10,
      "ms": 1100
    },
    "a3": {
      "src": "/sprites/monstros/gorgone_donzela/Attack_1.png",
      "frames": 16,
      "ms": 1680
    },
    "esp": {
      "src": "/sprites/monstros/gorgone_donzela/Special.png",
      "frames": 5,
      "ms": 525
    },
    "def": {
      "src": "/sprites/monstros/gorgone_donzela/Idle_2.png",
      "frames": 5,
      "ms": 600
    }
  },
  "11": {
    "pasta": "medusa/Gorgon_2",
    "idle": {
      "src": "/sprites/monstros/gorgone_olhar/Idle.png",
      "frames": 7,
      "ms": 910
    },
    "hurt": {
      "src": "/sprites/monstros/gorgone_olhar/Hurt.png",
      "frames": 3,
      "ms": 420
    },
    "dead": {
      "src": "/sprites/monstros/gorgone_olhar/Dead.png",
      "frames": 3,
      "ms": 450
    },
    "a1": {
      "src": "/sprites/monstros/gorgone_olhar/Attack_2.png",
      "frames": 7,
      "ms": 700
    },
    "a2": {
      "src": "/sprites/monstros/gorgone_olhar/Attack_3.png",
      "frames": 10,
      "ms": 1100
    },
    "a3": {
      "src": "/sprites/monstros/gorgone_olhar/Attack_1.png",
      "frames": 16,
      "ms": 1680
    },
    "esp": {
      "src": "/sprites/monstros/gorgone_olhar/Special.png",
      "frames": 5,
      "ms": 525
    },
    "def": {
      "src": "/sprites/monstros/gorgone_olhar/Idle_2.png",
      "frames": 5,
      "ms": 600
    }
  },
  "12": {
    "pasta": "medusa/Gorgon_3",
    "idle": {
      "src": "/sprites/monstros/gorgone_matriarca/Idle.png",
      "frames": 7,
      "ms": 910
    },
    "hurt": {
      "src": "/sprites/monstros/gorgone_matriarca/Hurt.png",
      "frames": 3,
      "ms": 420
    },
    "dead": {
      "src": "/sprites/monstros/gorgone_matriarca/Dead.png",
      "frames": 3,
      "ms": 450
    },
    "a1": {
      "src": "/sprites/monstros/gorgone_matriarca/Attack_3.png",
      "frames": 7,
      "ms": 700
    },
    "a2": {
      "src": "/sprites/monstros/gorgone_matriarca/Attack_2.png",
      "frames": 10,
      "ms": 1100
    },
    "a3": {
      "src": "/sprites/monstros/gorgone_matriarca/Attack_1.png",
      "frames": 16,
      "ms": 1680
    },
    "esp": {
      "src": "/sprites/monstros/gorgone_matriarca/Special.png",
      "frames": 5,
      "ms": 525
    },
    "def": {
      "src": "/sprites/monstros/gorgone_matriarca/Idle_2.png",
      "frames": 5,
      "ms": 600
    }
  },
  "13": {
    "pasta": "lobisomen/Black_Werewolf",
    "idle": {
      "src": "/sprites/monstros/lobisomem_negro/Idle.png",
      "frames": 8,
      "ms": 1040
    },
    "hurt": {
      "src": "/sprites/monstros/lobisomem_negro/Hurt.png",
      "frames": 2,
      "ms": 280
    },
    "dead": {
      "src": "/sprites/monstros/lobisomem_negro/Dead.png",
      "frames": 2,
      "ms": 300
    },
    "a1": {
      "src": "/sprites/monstros/lobisomem_negro/Attack_2.png",
      "frames": 4,
      "ms": 400
    },
    "a2": {
      "src": "/sprites/monstros/lobisomem_negro/Attack_1.png",
      "frames": 6,
      "ms": 660
    },
    "a3": {
      "src": "/sprites/monstros/lobisomem_negro/Attack_3.png",
      "frames": 5,
      "ms": 525
    },
    "esp": {
      "src": "/sprites/monstros/lobisomem_negro/Run%2BAttack.png",
      "frames": 7,
      "ms": 735
    },
    "def": {
      "src": "/sprites/monstros/lobisomem_negro/Jump.png",
      "frames": 11,
      "ms": 1320
    }
  },
  "14": {
    "pasta": "lobisomen/Red_Werewolf",
    "idle": {
      "src": "/sprites/monstros/lobisomem_carmesim/Idle.png",
      "frames": 8,
      "ms": 1040
    },
    "hurt": {
      "src": "/sprites/monstros/lobisomem_carmesim/Hurt.png",
      "frames": 2,
      "ms": 280
    },
    "dead": {
      "src": "/sprites/monstros/lobisomem_carmesim/Dead.png",
      "frames": 2,
      "ms": 300
    },
    "a1": {
      "src": "/sprites/monstros/lobisomem_carmesim/Attack_2.png",
      "frames": 4,
      "ms": 400
    },
    "a2": {
      "src": "/sprites/monstros/lobisomem_carmesim/Attack_1.png",
      "frames": 6,
      "ms": 660
    },
    "a3": {
      "src": "/sprites/monstros/lobisomem_carmesim/Attack_3.png",
      "frames": 5,
      "ms": 525
    },
    "esp": {
      "src": "/sprites/monstros/lobisomem_carmesim/Run%2BAttack.png",
      "frames": 7,
      "ms": 735
    },
    "def": {
      "src": "/sprites/monstros/lobisomem_carmesim/Jump.png",
      "frames": 11,
      "ms": 1320
    }
  },
  "15": {
    "pasta": "lobisomen/White_Werewolf",
    "idle": {
      "src": "/sprites/monstros/lobisomem_albino/Idle.png",
      "frames": 8,
      "ms": 1040
    },
    "hurt": {
      "src": "/sprites/monstros/lobisomem_albino/Hurt.png",
      "frames": 2,
      "ms": 280
    },
    "dead": {
      "src": "/sprites/monstros/lobisomem_albino/Dead.png",
      "frames": 2,
      "ms": 300
    },
    "a1": {
      "src": "/sprites/monstros/lobisomem_albino/Attack_2.png",
      "frames": 4,
      "ms": 400
    },
    "a2": {
      "src": "/sprites/monstros/lobisomem_albino/Attack_1.png",
      "frames": 6,
      "ms": 660
    },
    "a3": {
      "src": "/sprites/monstros/lobisomem_albino/Attack_3.png",
      "frames": 5,
      "ms": 525
    },
    "esp": {
      "src": "/sprites/monstros/lobisomem_albino/Run%2BAttack.png",
      "frames": 7,
      "ms": 735
    },
    "def": {
      "src": "/sprites/monstros/lobisomem_albino/Jump.png",
      "frames": 11,
      "ms": 1320
    }
  },
  "16": {
    "pasta": "monstro1_3_yonkay/Gotoku",
    "idle": {
      "src": "/sprites/monstros/yokai_gotoku/Idle.png",
      "frames": 5,
      "ms": 650
    },
    "hurt": {
      "src": "/sprites/monstros/yokai_gotoku/Hurt.png",
      "frames": 3,
      "ms": 420
    },
    "dead": {
      "src": "/sprites/monstros/yokai_gotoku/Dead.png",
      "frames": 5,
      "ms": 750
    },
    "a1": {
      "src": "/sprites/monstros/yokai_gotoku/Attack_1.png",
      "frames": 4,
      "ms": 400
    },
    "a2": {
      "src": "/sprites/monstros/yokai_gotoku/Attack_2.png",
      "frames": 4,
      "ms": 440
    },
    "a3": {
      "src": "/sprites/monstros/yokai_gotoku/Attack_3.png",
      "frames": 4,
      "ms": 420
    },
    "esp": {
      "src": "/sprites/monstros/yokai_gotoku/Scream.png",
      "frames": 4,
      "ms": 420
    },
    "def": {
      "src": "/sprites/monstros/yokai_gotoku/Jump.png",
      "frames": 8,
      "ms": 960
    }
  },
  "17": {
    "pasta": "monstro1_3_yonkay/Yurei",
    "idle": {
      "src": "/sprites/monstros/yokai_yurei/Idle.png",
      "frames": 5,
      "ms": 650
    },
    "hurt": {
      "src": "/sprites/monstros/yokai_yurei/Hurt.png",
      "frames": 3,
      "ms": 420
    },
    "dead": {
      "src": "/sprites/monstros/yokai_yurei/Dead.png",
      "frames": 4,
      "ms": 600
    },
    "a1": {
      "src": "/sprites/monstros/yokai_yurei/Attack_1.png",
      "frames": 4,
      "ms": 400
    },
    "a2": {
      "src": "/sprites/monstros/yokai_yurei/Attack_2.png",
      "frames": 4,
      "ms": 440
    },
    "a3": {
      "src": "/sprites/monstros/yokai_yurei/Attack_3.png",
      "frames": 7,
      "ms": 735
    },
    "esp": {
      "src": "/sprites/monstros/yokai_yurei/Attack_4.png",
      "frames": 7,
      "ms": 735
    },
    "def": {
      "src": "/sprites/monstros/yokai_yurei/Scream.png",
      "frames": 4,
      "ms": 480
    }
  },
  "18": {
    "pasta": "monstro1_3_yonkay/Onre",
    "idle": {
      "src": "/sprites/monstros/yokai_onryo/Idle.png",
      "frames": 6,
      "ms": 780
    },
    "hurt": {
      "src": "/sprites/monstros/yokai_onryo/Hurt.png",
      "frames": 3,
      "ms": 420
    },
    "dead": {
      "src": "/sprites/monstros/yokai_onryo/Dead.png",
      "frames": 6,
      "ms": 900
    },
    "a1": {
      "src": "/sprites/monstros/yokai_onryo/Attack_1.png",
      "frames": 5,
      "ms": 500
    },
    "a2": {
      "src": "/sprites/monstros/yokai_onryo/Attack_2.png",
      "frames": 4,
      "ms": 440
    },
    "a3": {
      "src": "/sprites/monstros/yokai_onryo/Attack_3.png",
      "frames": 4,
      "ms": 420
    },
    "esp": {
      "src": "/sprites/monstros/yokai_onryo/Scream.png",
      "frames": 7,
      "ms": 735
    },
    "def": {
      "src": "/sprites/monstros/yokai_onryo/Flight.png",
      "frames": 6,
      "ms": 720
    }
  },
  "19": {
    "pasta": "demon/Karasu_tengu",
    "idle": {
      "src": "/sprites/monstros/tengu_karasu/Idle.png",
      "frames": 6,
      "ms": 780
    },
    "hurt": {
      "src": "/sprites/monstros/tengu_karasu/Hurt.png",
      "frames": 3,
      "ms": 420
    },
    "dead": {
      "src": "/sprites/monstros/tengu_karasu/Dead.png",
      "frames": 6,
      "ms": 900
    },
    "a1": {
      "src": "/sprites/monstros/tengu_karasu/Attack_3.png",
      "frames": 3,
      "ms": 300
    },
    "a2": {
      "src": "/sprites/monstros/tengu_karasu/Attack_2.png",
      "frames": 4,
      "ms": 440
    },
    "a3": {
      "src": "/sprites/monstros/tengu_karasu/Attack_1.png",
      "frames": 6,
      "ms": 630
    },
    "esp": {
      "src": "/sprites/monstros/tengu_karasu/Jump.png",
      "frames": 15,
      "ms": 1575
    },
    "def": {
      "src": "/sprites/monstros/tengu_karasu/Idle_2.png",
      "frames": 5,
      "ms": 600
    }
  },
  "20": {
    "pasta": "demon/Yamabushi_tengu",
    "idle": {
      "src": "/sprites/monstros/tengu_yamabushi/Idle.png",
      "frames": 6,
      "ms": 780
    },
    "hurt": {
      "src": "/sprites/monstros/tengu_yamabushi/Hurt.png",
      "frames": 3,
      "ms": 420
    },
    "dead": {
      "src": "/sprites/monstros/tengu_yamabushi/Dead.png",
      "frames": 6,
      "ms": 900
    },
    "a1": {
      "src": "/sprites/monstros/tengu_yamabushi/Attack_1.png",
      "frames": 3,
      "ms": 300
    },
    "a2": {
      "src": "/sprites/monstros/tengu_yamabushi/Attack_3.png",
      "frames": 4,
      "ms": 440
    },
    "a3": {
      "src": "/sprites/monstros/tengu_yamabushi/Attack_2.png",
      "frames": 6,
      "ms": 630
    },
    "esp": {
      "src": "/sprites/monstros/tengu_yamabushi/Jump.png",
      "frames": 15,
      "ms": 1575
    },
    "def": {
      "src": "/sprites/monstros/tengu_yamabushi/Idle_2.png",
      "frames": 5,
      "ms": 600
    }
  },
  "21": {
    "pasta": "demon/Kitsune",
    "idle": {
      "src": "/sprites/monstros/kitsune_nove_ecos/Idle.png",
      "frames": 8,
      "ms": 1040
    },
    "hurt": {
      "src": "/sprites/monstros/kitsune_nove_ecos/Hurt.png",
      "frames": 2,
      "ms": 280
    },
    "dead": {
      "src": "/sprites/monstros/kitsune_nove_ecos/Dead.png",
      "frames": 10,
      "ms": 1500
    },
    "a1": {
      "src": "/sprites/monstros/kitsune_nove_ecos/Attack_1.png",
      "frames": 10,
      "ms": 1000
    },
    "a2": {
      "src": "/sprites/monstros/kitsune_nove_ecos/Attack_2.png",
      "frames": 10,
      "ms": 1100
    },
    "a3": {
      "src": "/sprites/monstros/kitsune_nove_ecos/Attack_3.png",
      "frames": 7,
      "ms": 735
    },
    "esp": {
      "src": "/sprites/monstros/kitsune_nove_ecos/Jump.png",
      "frames": 10,
      "ms": 1050
    },
    "def": {
      "src": "/sprites/monstros/kitsune_nove_ecos/Idle_2.png",
      "frames": 6,
      "ms": 720
    }
  }
};

export const SPRITES_HEROIS: Record<string, SpritesCombatente> = {
  "GUERREIRO": {
    "idle": {
      "src": "/sprites/herois/cavaleiro/Idle.png",
      "frames": 4,
      "ms": 520
    },
    "hurt": {
      "src": "/sprites/herois/cavaleiro/Hurt.png",
      "frames": 2,
      "ms": 280
    },
    "dead": {
      "src": "/sprites/herois/cavaleiro/Dead.png",
      "frames": 6,
      "ms": 900
    },
    "a1": {
      "src": "/sprites/herois/cavaleiro/Attack%201.png",
      "frames": 5,
      "ms": 500
    },
    "a2": {
      "src": "/sprites/herois/cavaleiro/Attack%202.png",
      "frames": 4,
      "ms": 440
    },
    "a3": {
      "src": "/sprites/herois/cavaleiro/Attack%203.png",
      "frames": 4,
      "ms": 420
    },
    "esp": {
      "src": "/sprites/herois/cavaleiro/Attack%203.png",
      "frames": 4,
      "ms": 420
    },
    "def": {
      "src": "/sprites/herois/cavaleiro/Defend.png",
      "frames": 5,
      "ms": 600
    }
  },
  "MAGO": {
    "idle": {
      "src": "/sprites/herois/mago/Idle.png",
      "frames": 7,
      "ms": 910
    },
    "hurt": {
      "src": "/sprites/herois/mago/Hurt.png",
      "frames": 3,
      "ms": 420
    },
    "dead": {
      "src": "/sprites/herois/mago/Dead.png",
      "frames": 5,
      "ms": 750
    },
    "a1": {
      "src": "/sprites/herois/mago/Attack_1.png",
      "frames": 10,
      "ms": 1000
    },
    "a2": {
      "src": "/sprites/herois/mago/Attack_2.png",
      "frames": 4,
      "ms": 440
    },
    "a3": {
      "src": "/sprites/herois/mago/Light_charge.png",
      "frames": 13,
      "ms": 1365
    },
    "esp": {
      "src": "/sprites/herois/mago/Light_charge.png",
      "frames": 13,
      "ms": 1365
    },
    "def": {
      "src": "/sprites/herois/mago/Idle.png",
      "frames": 7,
      "ms": 840
    }
  },
  "SAMURAI": {
    "idle": {
      "src": "/sprites/herois/arqueiro/Idle.png",
      "frames": 9,
      "ms": 1170
    },
    "hurt": {
      "src": "/sprites/herois/arqueiro/Hurt.png",
      "frames": 3,
      "ms": 420
    },
    "dead": {
      "src": "/sprites/herois/arqueiro/Dead.png",
      "frames": 5,
      "ms": 750
    },
    "a1": {
      "src": "/sprites/herois/arqueiro/Attack_1.png",
      "frames": 5,
      "ms": 500
    },
    "a2": {
      "src": "/sprites/herois/arqueiro/Attack_2.png",
      "frames": 5,
      "ms": 550
    },
    "a3": {
      "src": "/sprites/herois/arqueiro/Shot.png",
      "frames": 14,
      "ms": 1470
    },
    "esp": {
      "src": "/sprites/herois/arqueiro/Shot.png",
      "frames": 14,
      "ms": 1470
    },
    "def": {
      "src": "/sprites/herois/arqueiro/Idle.png",
      "frames": 9,
      "ms": 1080
    }
  },
  "ARQUEIRO": {
    "idle": {
      "src": "/sprites/herois/arqueiro/Idle.png",
      "frames": 9,
      "ms": 1170
    },
    "hurt": {
      "src": "/sprites/herois/arqueiro/Hurt.png",
      "frames": 3,
      "ms": 420
    },
    "dead": {
      "src": "/sprites/herois/arqueiro/Dead.png",
      "frames": 5,
      "ms": 750
    },
    "a1": {
      "src": "/sprites/herois/arqueiro/Attack_1.png",
      "frames": 5,
      "ms": 500
    },
    "a2": {
      "src": "/sprites/herois/arqueiro/Attack_2.png",
      "frames": 5,
      "ms": 550
    },
    "a3": {
      "src": "/sprites/herois/arqueiro/Shot.png",
      "frames": 14,
      "ms": 1470
    },
    "esp": {
      "src": "/sprites/herois/arqueiro/Shot.png",
      "frames": 14,
      "ms": 1470
    },
    "def": {
      "src": "/sprites/herois/arqueiro/Idle.png",
      "frames": 9,
      "ms": 1080
    }
  }
};
