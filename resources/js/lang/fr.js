export default {
    general: {
        complete: 'Achevé',
        incomplete: 'Incomplet',
        blocked: 'Bloqué',
        required: 'Obligatoire'
    },
    quest: {
        1: {
            "name": "La Requête de la Négociante",
            "sections": {
                1: "La Négociante Valrath Jekserah a proposé de vous payer dix pièces d'or pour récupérer des biens volés. Après une conversation musclée avec certains voyous locaux, vous avez découvert que la cachette des voleurs est le Tertre Noir dans le bois du Cadavre.",
                2: "Vous avez trouvé votre cible dans le Terte, mais elle s'est échapée. En le poursuivant, vous avez compris pourquoi les bandits ont choisi cette sépulture particulière: des Squelettes Réanimés. Les bandits semblent avoir des dons pour la nécromantie. Vous les avez néanmoins tués, ainsi que leurs alliés impies§. Votre cible ne fait pas partie des cadavres, mais un passage plus profond dans les catacombes vous attend.",
                3: "Vous avez vaincu le Chef des bandits. Quelque chose dans son regard ne semblait pas naturel et il a mentionné l'Ombre pendant votre bataille. Vous avez trouvé les parchemins volés, cachés dans la chambre du Chef et les avez rendus à Jekserah en échange de la récompense convenue."
            },
            "stages": {
                0: "{1}",
                1: "{1}{2}",
                2: "{1}{2}{3}"
            }
        },
        2: {
            "name": "La Colère de la Négociante",
            "sections": {
                1: "Une tribu d'Inox de la forêt des Dagues a pillé des caravanes de Jekserah près de la capitale. Si vous pouviez en faire un exemple, elle vous paiera généreusement.",
                2: "La tribu des Inox est décimée. Vous en avez fait un exemple brutal et personne ne menacera les caravanes de Jekserah pendant un bon moment. Vous ne vous sentez pas vraiment bien d'avoir tué des parents devant leurs enfants, mais Jekserah vous a tout de même payé.",
                3: "Jekserah a fui Gloomhaven et a juré de se venger pour ce que vous lui avez fait. Elle ne voudra probablement plus vous payer pour faire ses missions."
            },
            "stages": {
                0: "{1}",
                1: "{1}{2}",
                2: "{1}{3}"
            }
        },
        4: {
            "name": "Contes de la Crypte",
            "sections": {
                1: "En enquêtant sur l'Ombre, vous avez découvert que les bandits de Tertre Noir sont associés à ce qui semble être un culte. Votre arrivée a perturbé une sorte de rituel. Parmi les manuscrits trouvés dans la chambre rituelle se trouvent des notes sur quelques autres lieux de pouvoir dans la région, qui semblent avoir un lien avec le culte. Il semble que vous ayez l'occasion de perturber davantage leurs activités.",
                2: "Vous avez suivi les notes jusqu'à une ancienne crypte censée être la base des opérations du culte. Un groupe de cultistes effectuait des incantations rituelles devant une déchirure noire et béante dans la réalité. Les cultistes et leurs sbires étant morts, cette faille sombre est maintenant en sommeil."
            },
            "stages": {
                0: "{1}",
                1: "{1}{2}"
            }
        },
        10: {
            "name": "Nouvelle Administration",
            "sections": {
                1: "Ravie de votre travail jusqu'à présent, Jekserah vous a invité à participer à son invasion de la ville par des morts-vivants. Elle prévoit renverser l'armée et donner le contrôle de la ville à la Guilde des Marchands.",
                2: "Vous avez aidé Jekserah à renverser l'armée. Les gardes de la ville ont riposté, mais leurs corps de pitoyables mortels n'étaient pas à la hauteur de l'attaque écrasante des morts-vivants et de la puissance de vos lames. Chaque garde qui est tombé a renforcé les rangs des morts-vivants. Lorsque le Capitaine de la Garde est tombé, les gardes restants ont fui comme les lâches que vous avez toujours su qu'ils étaient. Les gardes du corps de Jekserah ont été tués pendant l'invasion, mais tant mieux pour vous. Vous êtes maintenant le nouveau bras droit de Jekserah et la Guilde marchande gouverne la ville.",
                3: "Renverser l'armée ne faisait pas partie de vos plans. Vous avez rejeté l'invitation de Jekserah et vous vous êtes rangé du côté de la Garde de la Ville contre l'invasion. Jekserah est morte par votre main."
            },
            "stages": {
                0: "{1}",
                1: "{1}{2}",
                2: "{1}{3}"
            }            
        }
    }
}
