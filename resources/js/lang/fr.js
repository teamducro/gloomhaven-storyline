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
                8: "Vous êtes entrés dans la faille sombre. La voix grave vous a parlé à nouveau, 'Vous vous êtes fait avoir, encore une fois. Je n'arrive toujours pas à croire qu'une créature aussi stupide que vous ait pu me causer autant de problèmes. Enfin, cela n'a plus d'importance à présent : vous allez pourrir ici, loin de votre monde. Il n'y aura pas de baroud d'honneur. Vous dépérirez simplement. Votre mort sera sans gloire, sans valeur, sans but. Je vais vous laisser maintenant, pour toujours. Adieu.'. La bataille qui a suivie vous a semblé sans fin. Après avoir tué tout ce qui bouge, vous avez cogné sur les murs, souhaitant veinement quelque chose contre lequel continuer à combattre dans cet exile. Vous vous êtes épuisés, puis votre vision s'est assombrie. Lorsque vous avez repris connaissance, vous vous trouviez allongés dans l'herbe à l'extérieure du repaire des cultistes. 'Sachez que j'ai décidé de vous épargner. Votre obstination m'intrigue. Je prendrais plaisir à voir vos inutiles efforts se briser contre ma puissance. Ce sera plus divertissant que la dernière fois que j'ai plongé ce monde dans l'obscurité.' Vous vous êtes relevés brusquement et avez foncé dans la crypte; les cadavres des cultistes recouvraient le sol. 'Je ne suis plus ici. Ces coquilles vides ont rempli leur mission. Mes racines sont désormais profondes et vous serrez bientôt à nouveau confrontés à mon pouvoir infini. J'attends ce jour avec impatience.'"
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
        },
        11: {
            "name": "La vieille garde",
            "sections": {
                1: "Jekserah a convoqué une armée de morts-vivants et prévoit d'envahir la ville! Vous devez avertir immédiatement les gardes!",
                2: "Vous avez couru pour avertir les gardes de la ville et avez pu monter une défense contre les vagues de morts-vivants qui se sont écrasées sous vos armes. Vous avez combattu les morts-vivants jusqu'au manoir de Jekserah, où vous avez mis un terme à sa vile nécromancie une fois pour toutes. Jekserah est morte par votre main.",
                3: "À moins que... Il y a quelque chose dans le plan de Jekserah, il a du sens d'une façon sombre et tordue. Vous avez décidé de ne pas avertir les gardes, mais au lieu de cela, vous avez rejoint l'armée des morts-vivants de Jekserah pour renverser l'armée d'Havrenuit."
            },
            "stages": {
                0: "{1}",
                1: "{1}{2}",
                2: "{1}{3}"
            }
        },
        32: {
            "name": "Ice Climbers",
            "sections": {
                0: "Avec l'aide de Tourmente, l'artefact a été nettoyé de son influence corruptrice. Cependant, Tourmente a mentionné trois emplacements qui tiraient le pouvoir de l'artefact corrompu. Si vous voulez en savoir plus sur l'artefact, vous voudrez peut-être visiter ces emplacements. Un de ces emplacements est situé au sommet des Crêtes de Cuivre. ",
                1: "Vous avez escaladé les sommets gelés des Crêtes de Cuivre, déplorant que le lieu où Tourmente vous a envoyé se trouve être l'endroit le plus impitoyable et inhospitalier possible. En escaladant les montagnes, vous avez été pris en embuscade par des personnages en capes sombres et des démons de glace, alors que vous tentiez de franchir un fossé. Une voix a retentit au dessus du vent hurlant. \"Vous n'êtes pas les bienvenus ici, mortels. Tout ce qui vous attend est l'étreinte de la mort.\" Vous pouviez à peine voir à travers le blizzard, mais vous êtiez déterminé à vous assurer que la mort embrasse plutôt quelqu'un d'autre. Alors que vous vous battiez contre les ennemis et les éléments, vous avez échappé à la tempête et trouvé un semblant d'abri dans une grotte. Une orbe d'un blanc brillant se trouvait derrière les démons crytallins qui occupaient la grotte. Les pièces du puzzle commençaient toutes à se mettre en place. Ces démons contrôlaient les éléments ici, bloquant votre passage vers le pic. Vous avez détruis l'orbe et les cris du vent à l'extérieur de la grotte ont diminué jusqu'à n'être que des faibles murmures. Vous êtes sorti et avez trouvé un ciel clair au-dessus de vous, ainsi qu'un chemin vers le sommet. À cette altitude, sans nuage à perte de vue, vous vous êtes émerveillés devant l'étendue merveilleuse des montagnes, des forêts et des plaines au-delà . Vous pouviez même voir le faible contour de Havrenuit au loin. ",
                2: "Une fois l'autel de glace détruit, grimper le reste du chemin vers le haut de la montagne fût heureusement sans incident. Vous vous amusiez presque, admirant la vue sur toute la campagne, quand la vue est soudainement devenue sombre, bien qu'il ne soit que midi. Vous etiez très proches du sommet maintenant, et vous avez supposé que ce développement avait quelque chose à voir avec la présence maléfique au sommet. Un crissement aigu a retentit, et vous vous êtes accroupis en plissant les yeux dans l'obscurité. Près du sommet, vous avez vu de nombreuses formes sombres grouillant et se tordant, comme si la montagne elle-même était vivante. En plissant les yeux plus loin, vous avez remarqué que la contraction se déplaçait vers le bas de la montagne vers vous. Il semble que votre présence ne soit pas passée inaperçue. Vous avez préparé vos armes et vous vous êtes préparé à vous frayer un chemin jusqu'au sommet.  Le cri strident a percé à nouveau vos oreilles, et un démon massif avec une multitude de griffes acérées et d'ailes coriaces a atterrit devant vous. \"Vous osez vous approcher de mon nid?\" Vous pouviez à peine distinguer les mots de ses gémissements aigus: \"Je vais récolter vos cadavres et les donner en pâture à mes enfants!\" Vous vous êtes battu contre le démon et ses «enfants» jusqu'à ce que finalement, le démon n'en puisse plus. Le démon géant a hurlé une dernière fois, son timbre et son intensité se modulant sauvagement. Ne voulant pas se rapprocher de ses griffes volantes , vous avez attendu que la créature expire. Quand ce fût le cas, une immobilité a envahi la zone et le jour est apparu à nouveau dans le ciel au-dessus de vous. La vue est majestueuse, hormis le sang et les entrailles qui jonchent le pic. Vous avez repris votre souffle et puis lentement commencé à redescendre la montagne, convaincu que le mal qui se cachait ici ne dérangera plus Havrenuit. "
            },
            "stages": {
                0: "{0}",
                1: "{0}{1}",
                2: "{0}{1}{2}"
            }
        },
        33: {
            "name": "Un peu de silence",
            "sections": {
              0: "À l'intérieur d'une grotte dans les Crêtes de Cuivre, vous avez découvert une créature liée par un sortilège, connue uniquement sous le nom de\" La Voix \". Depuis, vos oreilles n'ont pas cessé de sonner. Sur les conseils d'un érudit Quatryl, vous avez récupéré un sceptre de liaison , rempli d'énergies sombres, depuis un sanctuaire au bord du Marais Stagnant. Si vous apportez le sceptre dans la chambre de la Voix, vous pourrez renouveler le lien et faire taire cette maudite voix une fois pour toutes. ",
              1: "Vous avez décidé que le moyen le plus simple de faire taire la Voix était simplement de lui donner ce qu'elle voulait. La Voix a été libérée et n'habite plus la chambre des échos.",
              2: "Tandis que vous vous teniez dans la grotte de la montagne, sceptre à la main, la Voix vous a appelé.\" Vos intentions sont nobles. Vous me craignez et souhaitez me garder emprisonné. Je comprends, mais ce que vous faites ne conduira qu'au désastre et la ruine. Ce sceptre n'a pas été créé pour renforcer ma prison. Je l'ai créé! Je l'ai utilisé pour emprisonner l'un de mes plus grands ennemis - un être de mort et de haine. Je ne sais pas ce qui se passera lorsque vous apporterez cette chose à ma chambre , mais je peux vous garantir qu'il n'en sortira rien de bon! \" Vous avez bloqué les mensonges de la Voix de votre esprit et avant que la Voix ne puisse dire un autre mot, vous avez soulevé le sceptre et canalisé son pouvoir. La Voix cria une fois de plus, mais il n'y avait pas de cohérence dans le son - seulement de la douleur. Le brouillard commença à se dissiper et, pendant un moment, vous avez ressenti un soulagement, jusqu'à ce que vous vous rendiez compte que vous n'étiez plus dans la chambre d'écho, mais dans un endroit sombre et hostile. La Voix a retentit à nouveau, son timbre était désormais différent: \"Le pouvoir de la Voix est désormais mien! Vous serez le premier à y succomber!\" Après une bataille acharnée, vous avez coupé les cordes vocales de la Voix. La Voix ne parlera plus jamais. "
            },
            "stages": {
                0: "{0}",
                1: "{0}{1}",
                2: "{0}{2}"
            }
        },
        34: {
            "name": "Se faire pousser des branchies",
            "sections": {
                1: "Il vous faut un moyen de respirer sous l'eau. Il y a une enchanteresse Esther à Gloomhaven qui connait peut-être quelque chose à ce sujet. Mais tout le monde sait qu'elle demande des faveurs impossibles avant d'aider quelqu'un...",
                2: "Vous avez rencontré l'enchanteresse Esther, Tourment, à l'Os Tordu. Bien qu'un peu excentrique, elle semble tout à fait compétente. Vous avez accompli une de ses requetes et avaient ainsi gagné son aide. Peut-être peut elle maintenant vous aider à trouver un moyen de respirer sous l'eau?",
                3: "Tourment vous a envoyer piller un nid de Wyvernes pour leurs écailles. Ils n'étaient pas très désireux de s'en séparer, mais votre lame était très convaincante. Tourmente a utilisé les écailles pour former des orbes bleues plutôt inconfortables qui devraient vous permettre de respirer sous l'eau. Ignorez simplement la sensation de brûlure douloureuse, c'est normal. "
            },
            "stages": {
                0: "{1}",
                1: "{1}{2}",
                2: "{1}{2}{3}"
            }
        },
        35: {
            "name": "Au nom de la liberté",
            "sections": {
                1: "Vous avez récemment libéré un Orchide nommée Redthorn d'un camp d'esclaves Inox dans la Forêt des Dagues. Après une vengeance cathartique contre ses ravisseurs, il vous a demandé de l'accompagner dans un village voisin qui aurait pu subir le même sort que son propre village. ",
                2: "Sur le chemin du village, Redthorn a exprimé son inquiétude que les Inox soient devenus de plus en plus agressifs. Peut-être que si vous découvriez ce qui cause leur comportement, vous pourriez mettre fin à ces incursions? Vous avez eu peu de temps pour contempler ces pensées , puisque vous êtes arrivé juste à temps. Les Inox étaient venus à bout des défenses du village et se préparaient à massacrer les Orchides capturés. Redthorn et votre groupe sont entrés en action, sauvant tous les captifs et anéantissant les envahisseurs Inox. Le village des Orchides  est à présent en sécurité. "
            },
            "stages": {
                0: "{1}",
                1: "{1}{2}"
            }
        },
        36: {
            "name": "Saletés de Rebelles",
            "sections": {
                1: "Plusieurs semaines après avoir aidé à installer le Premier Démon en tant que suzerain de Havrenuit, vous vous êtes réveillé un jour en trouvant un démon déformé se tenant au-dessus de vous, tenant un parchemin qui ressemblait à une sorte de peau.\" Je me retrouve à requérir votre aide une fois de plus, mortels \", dit-il. \" Il semble que de nombreuses forces d'opposition à Havrenuit m'aient échappé et campent maintenant dans les contreforts sud, complotant pour reprendre la ville. De telles machinations seront sûrement infructueuses, mais il vaut toujours mieux les écraser maintenant que d'attendre de voir ce qu'ils vont faire. \"",
                2: "Avant d'avoir pû enquêter sur le camp rebelle, vous avez aidé à évincer les démons et à installer un groupe différent de suzerains à Havrenuit.",
                3: "À la demande du seigneur démon, vous vous êtes dirigé vers le Marais Stagnant pour détruire les derniers vestiges de l'opposition au reigne démoniaque. À l'aide de totems magiques permettant d'assécher le marais inhospitalier, les rebelles avaient érigé un camp. Vous avez écrasé l'opposition rebelle et ses totems, et regardé le campement s'enfoncer lentement dans la boue. Un des soldats mourants vous a divulgué l'emplacement des rebelles restants. Ils tomberont bientôt sous votre épée. "
            },
            "stages": {
                0: "{1}",
                1: "{1}{2}",
                2: "{1}{3}"
            }
        },
        37: {
            "name": "Aucun survivant",
            "sections": {
                1: "À la demande du seigneur démon, vous avez anéanti un campement rebelle dans le marais. L'un des gardes mourants a divulgué l'emplacement des forces rebelles restantes. “ Mais seulement parce que je sais que vous n'êtes pas vraiment mauvais. Au lieu de nous chasser et de vous battre avec nous, aidez-nous à reprendre la ville contre ces démons. Dirigez-vous vers l'est, à la frontière des Montagnes du Gardien. Cherchez au nord de la forêt de frênes. Parlez avec le commandant. Aidez nous à libérer la ville ... ”{Br} Folie. Maintenant vous savez exactement où frapper. Il n'y aura pas de survivants.",
                2: "Peut-être qu'il y avait quelque chose de vrai dans ce que vous ont dis ces gardes après tout. Vous avez aidé à évincer les démons et à installer un groupe entièrement différent de suzerains à la tête de Havrenuit.",
                3: "En suivant les instructions données par le garde mourant, vous avez pu facilement localiser le camp rebelle. Le pauvre fou pensait que vous vous joindriez aux rebelles pour aider à renverser les démons, mais ces espoirs étaient puérils et infondés. Vous étiez ici pour tuer et détruire. Sans hésitation, vous vous êtes déchaîné à travers le camp dans les contreforts des Montagnes du Gardien. Vous avez incendié leurs tentes et tué quiconque se tiennait devant vous. Le dernier bataillon de gardes a hésité alors qu'il vous a fait face, puis les humains se sont retourné et ont fui. \"Préparez l'arme de siège!\" L'un d'eux s'est écrié alors qu'ils gravissaient la colline. Vous a poursuivi. Cela fût intéressant. En combattant à travers la première vague de soldats, vous êtes arrivé à une clairière. Les autres gardes se tenait autour d'un très gros canon mécanique. Les gardes ont fait feu sur vous plusieurs fois, mais vous avez enduré les volées de canon et tué les gardes alors que vous avanciez. Finalement, le canon se tenait brisé à vos pieds, et avec lui, tout espoir que les rebelles avaient d'attaquer Havrenuit. Les gardes encore vivants se sont éparpillés vivants, et vous êtes revenu victorieux à Havrenuit, gouverné par les démons. \"Donc, vous avez écrasé les pathétiques rebelles?\" Vous vous êtes tenu devant l'un des agents du Premier Démon. \"Bien. Vous avez prouvé que vous êtiez un outil incroyablement efficace, et mon maître vous récompensera grandement pour votre service.\" "
            },
            "stages": {
                0: "{1}",
                1: "{1}{2}",
                2: "{1}{3}"
            }
        },
        38: {
            "name": "Un Nouvel Espoir",
            "sections": {
                1: "À la demande du seigneur démon, vous avez anéanti un campement rebelle dans le marais. L'un des gardes mourants a divulgué l'emplacement des forces rebelles restantes. “ Mais seulement parce que je sais que vous n'êtes pas vraiment mauvais. Au lieu de nous chasser et de vous battre avec nous, aidez-nous à reprendre la ville contre ces démons. Dirigez-vous vers l'est, à la frontière des Montagnes du Gardien. Cherchez au nord de la forêt de frênes. Parlez avec le commandant. Aidez nous à libérer la ville ... ”{Br} Hmm. Travailler pour un démon n'a pas tourné comme vous le pensiez. Il est peut-être temps de rejoindre l'alliance rebelle.",
                2: "Mais d'un autre côté, ce n'est pas mieux d'être du côté d'un groupe de rebelles perdants. Au lieu de cela, vous avez aidé à évincer les démons et à installer un groupe entièrement différent de suzerains à la tête de Havrenuit.",
                3: "Mais d'un autre côté, ce n'est pas mieux d'être du côté d'un groupe de rebelles perdants. Vous avez utilisé les instructions du garde pour localiser la base rebelle et les avez tous abattus.",
                4: "Vous avez suivi les instructions de la garde morte dans les contreforts des Montagnes du Gardien. Pas pour tuer et détruire, mais pour aider. Les rebelles semblent méfiants au début, mais ils finissent par vous accueillir. \" Vous pourriez être notre arme secrète. Si vous pouviez vous emparer de l'armurerie de la forteresse fantôme juste au moment où nous franchissons le mur nord, nous pourrions alors converger vers la forteresse et tenir. Une fois que nous serons correctement armés et que nous vous aurons à nos côtés, les démons n'auront aucune chance. La plupart des citoyens sont mécontents de leur occupation et se lèveront quand ils verront que nous avons l'avantage. \" Trois jours plus tard, vous vous êtes faufilé dans la forteresse fantôme et avez pris d'assaut l'armurerie. Vous avez sécurisé l'armurerie juste au moment où les combattants rebelles ont pénètré dans la forteresse. Eliminer les démons du reste du bâtiment fût rapide après cela. Avec une forte présence dans la ville et la population de votre côté, la tendance s'est retourné rapidement contre les démons. La bataille fût encore longue et difficile, car de plus en plus de forces arrivaient du plan élémentaire, mais elle n'a fait finalement que rapprocher les habitants de Havrenuit, luttant contre un ennemi commun. Et comme vous ne vous battiez plus pour eux, la force démoniaque a finit par céder et s'est replié vers sa dimension. Les prochaines semaines furent difficiles, car les citoyens ont reconstruit les murs et tout ce qui aavait été détruit lors de la bataille prolongée. Ils eurent besoin de temps pour vous faire à nouveau confiance après votre trahison. Mais Havrenuit s'est reconstruite avec le temps. Les choses ne seront jamais comme avant, mais au moins, on se sent toujours comme à la maison. "
            },
            "stages": {
                0: "{1}",
                1: "{1}{2}",
                2: "{1}{3}",
                3: "{1}{4}"
            }
        },
        39: {
            "name": "Influence corruptrice",
            "sections": {
                1: "Avec l'aide de Tourment, l'artéfact a été purgé de son influence corruptrice. Cependant, Tourmente a mentionné 3 lieux qui tiraient encore du pouvoir de cet artéfact corrompu. Vous avez déjà visité au moins l'un de ces emplacement et détruit l'influence corruptrice qui s'y trouvait. Si vous localisez et détruisez l'influence corruptrice dans chacun des trois lieux, Tourment pourrait vous donner des informations sur la corruption qui réside dans la région de Havrenuit.",
                2: "Vous avez détruit l'influence corruptrice dans la Mer de Brume, la Forêt des Dagues et les Crêtes de Cuivre. C'est l'heure d'aller voir Tourmente et aller au fond de cette histoire.",
                3: "Avant que tourmente n'ai pu vous expliquer quoi que ce soit, une colonne immense de sable noir a émergé du nord est de l'Ose Tordu. Tourment a pointé fermement en direction du nuage de sable tourbillonnant, tout en vous tendant une sacoche pour vous protéger de ses effets néfastes. Entrer dans le vortex s'est avéré extrèmement douloureux, mais le contenu de la sacoche vous remplissait d'un engourdissement bienvenu. Après un certain temps, vous vous êtes retrouvés au milieu d'une large salle en pierre couverte d'étranges symboles runics. Il y régnait un froid surnaturel, et la douleur diffuse du Vide persistant encore. “Ceux qui sont assez courageux pour pénétrer en ces lieux seront les premiers à mourrir,” résonne une voix tout autour de vous. “Les autres seront de toute façon chassés et inéluctablement dévorés, mais je prendre plus de plaisir à annihiler les premiers.” Vos yeux s'accoutumaient peu à peu à la pénombre, et vous parveniez à distinguer une silhouette éthérée au centre de la salle. Vous distinguez un Esther porteur de deux lames longues et effilées. “J'ai patienté de nombreuses années pour faucher cette récolte,” a t'il repris avec un sourire cruel. “Pendant un moment, je m'étais convaincu que je prendrais plus de plaisir à vous regarder vous entretuer peu à peu, mais après l'intervention de ma confrérie et la mort de mes geôliers, j'en suis revenu au plan initial. Je ne suis pas mécontent de ce revirement. Même la patience d'un immortel a ses limites.” Les lames de l'Esther se sont mis soudain à virevolter au rythme de la chorégraphie macabre qu'il entame. “Venez à moi, mes agneaux. Qui sera le premier à embrasser l'Ombre?” La bataille a fait rage pendant ce qui vous a semblé des siècles, mais finallement, les deux épées sont tombées au sol avec un tintement métallique. L'Esther est resté un instant immobile, une lueur d'incrédulité traversant son visage balafré. “Comment osez-vous,” a t'il murmuré d'une voix devenue désormais menaçante et éraillée. “J'ai attendu des milliers d'années et vous prétendez me priver des fruits de mes travaux ?” La mort a décrispé les mâchoirs de l'Esther, mais son corps tenait encore, comme suspendu par des cordes invisibles. “Vous pouvez détruire ce corps et me bannir de cette dimencion, mais ce ne sera jamais suffisant. Je suis éternel. Je reviendrai. Je me repaîtrai de ce monde une fois encore!” A ces mots, le corps de l'Esther s'est effondré, puis a disparu. La douleur sourde s'est estompé, et vous avez remonté l'escalier à la lumière du jour. Plus de secousses ni de vortex de sable noir. Tous les habitants de Havrenuit rassemblés autour de vous ont émis un soupir de soulagement lorsque vous avez émergé des profondeurs. Vous avez expliqué aux citoyens la nature du péril dont vous les avez protégés. Ils se sont réjouient et ont loué votre courage."
            },
            "stages": {
                0: "{1}",
                1: "{1}{2}",
                2: "{1}{2}{3}"
            }
        },
    }
}
