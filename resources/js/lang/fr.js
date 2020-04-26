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
                2: "Vous avez trouvé votre cible dans le Terte, mais elle s'est échapée. En le poursuivant, vous avez compris pourquoi les bandits ont choisi cette sépulture particulière: des Squelettes Réanimés. Les bandits semblent avoir des dons pour la nécromancie. Vous les avez néanmoins tués, ainsi que leurs alliés impies§. Votre cible ne fait pas partie des cadavres, mais un passage plus profond dans les catacombes vous attend.",
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
        3: {
            "name": "A la recherche de l'Ombre",
            "sections": {
                1: "Le Chef des Bandits a évoqué l'Ombre durant la bataille et ça vous mets mal à l'aise. En fouillant les restes après le carnage, vous avez trouvé des parchemins cachés, écrits dans un langage archaïque inconnu. Vous avez aussi trouvé une carte de la campagne nord. Une encoche désignait la Rivière Calme commun point d'intérêt. C'est en vous demandant si vous vouliez ou non en savoir plus sur cette soi-disant Ombre que vous avez décidé que ce lieu pouvait être aussi un point d'intérêt pour vous. ",
                2: "La carte vous a mené à une crypte pleine de démons et de cultistes. Il est évident que les bandits sont associés à une sorte de culte. Votre arrivée à perturbé une sorte de rituel. Parmi les papiers trouvés dans la chambre de rituel se trouvaient des notes sur plusieurs lieux de puissance dans la région. L'un de ces lieux est marqué comme étant submergé par des morts-vivants vicieux. Vous avez visiblement une opportunité d'entrer dans les bonnes grâces du culte en les aidant à se débarasser de cette menance. Vous pourriez ainsi en apprendre plus sur l'Ombre",
                3: "Après que les plaintes et les cris terribles des morts-vivants aient cessés, une silhouette masquée est apparue devant vous. Ses manières vous ont profondément perturbées. Il vous a demandé une faveur en échange de son pardon pour avoir tué son engeance. Les cultistes veulent voir la fin de la nécromancienne, Jekserah. Si vous amenez sa tête dans leur repaire, vous pourriez en apprendre plus à propos de l'Ombre. La silouhette vous a indiqué où trouver des détails sur les plans de Jekserah.",
                4: "Vous avez occis Jekserah. Alors qu'elle s'effondrait, la vie quittant son regard, elle a murmuré 'Vous n'avez aucune idée de ce qui va se passer...'. Peut-être que la tête de votre ancien patron pourra s'avérer utile pour vos affaires avec les bandits. ",
                5: "Vous avez occis Jekserah. Il est l'heure de ramener la tête de votre ancien patron au repaire des cultistes.",
                6: "Malheureusement pour les cultistes, vous avez décidé de prendre le parti de Jekserah en prenant possession de la ville. Votre mystérieux contact ne voudra probablement plus jamais vous rencontrer.",
                7: "Vous avez rencontré la silhouette masquée au repaire du culte, où elle vous a remercié pour votre aide contre la nécromancienne. Il vous a ensuite présenté à une déchirure dans l'espace, noire et enflammée, qu'il a appelé son maitre : l'Ombre. La silhouette vous a alors trahis en invocant une horde de créatures surnaturelles pour vous tuer. Apparamment, il est difficile d'entrer dans les bonnes grâces du culte après avoir assassiné leurs membres et contrarié leurs plans. Après une bataille éprouvante, l'Ombre vous a parlé d'une voix froide et grave : 'Vous vous êtes bien défendus. Mes serviteurs ne sont peut-être pas capable de vous pardonner, mais moi je le peux. Venez. Rejoignez-moi. Entre dans mon royaume. Embrassez votre inéluctable destinée.' La faille se tient devant vous. Oserez-vous entrer ?",
                7: "Vous êtes entrés dans la faille sombre. La voix grave vous a parlé à nouveau, 'Vous vous êtes fait avoir, encore une fois. Je n'arrive toujours pas à croire qu'une créature aussi stupide que vous ait pu me causer autant de problèmes. Enfin, cela n'a plus d'importance à présent : vous allez pourrir ici, loin de votre monde. Il n'y aura pas de baroud d'honneur. Vous dépérirez simplement. Votre mort sera sans gloire, sans valeur, sans but. Je vais vous laisser maintenant, pour toujours. Adieu.'. La bataille qui a suivie vous a semblé sans fin. Après avoir tué tout ce qui bouge, vous avez cogné sur les murs, souhaitant veinement quelque chose contre lequel continuer à combattre dans cet exile. Vous vous êtes épuisés, puis votre vision s'est assombrie. Lorsque vous avez repris connaissance, vous vous trouviez allongés dans l'herbe à l'extérieure du repaire des cultistes. 'Sachez que j'ai décidé de vous épargner. Votre obstination m'intrigue. Je prendrais plaisir à voir vos inutiles efforts se briser contre ma puissance. Ce sera plus divertissant que la dernière fois que j'ai plongé ce monde dans l'obscurité.' Vous vous êtes relevés brusquement et avez foncé dans la crypte; les cadavres des cultistes recouvraient le sol. 'Je ne suis plus ici. Ces coquilles vides ont rempli leur mission. Mes racines sont désormais profondes et vous serrez bientôt à nouveau confrontés à mon pouvoir infini. J'attends ce jour avec impatience.'"
            },
            "stages": {
                0: "{1}",
                1: "{1}{2}",
                2: "{1}{2}{3}",
                3: "{1}{4}",
                4: "{1}{2}{4}",
                5: "{1}{2}{3}{5}",
                6: "{1}{2}{3}{6}",
                7: "{1}{2}{3}{5}{7}",
                8: "{1}{2}{3}{5}{7}{8}",
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
        5: {
            "name": "Le bienfait des plantes",
            "sections": {
                1: "Jekserah s'est enfuie pour une destination inconnue. L'enchanteresse Esther Tourmente saura peut-être vous mettre sur la piste de cette criminelle.",
                2: "Tourmente vous a envoyé collecter de l'Amèracine dans la Forêt des Dagues. L'enchanteresse étourdie a ensuite utilisé cette plante pour localiser Jekserah. Vous avez aussi appris que vous deviez sonner puis attendre 47 secondes avant d'entrer à l'Os Tordu."
            },
            "stages": {
                0: "{1}",
                1: "{1}{2}"
            }
        },
        6: {
            "name": "Le Secret de la Négociante",
            "sections": {
                1: "Un contact mystérieux vous a donné l'emplacement de l'entrepot de Jekserah à Havrenuit. Il est clair que Jekserah cache un secret dans cet entrepot. S'attaquer à cet entrepot mettra probablement fin aux accords que vous avez avec elle. Cependant, elle a certainement un plan et vous allez y mettre un terme.",
                2: "L'entrepot était empli de morts-vivants. Jekserah a utilisé le parchemin de nécromancie que vous lui avez fourni pour réveiller les morts entre les murs de la ville. Vous avez combattu jusqu'à l'arrière salle et confronté Jekserah. Elle a juré de se venger et s'est échappée par une fenêtre pendant que vous combattiez ses gardes Inox. Après les avoir tués, vous avez cherché des indices de la Valrath, mais n'en avez trouvé aucun. Vous avez arreté ses plans pour l'instant, mais après cette brêve conversation il est clair que vous allez devoir la pourchasser avant qu'elle puisse mettre sa menace à exécution.",
                3: "Vous avez ignoré les avertissements d'Argeise, la garde de la cité, et continué de travaillé pour Jekserah. \"Machinations Sinistres\" est bien sûr une phrase troublante, mais la phrase \"récompense considérable\" prime à vos oreilles. Il n'y a plus aucune raison d'attaquer l'entropot."
            },
            "stages": {
                0: "{1}",
                1: "{1}{2}",
                2: "{1}{3}"
            }
        },
        7: {
            "name": "Le meilleur ami d'une Valrath",
            "sections": {
                1: "Jekserah a une dernière tâche pour vous. Elle a besoin d'un diamant d'une taille considérable pour un certain client. Il y a une mine de diamant dans les montagnes sud, mais elle est occupée par des Vermlings, soutenu par une force intelligente. Si vous pouvez vous frayer un chemin et attraper le plus gros diamant que vous trouverez, Jekserah vous donnera une récompense considérable. Cependant, vous avez aussi été prévenu par un garde que Jekserah pouvait être impliquée dans une machination plus sinistre que ce qu'elle vous a laissé penser. Quelque chose à propos de renverser la milice... mais un diamant ne pourrait pas faire de mal, n'est-ce pas ?",
                2: "Machination sinitre ou non, vous avez décidé que la phrase \"récompense considérable\" était plus pertinente. Comme vous vous y attendiez, la mine de diamant était infesté par des mineurs Vermling. Ils étaient menés par un Contre-maitre Impitoyable qui a rapidement tourné les mineurs contre vous avec quelques coups de fouets. Une fois débarassé du Contre-maitre, les mineurs restants se sont éparpillés. Vous êtes retourné voir Jekserah pour récupérer votre récompense. Ses gardes du corps vous ont escorté à l'intérieur du manoir, qui semblait d'une certaine manière différent - plus tortueux et sombre. \"Merveilleux.\" Elle vous a échangé le diamant contre un sac rempli de pièces. \"Celà conviendra à merveille comme point focal pour l'incantation. Je me demande si les cultistes savaient seulement ce qu'ils avaient là. Avec ceci, je peux invoquer une armée entière de mort-vivants!\" Elle s'est tournée vers vous avec une lueur étrange dans le regard. \" Alors! Etes-vous prêts à renverser la milice d'Havrenuit et mettre le contrôle de la ville entre les mains de la Guilde des Négociants ? Ou peut-être n'avez-vous pas le courage de provoquer de vrai changements?\"",
                3: "Vous avez décidé que \"machination sinistre\" passait avant \"récompense considérable\". Vous vous êtes attaqué à l'entrepot de Jekserah et découvert ses plans secrets d'envahir la ville avec une armée de morts. Elle a cependant fui la ville. Il semble évident que la \"récompense considérable\" n'est plus à l'ordre du jour et qu'il n'y a plus aucune raison de se rendre à la mine."
            },
            "stages": {
                0: "{1}",
                1: "{1}{2}",
                2: "{1}{3}"
            }
        },
        8: {
            "name": "De l'autre côté de la Faille",
            "sections": {
                1: "Pendant que vous mettiez un terme aux activité d'un groupe de cultiste, vous vous êtes retrouvés face à une déchirure béante dans la réalité. Les cultistes étaient en train de réaliser une sorte de rituel sur la faille, qui déversait des formes cauchemardesques remplies de dents et de griffes. Une fois les cultistes et leurs partisants morts, la faille semble désormais en sommeil. Elle ne cesse pas cependant de vous perturber. Vous avez lancé une pierre au travers, qui a disparu dans le vide - vous vous demander si vous pouvez vous-même entrer dans la faille et si vous pourriez survivre à ce voyage. Oserez-vous entrer dans la faille ?",
                2: "Le voyage était loin d'être agréable. Aussitôt arrivés, vous avez été abordé par des démons envoyés par une voix en colère. Une fois débarassés des démons, la voix vous a parlé à nouveau et vous a invité dans son royaume. Ayant déjà fait un pas vers l'inconnu, vous avez décidé que vous pouviez en faire un second. A l'intérieur du royaume de la voix se trouvait une créature monstrueuse, qui vous a demandé de récupérer un artefact - ou de mourir par sa main sinon.",
                3: "Non, bien évidemment. Quel sort d'idiot plongerait dans une faille vers une autre dimension ? A la place, vous avez décidé de trouver de l'aide pour fermer définitivement cette faille. Il est clair que rien de bon ne pouvait en sortir, alors vous l'avez neutralisée."
            },
            "stages": {
                0: "{1}",
                1: "{1}{2}",
                2: "{1}{3}"
            }
        },
        9: {
            "name": "Sur les traces de la nécromancienne",
            "sections": {
                1: "La nécromancienne Jekserah a fui Havrenuit. Avant son départ, elle vous a menacé; il est clair que vous devez à présent la pourchasser avant qu'elle puisse mettre ses menaces à exécution. Malheureusement, vous n'avez aucune idée de l'endroit où elle se trouve. La garde de la ville ne sont pas d'une grande aide, mais Argeise vous a donné quelques pistes. Il y a une enchanteresse Esther en ville qui pourrait être capable de localiser Jekserah, mais elle a la réputation d'être un associé difficile. Une seconde piste repose sur l'un de vos contacts au sanctuaire du Grand Chêne, qui a entendu parler d'un temple dédié à une force invisible, qui répondra à toute question qu'on lui pose.",
                2: "Vous avez rencontré l'enchanteresse Esther Tourmente, à l'Os Tordu. Bien qu'un peu excentrique, elle à l'air tout à fait compétente. Vous avez gagné ses faveurs en lui rendant un service. Peut-êter pourra t'elle maintenant vous aider à trouver Jekserah?",
                3: "Vous avez visité le Temple du Prophète, mais vous étiez plus intéressé par les autres propositions de la voix plutôt que dans le fait de trouver Jekserah. Le seul moyen de trouver Jekserah maintenant est de requérire l'aide de l'enchanteresse.",
                4: "Vous avez localisé le sanctuaire de Jekserah dans la Forêt des Dagues. C'est l'heure de mettre un terme à sa nécromancie.",
                5: "Après une bataille sanglante contre ses sbires morts-vivants, Jekserah a péri sous votre lame. Vous avez séparé sa tête de son corps et quitté sans trainer ce lieu rempli de corps démembrés. Vous avez ramené la tête au Capitaine de la Garde et avez reçu une prime substentielle en échange."
            },
            "stages": {
                0: "{1}",
                1: "{1}{2}",
                2: "{1}{3}",
                3: "{1}{2}{3}",
                4: "{1}{4}",
                5: "{1}{4}{5}"
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
