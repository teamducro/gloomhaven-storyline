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
                2: "Vous avez trouvé votre cible dans le Tertre, mais elle s'est échappée. En la poursuivant, vous avez compris pourquoi les bandits ont choisi cette sépulture particulière : des Squelettes Réanimés. Les bandits semblent avoir des dons pour la nécromancie. Vous les avez néanmoins tués, ainsi que leurs alliés impies§. Votre cible ne fait pas partie des cadavres, mais un passage plus profond dans les catacombes vous attend.",
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
                1: "Une tribu d'Inox de la forêt des Dagues a pillé des caravanes de Jekserah près de la capitale. Si vous pouviez en faire un exemple, elle vous payerait  généreusement.",
                2: "La tribu des Inox est décimée. Vous en avez fait un exemple brutal et personne ne menacera les caravanes de Jekserah pendant un bon moment. Vous ne vous sentez pas vraiment bien d'avoir tué des parents devant leurs enfants, mais Jekserah vous a tout de même payé.",
                3: "Jekserah a fui Havrenuit et a juré de se venger pour ce que vous lui avez fait. Elle ne voudra probablement plus vous payer pour faire ses missions."
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
                2: "La carte vous a mené à une crypte pleine de démons et de cultistes. Il est évident que les bandits sont associés à une sorte de culte. Votre arrivée à perturbé une sorte de rituel. Parmi les papiers trouvés dans la chambre de rituel se trouvaient des notes sur plusieurs lieux de puissance dans la région. L'un de ces lieux est marqué comme étant submergé par des morts-vivants vicieux. Vous avez visiblement une opportunité d'entrer dans les bonnes grâces du culte en les aidant à se débarrasser  de cette menace. Vous pourriez ainsi en apprendre plus sur l'Ombre",
                3: "Après que les plaintes et les cris terribles des morts-vivants aient cessés, une silhouette masquée est apparue devant vous. Ses manières vous ont profondément perturbées. Il vous a demandé une faveur en échange de son pardon pour avoir tué son engeance. Les cultistes veulent voir la fin de la nécromancienne, Jekserah. Si vous amenez sa tête dans leur repaire, vous pourriez en apprendre plus à propos de l'Ombre. La silhouette vous a indiqué où trouver des détails sur les plans de Jekserah.",
                4: "Vous avez occis Jekserah. Alors qu'elle s'effondrait, la vie quittant son regard, elle a murmuré 'Vous n'avez aucune idée de ce qui va se passer...'. Peut-être que la tête de votre ancien patron pourra s'avérer utile pour vos affaires avec les bandits. ",
                5: "Vous avez occis Jekserah. Il est l'heure de ramener la tête de votre ancien patron au repaire des cultistes.",
                6: "Malheureusement pour les cultistes, vous avez décidé de prendre le parti de Jekserah en prenant possession de la ville. Votre mystérieux contact ne voudra probablement plus jamais vous rencontrer.",
                7: "Vous avez rencontré la silhouette masquée au repaire du culte, où elle vous a remercié pour votre aide contre la nécromancienne. Il vous a ensuite présenté à une déchirure dans l'espace, noire et enflammée, qu'il a appelé son maitre : l'Ombre. La silhouette vous a alors trahis en invoquant une horde de créatures surnaturelles pour vous tuer. Apparemment, il est difficile d'entrer dans les bonnes grâces du culte après avoir assassiné leurs membres et contrarié leurs plans. Après une bataille éprouvante, l'Ombre vous a parlé d'une Voix froide et grave : 'Vous vous êtes bien défendus. Mes serviteurs ne sont peut-être pas capables de vous pardonner, mais moi je le peux. Venez. Rejoignez-moi. Entre dans mon royaume. Embrassez votre inéluctable destinée.' La faille se tient devant vous. Oserez-vous entrer ?",
                8: "Vous êtes entrés dans la faille sombre. La Voix grave vous a parlé à nouveau, 'Vous vous êtes fait avoir, encore une fois. Je n'arrive toujours pas à croire qu'une créature aussi stupide que vous ait pu me causer autant de problèmes. Enfin, cela n'a plus d'importance à présent : vous allez pourrir ici, loin de votre monde. Il n'y aura pas de baroud d'honneur. Vous dépérirez simplement. Votre mort sera sans gloire, sans valeur, sans but. Je vais vous laisser maintenant, pour toujours. Adieu.'. La bataille qui a suivie vous a semblé sans fin. Après avoir tué tout ce qui bouge, vous avez cogné sur les murs, souhaitant vainement quelque chose contre lequel continuer à combattre dans cet exile. Vous vous êtes épuisés, puis votre vision s'est assombrie. Lorsque vous avez repris connaissance, vous vous trouviez allongés dans l'herbe à l'extérieure du repaire des cultistes. 'Sachez que j'ai décidé de vous épargner. Votre obstination m'intrigue. Je prendrais plaisir à voir vos inutiles efforts se briser contre ma puissance. Ce sera plus divertissant que la dernière fois que j'ai plongé ce monde dans l'obscurité.' Vous vous êtes relevés brusquement et avez foncé dans la crypte ; les cadavres des cultistes recouvraient le sol. 'Je ne suis plus ici. Ces coquilles vides ont rempli leur mission. Mes racines sont désormais profondes et vous serrez bientôt à nouveau confrontés à mon pouvoir infini. J'attends ce jour avec impatience.'"
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
                1: "Un contact mystérieux vous a donné l'emplacement de l'l'entrepôt de Jekserah à Havrenuit. Il est clair que Jekserah cache un secret dans cet l'entrepôt. S'attaquer à cet l'entrepôt mettra probablement fin aux accords que vous avez avec elle. Cependant, elle a certainement un plan et vous allez y mettre un terme.",
                2: "L'l'entrepôt était empli de morts-vivants. Jekserah a utilisé le parchemin de nécromancie que vous lui avez fourni pour réveiller les morts entre les murs de la ville. Vous avez combattu jusqu'à l'arrière-salle et confronté Jekserah. Elle a juré de se venger et s'est échappée par une fenêtre pendant que vous combattiez ses gardes Inox. Après les avoir tués, vous avez cherché des indices de la Valrath, mais n'en avez trouvé aucun. Vous avez arrêté ses plans pour l'instant, mais après cette brève conversation il est clair que vous allez devoir la pourchasser avant qu'elle puisse mettre sa menace à exécution.",
                3: "Vous avez ignoré les avertissements d'Argeise, la garde de la cité, et continué de travaillé pour Jekserah. \"Machinations Sinistres\" est bien sûr une phrase troublante, mais la phrase \"récompense considérable\" prime à vos oreilles. Il n'y a plus aucune raison d'attaquer l'entrepôt."
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
                2: "Machination sinistre ou non, vous avez décidé que la phrase \"récompense considérable\" était plus pertinente. Comme vous vous y attendiez, la mine de diamant était infestée par des mineurs Vermlings. Ils étaient menés par un Contremaitre impitoyable qui a rapidement tourné les mineurs contre vous avec quelques coups de fouets. Une fois débarrassé du Contremaitre, les mineurs restants se sont éparpillés. Vous êtes retourné voir Jekserah pour récupérer votre récompense. Ses gardes du corps vous ont escorté à l'intérieur du manoir, qui semblait d'une certaine manière différent - plus tortueux et sombre. \"Merveilleux.\" Elle vous a échangé le diamant contre un sac rempli de pièces. \"Cela conviendra à merveille comme point focal pour l'incantation. Je me demande si les cultistes savaient seulement ce qu'ils avaient là. Avec ceci, je peux invoquer une armée entière de morts-vivants ! \" Elle s'est tournée vers vous avec une lueur étrange dans le regard. \" Alors ! Etes-vous prêts à renverser la milice d'Havrenuit et mettre le contrôle de la ville entre les mains de la Guilde des Négociants ? Ou peut-être n'avez-vous pas le courage de provoquer de vrais changements ? \"",
                3: "Vous avez décidé que \"machination sinistre\" passait avant \"récompense considérable\". Vous vous êtes attaqué à l'entrepôt de Jekserah et découvert ses plans secrets d'envahir la ville avec une armée de morts. Elle a cependant fui la ville. Il semble évident que la \"récompense considérable\" n'est plus à l'ordre du jour et qu'il n'y a plus aucune raison de se rendre à la mine."
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
                1: "Pendant que vous mettiez un terme aux activité d'un groupe de cultiste, vous vous êtes retrouvés face à une déchirure béante dans la réalité. Les cultistes étaient en train de réaliser une sorte de rituel sur la faille, qui déversait des formes cauchemardesques remplies de dents et de griffes. Une fois les cultistes et leurs partisans morts, la faille semble désormais en sommeil. Elle ne cesse pas cependant de vous perturber. Vous avez lancé une pierre au travers, qui a disparu dans le vide - vous vous demander si vous pouvez vous-même entrer dans la faille et si vous pourriez survivre à ce voyage. Oserez-vous entrer dans la faille ?",
                2: "Le voyage était loin d'être agréable. Aussitôt arrivés, vous avez été abordé par des démons envoyés par une Voix en colère. Une fois débarrassés des démons, la Voix vous a parlé à nouveau et vous a invité dans son royaume. Ayant déjà fait un pas vers l'inconnu, vous avez décidé que vous pouviez en faire un second. A l'intérieur du royaume de la Voix se trouvait une créature monstrueuse, qui vous a demandé de récupérer un artefact - ou de mourir par sa main sinon.",
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
                1: "La nécromancienne Jekserah a fui Havrenuit. Avant son départ, elle vous a menacé ; il est clair que vous devez à présent la pourchasser avant qu'elle puisse mettre ses menaces à exécution. Malheureusement, vous n'avez aucune idée de l'endroit où elle se trouve. La garde de la ville n'est pas d'une grande aide, mais Argeise vous a donné quelques pistes. Il y a une enchanteresse Esther en ville qui pourrait être capable de localiser Jekserah, mais elle a la réputation d'être un associé difficile. Une seconde piste repose sur l'un de vos contacts au sanctuaire du Grand Chêne, qui a entendu parler d'un temple dédié à une force invisible, qui répondra à toute question qu'on lui pose.",
                2: "Vous avez rencontré l'enchanteresse Esther Tourmente, à l'Os Tordu. Bien qu'un peu excentrique, elle a l'air tout à fait compétente. Vous avez gagné ses faveurs en lui rendant un service. Peut-être pourra t'elle maintenant vous aider à trouver Jekserah ?",
                3: "Vous avez visité le Temple du Prophète, mais vous étiez plus intéressé par les autres propositions de la Voix plutôt que dans le fait de trouver Jekserah. Le seul moyen de trouver Jekserah maintenant est de requérir l'aide de l'enchanteresse.",
                4: "Vous avez localisé le sanctuaire de Jekserah dans la Forêt des Dagues. C'est l'heure de mettre un terme à sa nécromancie.",
                5: "Après une bataille sanglante contre ses sbires morts-vivants, Jekserah a péri sous votre lame. Vous avez séparé sa tête de son corps et quitté sans trainer ce lieu rempli de corps démembrés. Vous avez ramené la tête au Capitaine de la Garde et avez reçu une prime substantielle en échange."
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
                1: "Jekserah a convoqué une armée de morts-vivants et prévoit d'envahir la ville! Vous devez avertir immédiatement les gardes !",
                2: "Vous avez couru pour avertir les gardes de la ville et avez pu monter une défense contre les vagues de morts-vivants qui se sont écrasées sous vos armes. Vous avez combattu les morts-vivants jusqu'au manoir de Jekserah, où vous avez mis un terme à sa vile nécromancie une fois pour toutes. Jekserah est morte par votre main.",
                3: "À moins que... Il y a quelque chose dans le plan de Jekserah, il a une certaine logique, sombre et tordue. Vous avez décidé de ne pas avertir les gardes, mais au lieu de cela, vous avez rejoint l'armée des morts-vivants de Jekserah pour renverser l'armée d'Havrenuit."
            },
            "stages": {
                0: "{1}",
                1: "{1}{2}",
                2: "{1}{3}"
            }
        },        
        12: {
            "name": "Ce que le cœur veux",
            "sections": {
                0: "Un de vos contacts au Sanctuaire du Grand Chêne connait un temple dédié à une force invisible qui répondra à toutes les questions qui lui seront posées. C'est une occasion en or de trouver ce que désire votre cœur.",
                1: "Lorsque vous avez finalement atteint le temple, une Voix vous a dit \" Je ne peux pas accepter de visiteurs pour le moment \". Avant de pouvoir vous y opposer, un groupe de golem de pierre s'est matérialisé devant vous. Mais il n'y avait aucun moyen que vous vous en alliez les mains vides. Après en avoir fini avec les monstres, la Voix vous a ensuite offert un choix entre une grande puissance, une grande richesse ou l'emplacement du nécromancien. ",
                2: "Le choix évident était un grand pouvoir. Vous n'êtes pas intéressé par l'or ou par de petites vengeances. La seule chose qui compte, c'est la capacité de mettre en œuvre votre volonté. La Voix vous a parlé d'un sanctuaire dans les Crêtes de Cuivre qui contient une source de grande Puissance.",
                3: "Quel genre de mercenaire seriez-vous si vous n'étiez pas payé? Une grande richesse est le choix évident ici. La Voix vous a parlé d'une île perdue dans la Mer de Brume qui contient des trésors oubliés depuis longtemps.",
                4: "Le pouvoir et la richesse ne signifient rien pendant que Jekserah respire encore. Vous insistez pour que la Voix vous indique l'emplacement de la néfaste Valrath. Elle vous a parlé d'un sanctuaire caché au fond du Bois du Cadavre."
            },
            "stages": {
                0: "{0}",
                1: "{0}{1}{2}",
                2: "{0}{1}{3}",
                3: "{0}{1}{4}"
            }
        },
        13: {
            "name": "L'Enchanteresse",
            "sections": {
                0: "Vous avez entendu des histoires d'une enchanteresse Esther à Havrenuit qui pourrait être en mesure de vous aider dans vos efforts. Cependant, elle est connue pour demander des tâches impossibles en échange de ses faveurs. Impossible ou non, vous avez besoin de son aide.",
                1: "À la suite d'une discussion dans le quartier des chaudières, vous avez trouvé l'Esther dans une taverne abandonnée et décrépite: l'Os Tordu. Le nom de la femme Esther est Tourmente et elle semblait un peu excentrique ... peut-être même un peu folle. Après quelques inquiétudes, elle a accepté de vous aider si vous pouviez récupérer un orbe de la Caverne Gelée dans les Crêtes de Cuivre. Les créatures à l'intérieur de la caverne n'étaient pas très heureuses de vous voir, mais vous les avez combattues malgré tout. Le dernier de vos adversaires étant mort, vous vous êtes approché de l'arrière de la chambre, où une petite sphère bleue flottait au-dessus du sol. Vous l'avez cachée dans votre sac à dos et vous êtes retourné à l'os tordu. Tourmente semblait assez appréciative de l'objet. Tourmente a disparu avec la sphère. Après ce qui ressemble à des heures d'attente, elle est revenue et a demandé nonchalamment de faire des expériences sur vous. Vous étiez un peu surpris, mais elle vous a assuré que c'est tout à fait sûr. De grandes quantités d'or, elle peut désormais améliorer certaines de vos capacités. Plus important encore, elle est également prête à vous faire des faveurs. "
            },
            "stages": {
                0: "{0}",
                1: "{0}{1}"
            }
        },
        14: {
            "name": "Une puissance illimitée",
            "sections": {
                0: "Vous avez appris l'emplacement d'un sanctuaire dans les Crêtes de Cuivre. Vos sources vous disent que ce sanctuaire est marqué des symboles de puissance et de force. Vous aimez bien les deux, donc le sanctuaire semble mériter d'être étudié." ,
                1: "Le sanctuaire a été une épreuve. \" La force engendre la force \" été inscrit dans une langue ancienne sur les murs. Vous avez démontré votre force en battant les gardiens du sanctuaire et en saisissant le sceau de la force. Le sceau vous a conféré une grande force, mais vous a également montré des visions d'un étrange alphabet runique. Peut-être que les symboles ont une signification plus profonde ? "
            },
            "stages": {
                0: "{0}",
                1: "{0}{1}"
            }
        },
        15: {
            "name": "Une histoire de Dragon",
            "sections": {
                0: "Vous avez entendu parler de grandes créatures volantes dans les Crêtes de Cuivre. Pourrait-il y avoir vraiment des dragons dans les montagnes ? Cela vaut la peine d'être étudié, les dragons pourraient représenter une menace sérieuse pour la ville.",
                1: "Votre objectif est le Rideau de Glace, la plus haute montagne des Crêtes de Cuivre. Sur votre chemin, vous avez été pris en embuscade par un groupe d'Inox et de démons. Leur coexistence était curieuse, mais votre objectif ultime est plus loin.",
                2: "L'ascension de la glace a été exténuante et ardue. Vous avez dû vous battre contre le froid, les loups et un nid de Wyvernes en colère. Cependant, vous avez atteint le fond de cette affaire de dragon. Au sommet du sommet se trouvait un lézard ailé gigantesque - qui pouvait parler. Il parlait d'une voix rocailleuse qui vous a surpris par son éloquence. En fait, il a demandé votre aide. \"Un groupe de Savvas m'a attaqué dans mon sommeil et a enlevé une de mes glandes de flammes, vraisemblablement pour l'étudier. Je ne peux pas laisser cette insulte impunie et j'apprécierais grandement que vous la retiriez de leur ville, tuant autant d'entre eux que possible dans le processus. Ou, si vous souhaitez coller au cliché \", dit la créature en soupirant, \" vous pouvez simplement m'attaquer. Tuer le dragon, sauver la princesse, et tout ça. Sauf que je n'ai pas de princesse, et je ne suis pas un dragon - juste un Wyverne qui a vécu longtemps et ne souhaite pas mettre fin à ses jours aujourd'hui. Donc, si vous m'attaquez, je riposterai et vous mourrez assurément. \""
            },
            "stages": {
                0: "{0}",
                1: "{0}{1}",
                2: "{0}{1}{2}"
            }
        },
        16: {
            "name": "L'ile au trésor",
            "sections": {
                0: "Vous avez entendu parler d'une île inconnue de la mer de Brume qui contiendrait de vastes richesses. Il est temps de louer un bateau.",
                1: "L'île était infestée de Vermlings sauvages. Cependant, aucun Vermling ne peut se tenir entre vous et un trésor. Vous avez pris d'assaut l'île et découvert les restes d'un navire abandonné dans lequel les Vermlings se réfugiaient. Le navire contenait une pléthore d'or ; Qui sait ce que les Vermlings pouvaient faire de cet or ? Vous avez en tout cas une bonne idée de l'utilisation que vous en ferez."
            },
            "stages": {
                0: "{0}",
                1: "{0}{1}"
            }
        },
        17: {
            "name": "Balade dans les égouts",
            "sections": {
                0: "L'approvisionnement en eau de Havrenuit semble avoir été empoisonné. On vous a demandé d'enquêter sur la source du poison. Malheureusement, cela signifie marcher péniblement dans les égouts. Beurk.",
                1: "Vous avez sauté à contrecœur dans les égouts pour enquêter sur le poison. Vous avez tué une pléthore de serpents, de limon et de Vermlings. Les Vermlings avaient campé autour d'une citerne qui semblait être la source du poison, mais après enquête, aucune des Vermlings morts n'avaient de poison. Il y a un passage au fond de la pièce qui mène plus profondément dans les égouts et, si vous pouviez respirer sous l'eau, vous pourriez entrer directement dans la citerne. Vous avez entendu parler d'une Enchanteresse à Havrenuit qui peut être en mesure d'aider avec ce genre de choses, mais on dit qu'elle est ... difficile à suivre. ",
                2: "Vous avez rencontré l'enchanteresse Esther, Tourmente, à l'Os Tordu. Bien qu'un peu excentrique, elle semble tout à fait compétente. Vous avez gagné sa faveur en l'aidant dans ses quêtes. Peut-être qu'elle peut maintenant vous aider à trouver un moyen de respirer sous l'eau ?",
                3: "Vous avez trouvé un chemin vers la source du poison. Il est temps de purifier l'eau.",
                4: "Les pompes à eau grouillaient de créatures impies et d'une corruption noire. Au moment où le combat s'est terminé, les murs et le sol étaient couverts de suintement noir, mais vous avez réussi à tout sortir des pompes. Elles ne vibrent plus, ce qui est un pas dans la bonne direction. Une simple patrouille pourra nettoyer les restes, maintenant que la présence sombre a été supprimée. "
            },
            "stages": {
                0: "{0}",
                1: "{0}{1}",
                2: "{0}{1}{2}",
                3: "{0}{1}{3}",
                4: "{0}{1}{3}{4}"
            }
        },
        18: {
            "name": "Fermer la faille",
            "sections": {
                0: "Tout en exerçant une activité pour le compte des cultistes, vous avez rencontré une faille noire béante dans la réalité. Les cultistes effectuaient une sorte de rituel sur la faille qui laissait entrer dans cette réalité des formes cauchemardesques horribles, pleines de dents et de griffes. Une fois les cultistes et leurs sbires morts, il semble que la faille sombre soit maintenant en sommeil. Ce n'est pas moins déconcertant, cependant. Vous vous êtes brièvement demandé si vous pouviez entrer vous-même dans la faille, mais trouver un moyen de fermer la faille est probablement la décision la plus prudente. Une enchanteresse à Havrenuit pourrait en savoir plus sur ce truc interplanaire. Elle est connue pour demander des faveurs impossibles avant d'aider quelqu'un. ",
                1: "Vous avez rencontré l'enchanteresse Esther, Tourmente, à l'Os Tordu. Bien qu'un peu excentrique, elle semble tout à fait capable. Vous avez gagné sa faveur en l'aidant dans ses quêtes. Peut-être qu'elle peut maintenant vous aider à trouver un moyen de fermer la faille ?",
                2: "Tourmente avait besoin d'un encensoir élémentaire de la crypte d'un élémentaliste mort depuis longtemps. Malheureusement, les cultistes qui habitaient la crypte n'étaient pas désireux de s'en séparer. Vous avez escorté Tourmente à travers la crypte jusqu'à ce qu'elle puisse sécuriser l'encensoir, qu'elle a utilisé pour se débarrasser rapidement des morts-vivants restants. Elle est maintenant prête à faire face à la faille. ",
                3: "... ou du moins elle l'était, avant que les nouveaux suzerains de démons de Havrenuit n'atteignent la ville et ne partent avec un artefact. Si vous voulez que Tourmente ferme la faille, vous devrez récupérer l'artefact du Démon Majeur. Il n'en sera probablement pas content. ",
                4: "Tout au long d'un rituel élaboré, vous et Tourmente êtes assaillis par des démons mécontents de votre intention de fermer la faille entre vos mondes. Cependant, une fois le rituel terminé, tous les démons sont aspirés dans la faille, et la déchirure s'est rétrécit en un point brillant, avant de disparaitre. En prime, vous semblez avoir considérablement aidé Tourmente dans ses recherches sur les améliorations. "
            },
            "stages": {
                0: "{0}",
                1: "{0}{1}",
                2: "{0}{1}{2}",
                3: "{0}{1}{2}{3}",
                4: "{0}{1}{2}{4}"
            }
        },
        19: {
            "name": "Exorcisme",
            "sections": {
                0: "Dans la faille entre les royaumes, vous avez rencontré un puissant démon. {Br} L'attaquer dans son propre royaume sera difficile, mais il est temps qu'il périsse.",
                1: "La faille a été neutralisée avant que vous puissiez affronter le démon dans son palais.",
                2: "Attaquer un démon dans son propre royaume a peut-être été un peu téméraire. Le démon était invulnérable, mais vous avez réussi à briser un autel de verre noir qui semblait contenir l'essence du démon. Avec sa destruction, le démon majeur s'est brisé en d'innombrables éclats de pierre. "
            },
            "stages": {
                0: "{0}",
                1: "{0}{1}",
                2: "{0}{2}"
            }
        },
        20: {
            "name": "L'artefact",
            "sections": {
                0: "Vous avez appris l'existence d'un puissant artefact près de la Rivière du Baiser du Serpent. Le trouver pourrait s'avérer très utile pour atteindre vos objectifs.",
                1: "Le Temple des Éléments était submergé par des cultistes. Les cultistes avaient utilisé le pouvoir de l'artefact pour renforcer leurs alliés démoniaques. Malgré leur force supplémentaire, les démons et leurs maîtres cultistes n'étaient pas en mesure de vous empêcher de détruire les autels protégeant l'artefact. Une fois les autels brisés, les démons ont disparu et la barrière de protection autour de l'artefact s'est dissipée. Vous vous êtes approché du centre du temple et avez tendu la main vers l'urne, mais vous vous êtes arrêté net. Vous avez senti une puissante obscurité émaner de la chose, et derrière cela, une profonde tristesse. Cet artefact a été corrompu, et il semble presque en être conscient. Toutes ces sensations vous ont traversé l'esprit comme un avertissement. L'artefact pourrait être utilisé pour faire le mal, mais vous battriez-vous pour ce mal ou contre lui ? Après quelques efforts, vous avez utilisé un chiffon épais pour mettre le récipient dans votre sac. Peut-être serait-il préférable de l'amener à un enchanteur plutôt que de jouer avec."
            },
            "stages": {
                0: "{0}",
                1: "{0}{1}"
            }
        },
        21: {
            "name": "De plus en plus profond",
            "sections": {
                0: "En essayant de découvrir la source de l'eau empoisonnée de Havrenuit, vous avez découvert un passage secret dans les égouts. Peut-être qu'il pourrait y avoir quelque chose d'intéressant à l'intérieur.",
                1: "Les mécanismes présents dans ce passage ont été activés par votre présence et ont donné vie à des sentinelles mécaniques. Vous avez pu faire taire l'alarme, ce qui a stoppé les sentinelles. Ces créations mécaniques peuvent être utiles à l'avenir, mais vous avez surtout trouvé un moyen d'atteindre la partie la plus profonde de la citerne. Malheureusement, vous devrez toujours vous mouiller si vous voulez aller plus loin. "
            },
            "stages": {
                0: "{0}",
                1: "{0}{1}"
            }
        },
        22: {
            "name": "Lorsqu'on entend des Voix",
            "sections": {
                0: "Les Inox et les démons que vous avez rencontrés sur le chemin du Rideau de Glace avaient des inscriptions grossières mentionnant une \" Voix \" parmi leurs affaires. Il y avait une grotte à proximité du col de la Montagne qui semblait vous appeler. Vous vous sentez une envie subtile et puissante d'explorer la grotte. ",
                1: "La grotte contient une créature puissante, connue uniquement sous le nom de \" La Voix \". Elle vous demande de l'aider à se libérer de l'esclavage, mais les motifs de La Voix restent incertains. "
            },
            "stages": {
                0: "{0}",
                1: "{0}{1}"
            }
        },
        23: {
            "name": "Une requête à Voix haute",
            "sections": {
                0: "La Voix est une créature tellement puissante. Vous devez en savoir plus sur ce qu'elle est et ses motivations.",
                1: "Un érudit Quatryl vous a informé que la Voix pourrait être un puissant démon lié pour une bonne raison. Bien qu'il soit un peu incertain de l'exactitude du texte auquel il faisait référence, il vous a mis en garde contre la libération de la Voix. Il vous a ensuite pointé du doigt vers un Sceptre qui pourrait renforcer le rituel de liaison. Vous l'avez récupéré d'un sanctuaire au bord du marais Stagnant. Il était rempli d'énergies sombres, et la Voix vous a supplié de ne pas mettre le Sceptre dans la chambre des échos. La Voix vous clame que vous avez été induits en erreur. Vous serez seul à en décider. "
            },
            "stages": {
                0: "{0}",
                1: "{0}{1}"
            }
        },
        24: {
            "name": "L'aide de Tourmente",
            "sections": {
                0: "Il y a quelque chose de profondément préoccupant à propos de l'artefact que vous avez récupéré dans le Temple des Éléments. Vous ressentez une obscurité puissante émanant de la chose, et derrière cela, une profonde tristesse. Cet artefact a été corrompu, et il semble presque être conscients de ce fait. Peut-être serait-il préférable de l’apporter à un enchanteur plutôt que de jouer avec. ",
                1: "Vous avez rencontré l'enchanteresse Esther, Tourmente, à l'Os Tordu. Bien qu'un peu excentrique, elle semble tout à fait capable. Vous avez gagné sa faveur en l'aidant dans ses quêtes. Cependant, vous avez remis l'artefact au démon majeur. Si vous voulez que Tourmente l'inspecte, vous devrez le récupérer. Il ne voudra probablement pas s'en séparer de bon cœur. ",
                2: "Un enchanteur pourrait peut-être vous en dire plus sur l'artefact. Cependant, vous avez remis l'artefact au démon majeur. Si vous voulez que l'enchanteur l'inspecte, vous devrez le récupérer du démon. Il ne voudra probablement pas s'en séparer de bon cœur.",
                3: "Vous avez rencontré l'enchanteresse Esther, Tourmente, à l'Os Tordu. Bien qu'un peu excentrique, elle semble tout à fait capable. Vous avez gagné sa faveur en l'aidant dans ses quêtes. Peut-être qu'elle peut maintenant vous en dire plus sur l'artefact ? ",
                4: "Tourmente a souligné que l'artefact était corrompu. Elle vous a envoyé plutôt brusquement dans la Dimension des ténèbres pour rompre l'enchantement de l'artefact. Vous avez réussi à rompre la connexion. De retour dans votre propre plan d'existence, Tourmente a mentionné trois endroits qui puisaient le pouvoir de l'artefact corrompu. Si vous voulez en savoir plus sur l'artefact, vous pouvez visiter ces emplacements. "
            },
            "stages": {
                0: "{0}",
                1: "{0}{1}",
                2: "{0}{2}",
                3: "{0}{3}",
                4: "{0}{4}"
            }
        },
        25: {
            "name": "La Voix",
            "sections": {
                0: "À l'intérieur d'une grotte dans les Crêtes de Cuivre, vous avez découvert une créature, connue uniquement sous le nom de \" La Voix \". La Voix a été piégée par une force puissante au plus profond de la terre. La Voix demande votre aide pour trouver des urnes qui lui permettront de prendre une forme corporelle, mettant fin à sa longue peine d'emprisonnement. ",
                1: "Vous avez récupéré la première urne des mains d'une secte d'Infestateurs. La Voix vous a dirigé vers l'emplacement de la seconde.",
                2: "L'arsenal de Savvas était difficile à briser, mais vous avez réussi à vous y glisser, à voler les objets nécessaires et à sortir avant que la garde ne vous en empêche. Il ne reste plus qu'une seule urne.",
                3: "La dernière urne était gardée par un réseau d'anciennes défenses. La Voix vous a montré un moyen de désactiver les défenses. Aux extrémités opposées du réseau, vous avez activé les interrupteurs dans l'ordre indiqué par la Voix. Au centre du réseau, une trappe a coulissé, révélant une échelle étroite descendant dans l'obscurité. \"Le chemin vers le tombeau est clair\", a déclaré la Voix. \"Allez maintenant, et récupérez ce qui est à moi.\" ",
                4: "Même si vous pensiez que le réseau de défense était désactivé, la tombe était toujours piégée. Vous vous êtes à peine échappés, vivants et avec les urnes intactes. Avec les trois urnes à la main, vous êtes retourné à la grotte de la montagne et dans la chambre des échos. Vous avez placé les petits pots en terre au centre de la caverne et avez attendu. C'était difficile de le remarquer au début, mais, après un certain temps, un léger tremblement dans le sol et dans les murs a commencé à croître jusqu'à ce qu'il soit difficile de rester debout. Puis il y a eu un flash de lumière, avant que vous ne vous retrouviez à flotter dans une brume verte tourbillonnante en forme de longues vrilles entrelacées. \"J'avais presque oublié ce que c'était que de ne pas être emprisonné.\" Pour une fois, vous avez entendu la Voix non pas de l'intérieur de votre tête, mais émanant de la figure devant vous. \"C'est assez merveilleux. Je suis sûr que d'ici peu j'oublierai cet horrible sentiment d'impuissance. Il est temps de quitter ce royaume \", a déclaré la Voix.\" Il y a beaucoup de chose à rattraper. Mais d'abord, je dois vous remercier sincèrement. Je tiendrai ma part du marché et vous accorderai un grand pouvoir et une grande richesse. \" La lumière verte se propage et vous illumine, vous procurant la plus merveilleuse sensation de chaleur. Et puis elle est partie. Il ne reste plus qu'une tablette de pierre au centre de la pièce avec d'étranges marques cryptiques. Peut-être que ces marques peuvent être utiles à l'avenir. ",
                5: "Vous n'en pouviez plus d'entendre ce son dans vos oreilles. Cette maudite Voix devait être réduite au silence et personne d'autre que vous n'aurait pu le faire."
            },
            "stages": {
                0: "{0}",
                1: "{0}{1}",
                2: "{0}{1}{2}",
                3: "{0}{1}{2}{3}",
                4: "{0}{1}{2}{3}{4}",
                5: "{0}{5}"
            }
        },
        26: {
            "name": "Le vol de l'Armurerie",
            "sections": {
                0: "Une créature puissante vous a ordonné de pénétrer dans un arsenal Savvas et de récupérer son trésor. Vous hésitez à pénétrer dans une installation aussi sécurisée, mais l'injonction de la créature est forte.",
                1: "Vous avez tué la puissante créature, mettant un terme à son influence sur vous. Vous ressentez toujours une envie de pénétrer dans l'armurerie, mais sans ordre direct, vous n'êtes pas assez audacieux pour essayer.",
                2: "Vous avez tué les deux puissantes créatures, mettant un terme à leurs influences sur vous. Vous n'avez plus aucune envie de pénétrer dans l'armurerie. C'est tout simplement trop fou.",
                3: "La volonté de la créature a été accomplie. L'arsenal a été pillé et vous possédez ses trésors. Bien qu'il soit peut-être préférable de ne pas montrer votre visage autour de la ville Savvas pendant quelques mois."
            },
            "stages": {
                0: "{0}",
                1: "{0}{1}",
                2: "{0}{2}",
                3: "{0}{3}"
            }
        },
        27: {
            "name": "Tueur de Dragon",
            "sections": {
                0: "Au sommet du Rideau de Glace, l'Ancienne Wyverne vous a demandé une faveur. N'a-t-elle pas entendu parler de vous ? Vous n'êtes pas en train de négocier avec des lézards. Il est temps de tuer un dragon.",
                1: "À bien y penser, avoir un dragon dans vos dettes peut s'avérer utile. Vous avez décidé d'aider l'ancienne Wyverne. Après tout, c'était la première Wyverne à ne pas essayer de vous manger.",
                2: "Vous n'aviez jamais imaginé qu'un 'dragon' serait aussi sournois lorsqu'il est en train de mourir. Malgré ses sarcasmes, la ville vous a plutôt bien payé pour avoir tué l'ancienne Wyverne."
            },
            "stages": {
                0: "{0}",
                1: "{0}{1}",
                2: "{0}{2}"
            }
        },
        28: {
            "name": "Une âme bien sombre",
            "sections": {
                0: "Vous avez récupéré l'artefact, comme le demandait le démon. Il est tout à fait clair que l'artefact a été corrompu. Si vous apportez cela au démon, il l'utilisera très certainement pour un grand et terrible mal.",
                1: "Vous avez scellé la faille sans remettre l'artefact au démon. De toute évidence, il ne fallait pas lui faire confiance avec un objet aussi dangereux et puissant.",
                2: "Vous avez remis l'artefact au démon, mais vous avez rapidement changé d'avis lorsque vous avez réalisé que son plan était de prendre le contrôle de Havrenuit. Vous avez averti les gardes de la ville et les avez aidés à combattre l'invasion des démons.",
                3: "Vous avez remis l'artefact au démon, qui a révélé qu'il utiliserait son pouvoir pour prendre le contrôle de Havrenuit. Un bon plan selon vous. Ces imbéciles de Havrenuit ne vous ont jamais apprécié de toute façon. Avec l'aide de l'armée des démons, vous avez décimé la garnison et abattu la garde. Havrenuit est maintenant sous la domination des démons. "
            },
            "stages": {
                0: "{0}",
                1: "{0}{1}",
                2: "{0}{2}",
                3: "{0}{3}"
            }
        },
        29: {
            "name": "Danser avec le diable",
            "sections": {
                0: "Vous avez récupéré l'artefact, comme l'a demandé le démon. Il est clair que l'artefact a été corrompu. Si vous apportez cela au démon, il l'utilisera très certainement pour un grand et terrible mal. Mais vous êtes prêt à trahir le démon et à combattre ce mal, quel qu'il soit. ",
                1: "Pourquoi prendre le risque? Vous avez scellé la faille sans remettre l'artefact au démon. De toute évidence, il ne fallait pas lui faire confiance avec un objet aussi dangereux et puissant.",
                2: "Après réflexion, l'offre du démon semblait plutôt séduisante. Vous vous êtes rangé du côté du démon, avez massacré la garde de la ville et installé les nouveaux suzerains du démon. Havrenuit est maintenant sous la domination des démons.",
                3: "Vous saviez que ce serait mauvais ... mais une invasion démoniaque de Havrenuit n'était pas ce que vous aviez en tête. C'était trop pour vous. Vous avez échappé à l'antre du démon et avez couru pour avertir la garde de la ville juste à temps. Les démons ont assailli la porte en nombre, mais vous avez pu tenir assez longtemps pour épuiser le démon principal. Il a réussi à franchir la porte, mais vous l'avez abattu et avez dispersé ses armées. Havrenuit est en sécurité pour l'instant, mais vous voudrez peut-être reconsidérer votre politique consistant à remettre de puissants artefacts à des créatures maléfiques. "
            },
            "stages": {
                0: "{0}",
                1: "{0}{1}",
                2: "{0}{2}",
                3: "{0}{3}"
            }
        },
        30: {
            "name": "Sous l'océan",
            "sections": {
                0: "Avec l'aide de Tourmente, l'artefact a été nettoyé de son influence corruptrice. Cependant, Tourmente a mentionné trois emplacements qui tiraient le pouvoir de l'artefact corrompu. Si vous voulez en savoir plus sur l'artefact, vous voudrez peut-être visiter ces emplacements. Un de ces endroits est profondément sous la mer de brume. Malheureusement, votre anatomie ne comprend pas un ensemble de branchies. Peut-être que Tourmente pourrait avoir un moyen de remédier à cela ? La connaissant, quelle la solution qu'elle trouvera sera p désagréable. ",
                1: "Plutôt désagréable était une hypothèse judicieuse. En tout cas, vous avez réussi à obtenir des appareils qui vous permettent de respirer librement sous l'eau. Il est temps d'enquêter sur l'un des endroits corrompus.",
                2: "Votre plongée vous a mené au fond d'une fosse. Vous avez dû faire face à la résistance des ténébreux gardiens protégeant ce que vous êtes venus trouver ici, mais vous les avez combattus malgré tout. Vous avez poussé vers l'avant, laissant la fosse misérable. En regardant derrière vous, vous avez vu les silhouettes de Rôdeurs attendant dans l'ombre, mais ils ne vous ont pas poursuivi. Peut-être ont-ils eu peur de tout ce qui vous attendait. Vous êtes allé plus profondément à travers une fissure dans la terre jusqu'à ce que votre chemin se déplace soudainement vers le haut. Vous avez recraché votre orbe permettant de respirer sous l'eau, reconnaissant de pouvoir enfin respirer normalement et de vous reposer un peu. À travers l'obscurité devant vous, vous avez vu une vaste caverne, qui abritait une structure en pierre massive. Cette vue artificielle, si éloignée de tout ce que vous connaissez, vous a rempli d'une terreur irrationnelle et inquiétante. ",
                3: "Vous vous êtes promené dans l'énorme structure de pierre sous les vagues pendant ce qui semble être des heures. Et juste au moment où vous aviez l'impression de ne pas pouvoir aller plus loin, vous avez senti sa présence. Quelque chose de vieux et de puissant vous attendait au bout de ce couloir. Il vous a appelé, vous invitant à grimper dans sa gueule ouverte, embrassant la douce libération de l'infini. C'est ce que vous étiez venu combattre, mais sans même l'avoir vu, vous avez été rempli d'un désespoir sans fin. Vous ne pouviez même pas rêver de vaincre une telle une créature. Vous avez secoué la tête et essayé de vous prémunir contre ces sentiments négatifs - après tout, vous n'aviez pas avalé ces sphères respiratoires et nagé au fond de l'océan pour échouer maintenant. Vous deviez détruire cette menace. Vous avez pris votre courage à demain, ainsi que vos lames. Une fois l'œil géant mort, tous ses serviteurs ont dépéri et sont morts avec lui. Heureusement, la salle a cessé de trembler elle aussi. Vous ne pouviez pas sortir de la même façon dont vous êtes entré, mais vous étiez libre d'explorer la structure plus en avant, sans l'effroi écrasant qui imprégnait l'air auparavant. C'est un long voyage, mais vous êtes sorti de la fosse, retourné au bateau et retourné à Havrenuit, résolus à ne plus jamais refaire ça. "
            },
            "stages": {
                0: "{0}",
                1: "{0}{1}",
                2: "{0}{1}{2}",
                3: "{0}{1}{2}{3}"
            }
        },
        31: {
            "name": "Ce qui se cache dans les bois",
            "sections": {
                0: "Avec l'aide de Tourmente, l'artefact a été nettoyé de son influence corruptrice. Cependant, Tourmente a mentionné trois emplacements qui tiraient le pouvoir de l'artefact corrompu. Si vous voulez en savoir plus sur l'artefact, vous voudrez peut-être visiter ces emplacements. Un de ces endroits se trouve au fond de la Forêt des Dagues. ",
                1: "Tourmente vous a guidé vers un groupe d'Orchids qui pourraient vous guider à travers la forêt labyrinthique. Lorsque vous arrivez au camp des Orchids, cependant, vous avez trouvé quelque chose de totalement inattendu :  une scène de massacre et de dévastation. Bâtiments incendiés et cadavres défigurés. À en juger par les blessures, vous pensez qu'un groupe de pillards Inox a fait cela. Heureusement, les Inox n'ont pas ressenti le besoin de couvrir leurs traces. Vous avez été en mesure de suivre leur trace plus profondément dans les bois, où finalement vous avez trouvé un camp de travaux forcés - des gardes Inox surveillant un groupe d'Orchids et d'êtres humains en lambeaux travaillant à la construction de catapultes et d'autres machines de guerre. Le camp n'est pas particulièrement bien protégé contre les intrus, et, après avoir éliminé quelques gardes, vous avez pu vous glisser dans les enclos des esclaves et libérer l'un des Orchids. Il accepte de vous guider à travers la forêt, mais seulement après l'avoir aidé à se venger des Inox. Vous avez peu de choix en la matière car il s'est précipité sur l'un des Inox. Une fois le dernier Inox tombé, l'Orchid vous a remercié. \"Ils ont tué ma famille à leur arrivée. Ils ont dit que mes enfants n'étaient pas des travailleurs suffisamment forts. \" Il se présente comme Rougépine et accepte de vous emmener plus profondément dans la forêt. ",
                2: "Rougépine vous a conduit profondément dans la forêt des dagues. Finalement, une fine brume grise a commencé à se lever et vous êtes tombé sur une clairière lugubre et morte.\" C'était autrefois le cœur de la forêt \", murmure Rougépine.\" Inaccessible par tout moyen normal. Sûr et parfait. Et puis il est venu. Maintenant, cet endroit n'abrite plus que des horreurs et des cauchemars. \" L'Orchidée regarde la terre noire. \"Vraiment, cet endroit me terrifie. Quelles que soient les créatures qui hantent ces ombres, je ne peux pas vous aider à les combattre, mais si vous survivez, je vous montrerai le chemin du retour.\" Alors que Rougépine disparaissait dans la brume, vous avez commencé à voir d'autres formes bouger au bord de votre champ de vision. Et puis vous avez entendu les sabots, comme un terrible tonnerre roulant à travers les arbres. Le son s'est rapproché de plus en plus et même le sol sous vos pieds s'est mis à trembler. Le Cavalier Sombre allait et venez dans la brume apparemment au hasard. Le monstre fût difficile à frapper, mais finalement le spectre sans tête a hurlé lorsque vous l'avez frappé une dernière frappe, et sa forme s'est dissipé d'une manière horrible. Rougépine est apparu dans le brouillard qui commençait à se dissiper. \"Je ne sais pas comment vous avez fait, mais je peux déjà sentir la vie reprendre ses droits. Cela prendra du temps, mais je pense que le cœur de la forêt retrouvera un jour sa splendeur.\""
            },
            "stages": {
                0: "{0}",
                1: "{0}{1}",
                2: "{0}{1}{2}"
            }
        },
        32: {
            "name": "Balade en montagne",
            "sections": {
                0: "Avec l'aide de Tourmente, l'artefact a été nettoyé de son influence corruptrice. Cependant, Tourmente a mentionné trois emplacements qui tiraient le pouvoir de l'artefact corrompu. Si vous voulez en savoir plus sur l'artefact, vous voudrez peut-être visiter ces emplacements. Un de ces emplacements est situé au sommet des Crêtes de Cuivre. ",
                1: "Vous avez escaladé les sommets gelés des Crêtes de Cuivre, déplorant que le lieu où Tourmente vous a envoyé se trouve être l'endroit le plus impitoyable et inhospitalier possible. En escaladant les montagnes, vous avez été pris en embuscade par des personnages en capes sombres et des démons de glace, alors que vous tentiez de franchir un fossé. Une Voix a retenti au-dessus du vent hurlant. \"Vous n'êtes pas les bienvenus ici, mortels. Tout ce qui vous attend est l'étreinte de la mort.\" Vous pouviez à peine voir à travers le blizzard, mais vous étiez déterminé à vous assurer que la mort embrasse plutôt quelqu'un d'autre. Alors que vous vous battiez contre les ennemis et les éléments, vous avez échappé à la tempête et trouvé un semblant d'abri dans une grotte. Un orbe d'un blanc brillant se trouvait derrière les démons cristallins qui occupaient la grotte. Les pièces du puzzle commençaient toutes à se mettre en place. Ces démons contrôlaient les éléments ici, bloquant votre passage vers le pic. Vous avez détruit l'orbe et les cris du vent à l'extérieur de la grotte ont diminué jusqu'à n'être que des faibles murmures. Vous êtes sorti et avez trouvé un ciel clair au-dessus de vous, ainsi qu'un chemin vers le sommet. À cette altitude, sans nuage à perte de vue, vous vous êtes émerveillés devant l'étendue merveilleuse des montagnes, des forêts et des plaines au-delà. Vous pouviez même voir le faible contour de Havrenuit au loin. ",
                2: "Une fois l'autel de glace détruit, grimper le reste du chemin vers le haut de la montagne fût heureusement sans incident. Vous vous amusiez presque, admirant la vue sur toute la campagne, quand la vue est soudainement devenue sombre, bien qu'il ne soit que midi. Vous étiez très proches du sommet maintenant, et vous avez supposé que ce développement avait quelque chose à voir avec la présence maléfique au sommet. Un crissement aigu a retenti, et vous vous êtes accroupis en plissant les yeux dans l'obscurité. Près du sommet, vous avez vu de nombreuses formes sombres grouillant et se tordant, comme si la montagne elle-même était vivante. En plissant les yeux plus loin, vous avez remarqué que la contraction se déplaçait vers le bas de la montagne vers vous. Il semble que votre présence ne soit pas passée inaperçue. Vous avez préparé vos armes et vous vous êtes préparé à vous frayer un chemin jusqu'au sommet.  Le cri strident a percé à nouveau vos oreilles, et un démon massif avec une multitude de griffes acérées et d'ailes coriaces a atterrit devant vous. \"Vous osez vous approcher de mon nid ? \" Vous pouviez à peine distinguer les mots de ses gémissements aigus: \"Je vais récolter vos cadavres et les donner en pâture à mes enfants!\" Vous vous êtes battu contre le démon et ses «enfants» jusqu'à ce que finalement, le démon n'en puisse plus. Le démon géant a hurlé une dernière fois, son timbre et son intensité se modulant sauvagement. Ne voulant pas se rapprocher de ses griffes, vous avez attendu que la créature expire. Quand ce fût le cas, une immobilité a envahi la zone et le jour est apparu à nouveau dans le ciel au-dessus de vous. La vue est majestueuse, hormis le sang et les entrailles qui jonchent le pic. Vous avez repris votre souffle et puis lentement commencé à redescendre la montagne, convaincu que le mal qui se cachait ici ne dérangera plus Havrenuit. "
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
              0: "À l'intérieur d'une grotte dans les Crêtes de Cuivre, vous avez découvert une créature liée par un sortilège, connue uniquement sous le nom de\" La Voix \". Depuis, vos oreilles n'ont pas cessé de sonner. Sur les conseils d'un érudit Quatryl, vous avez récupéré un Sceptre de liaison, rempli d'énergie sombre, depuis un sanctuaire au bord du Marais Stagnant. Si vous apportez le Sceptre dans la chambre de la Voix, vous pourrez renouveler le lien et faire taire cette maudite Voix une fois pour toutes. ",
              1: "Vous avez décidé que le moyen le plus simple de faire taire la Voix était simplement de lui donner ce qu'elle voulait. La Voix a été libérée et n'habite plus la chambre des échos.",
              2: "Tandis que vous vous teniez dans la grotte de la montagne, Sceptre à la main, la Voix vous a appelé.\" Vos intentions sont nobles. Vous me craignez et souhaitez me garder emprisonné. Je comprends, mais ce que vous faites ne conduira qu'au désastre et la ruine. Ce Sceptre n'a pas été créé pour renforcer ma prison. Je l'ai créé ! Je l'ai utilisé pour emprisonner l'un de mes plus grands ennemis - un être de mort et de haine. Je ne sais pas ce qui se passera lorsque vous apporterez cette chose à ma chambre, mais je peux vous garantir qu'il n'en sortira rien de bon ! \" Vous avez bloqué les mensonges de la Voix de votre esprit et avant que la Voix ne puisse dire un autre mot, vous avez soulevé le Sceptre et canalisé son pouvoir. La Voix cria une fois de plus, mais il n'y avait pas de cohérence dans le son - seulement de la douleur. Le brouillard commença à se dissiper et, pendant un moment, vous avez ressenti un soulagement, jusqu'à ce que vous vous rendiez compte que vous n'étiez plus dans la chambre d'écho, mais dans un endroit sombre et hostile. La Voix a retenti à nouveau, son timbre était désormais différent : \"Le pouvoir de la Voix est désormais mien ! Vous serez le premier à y succomber ! \" Après une bataille acharnée, vous avez coupé les cordes vocales de la Voix. La Voix ne parlera plus jamais. "
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
                1: "Il vous faut un moyen de respirer sous l'eau. Il y a une enchanteresse Esther à Havrenuit qui connait peut-être quelque chose à ce sujet. Mais tout le monde sait qu'elle demande des faveurs impossibles avant d'aider quelqu'un...",
                2: "Vous avez rencontré l'enchanteresse Esther, Tourment, à l'Os Tordu. Bien qu'un peu excentrique, elle semble tout à fait compétente. Vous avez accompli une de ses requêtes et avaient ainsi gagné son aide. Peut-être peut-elle maintenant vous aider à trouver un moyen de respirer sous l'eau ?",
                3: "Tourment vous a envoyer piller un nid de Wyvernes pour leurs écailles. Ils n'étaient pas très désireux de s'en séparer, mais votre lame était très convaincante. Tourmente a utilisé les écailles pour former des orbes bleus plutôt inconfortables qui devraient vous permettre de respirer sous l'eau. Ignorez simplement la sensation de brûlure douloureuse, c'est normal. "
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
                1: "Vous avez récemment libéré un Orchid nommée Rougépine  d'un camp d'esclaves Inox dans la Forêt des Dagues. Après une vengeance cathartique contre ses ravisseurs, il vous a demandé de l'accompagner dans un village voisin qui aurait pu subir le même sort que son propre village. ",
                2: "Sur le chemin du village, Rougépine  a exprimé son inquiétude que les Inox soient devenus de plus en plus agressifs. Peut-être que si vous découvriez ce qui cause leur comportement, vous pourriez mettre fin à ces incursions ? Vous avez eu peu de temps pour contempler ces pensées, puisque vous êtes arrivé juste à temps. Les Inox étaient venus à bout des défenses du village et se préparaient à massacrer les Orchids capturés. Rougépine  et votre groupe sont entrés en action, sauvant tous les captifs et anéantissant les envahisseurs Inox. Le village des Orchids est à présent en sécurité. "
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
                2: "Avant d'avoir pu enquêter sur le camp rebelle, vous avez aidé à évincer les démons et à installer un groupe différent de suzerains à Havrenuit.",
                3: "À la demande du seigneur démon, vous vous êtes dirigé vers le Marais Stagnant pour détruire les derniers vestiges de l'opposition au règne démoniaque. À l'aide de totems magiques permettant d'assécher le marais inhospitalier, les rebelles avaient érigé un camp. Vous avez écrasé l'opposition rebelle et ses totems, et regardé le campement s'enfoncer lentement dans la boue. Un des soldats mourants vous a divulgué l'emplacement des rebelles restants. Ils tomberont bientôt sous votre épée. "
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
                1: "À la demande du seigneur démon, vous avez anéanti un campement rebelle dans le marais. L'un des gardes mourants a divulgué l'emplacement des forces rebelles restantes. “ Mais seulement parce que je sais que vous n'êtes pas vraiment mauvais. Au lieu de nous chasser et de vous battre avec nous, aidez-nous à reprendre la ville contre ces démons. Dirigez-vous vers l'est, à la frontière des Montagnes du Gardien. Cherchez au nord de la forêt de frênes. Parlez avec le commandant. Aidez-nous à libérer la ville ... ”{Br} Folie. Maintenant vous savez exactement où frapper. Il n'y aura pas de survivants.",
                2: "Peut-être qu'il y avait quelque chose de vrai dans ce que vous ont dit ces gardes après tout. Vous avez aidé à évincer les démons et à installer un groupe entièrement différent de suzerains à la tête de Havrenuit.",
                3: "En suivant les instructions données par le garde mourant, vous avez pu facilement localiser le camp rebelle. Le pauvre fou pensait que vous vous joindriez aux rebelles pour aider à renverser les démons, mais ces espoirs étaient puérils et infondés. Vous étiez ici pour tuer et détruire. Sans hésitation, vous vous êtes déchaîné à travers le camp dans les contreforts des Montagnes du Gardien. Vous avez incendié leurs tentes et tué quiconque se tenait devant vous. Le dernier bataillon de gardes a hésité alors qu'il vous a fait face, puis les humains se sont retournés et ont fui. \"Préparez l'arme de siège ! \" L'un d'eux s'est écrié alors qu'ils gravissaient la colline. Vous a poursuivi. Cela fût intéressant. En combattant à travers la première vague de soldats, vous êtes arrivé à une clairière. Les autres gardes se tenait autour d'un très gros canon mécanique. Les gardes ont fait feu sur vous plusieurs fois, mais vous avez enduré les volées de canon et tué les gardes alors que vous avanciez. Finalement, le canon se tenait brisé à vos pieds, et avec lui, tout espoir que les rebelles avaient d'attaquer Havrenuit. Les gardes encore vivants se sont éparpillés vivants, et vous êtes revenu victorieux à Havrenuit, gouverné par les démons. \"Donc, vous avez écrasé les pathétiques rebelles ? \" Vous vous êtes tenu devant l'un des agents du Premier Démon. \"Bien. Vous avez prouvé que vous étiez un outil incroyablement efficace, et mon maître vous récompensera grandement pour votre service.\" "
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
                1: "À la demande du seigneur démon, vous avez anéanti un campement rebelle dans le marais. L'un des gardes mourants a divulgué l'emplacement des forces rebelles restantes. “ Mais seulement parce que je sais que vous n'êtes pas vraiment mauvais. Au lieu de nous chasser et de vous battre avec nous, aidez-nous à reprendre la ville contre ces démons. Dirigez-vous vers l'est, à la frontière des Montagnes du Gardien. Cherchez au nord de la forêt de frênes. Parlez avec le commandant. Aidez-nous à libérer la ville ... ”{Br} Hmm. Travailler pour un démon n'a pas tourné comme vous le pensiez. Il est peut-être temps de rejoindre l'alliance rebelle.",
                2: "Mais d'un autre côté, ce n'est pas mieux d'être du côté d'un groupe de rebelles perdants. Au lieu de cela, vous avez aidé à évincer les démons et à installer un groupe entièrement différent de suzerains à la tête de Havrenuit.",
                3: "Mais d'un autre côté, ce n'est pas mieux d'être du côté d'un groupe de rebelles perdants. Vous avez utilisé les instructions du garde pour localiser la base rebelle et les avez tous abattus.",
                4: "Vous avez suivi les instructions de la garde morte dans les contreforts des Montagnes du Gardien. Pas pour tuer et détruire, mais pour aider. Les rebelles semblent méfiants au début, mais ils finissent par vous accueillir. \" Vous pourriez être notre arme secrète. Si vous pouviez vous emparer de l'armurerie de la forteresse fantôme juste au moment où nous franchissons le mur nord, nous pourrions alors converger vers la forteresse et tenir. Une fois que nous serons correctement armés et que nous vous aurons à nos côtés, les démons n'auront aucune chance. La plupart des citoyens sont mécontents de leur occupation et se lèveront quand ils verront que nous avons l'avantage. \" Trois jours plus tard, vous vous êtes faufilé dans la forteresse fantôme et avez pris d'assaut l'armurerie. Vous avez sécurisé l'armurerie juste au moment où les combattants rebelles ont pénétré dans la forteresse. Eliminer les démons du reste du bâtiment fût rapide après cela. Avec une forte présence dans la ville et la population de votre côté, la tendance s'est retournée rapidement contre les démons. La bataille fût encore longue et difficile, car de plus en plus de forces arrivaient du plan élémentaire, mais elle n'a fait finalement que rapprocher les habitants de Havrenuit, luttant contre un ennemi commun. Et comme vous ne vous battiez plus pour eux, la force démoniaque a fini par céder et s'est replié vers sa dimension. Les prochaines semaines furent difficiles, car les citoyens ont reconstruit les murs et tout ce qui avait été détruit lors de la bataille prolongée. Ils eurent besoin de temps pour vous faire à nouveau confiance après votre trahison. Mais Havrenuit s'est reconstruite avec le temps. Les choses ne seront jamais comme avant, mais au moins, on se sent toujours comme à la maison. "
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
                3: "Avant que tourmente n'ai pu vous expliquer quoi que ce soit, une colonne immense de sable noir a émergé du nord-est de l'Os Tordu. Tourment a pointé fermement en direction du nuage de sable tourbillonnant, tout en vous tendant une sacoche pour vous protéger de ses effets néfastes. Entrer dans le vortex s'est avéré extrêmement douloureux, mais le contenu de la sacoche vous remplissait d'un engourdissement bienvenu. Après un certain temps, vous vous êtes retrouvés au milieu d'une large salle en pierre couverte d'étranges symboles runiques. Il y régnait un froid surnaturel, et la douleur diffuse du Vide persistant encore. \"Ceux qui sont assez courageux pour pénétrer en ces lieux seront les premiers à mourir,\" résonne une Voix tout autour de vous. \"Les autres seront de toute façon chassés et inéluctablement dévorés, mais je prendre plus de plaisir à annihiler les premiers.\" Vos yeux s'accoutumaient peu à peu à la pénombre, et vous parveniez à distinguer une silhouette éthérée au centre de la salle. Vous distinguez un Esther porteur de deux lames longues et effilées. \"J'ai patienté de nombreuses années pour faucher cette récolte,\" a t'il repris avec un sourire cruel. \"Pendant un moment, je m'étais convaincu que je prendrais plus de plaisir à vous regarder vous entretuer peu à peu, mais après l'intervention de ma confrérie et la mort de mes geôliers, j'en suis revenu au plan initial. Je ne suis pas mécontent de ce revirement. Même la patience d'un immortel a ses limites.\" Les lames de l'Esther se sont mises soudain à virevolter au rythme de la chorégraphie macabre qu'il entame. \"Venez à moi, mes agneaux. Qui sera le premier à embrasser l'Ombre ?\" La bataille a fait rage pendant ce qui vous a semblé des siècles, mais finalement, les deux épées sont tombées au sol avec un tintement métallique. L'Esther est resté un instant immobile, une lueur d'incrédulité traversant son visage balafré. \"Comment osez-vous,\" a t'il murmuré d'une Voix devenue désormais menaçante et éraillée. \"J'ai attendu des milliers d'années et vous prétendez me priver des fruits de mes travaux ?\" La mort a décrispé les mâchoires de l'Esther, mais son corps tenait encore, comme suspendu par des cordes invisibles. \"Vous pouvez détruire ce corps et me bannir de cette dimension, mais ce ne sera jamais suffisant. Je suis éternel. Je reviendrai. Je me repaîtrai de ce monde une fois encore !\" A ces mots, le corps de l'Esther s'est effondré, puis a disparu. La douleur sourde s'est estompée, et vous avez remonté l'escalier à la lumière du jour. Plus de secousses ni de vortex de sable noir. Tous les habitants de Havrenuit rassemblés autour de vous ont émis un soupir de soulagement lorsque vous avez émergé des profondeurs. Vous avez expliqué aux citoyens la nature du péril dont vous les avez protégés. Ils se sont réjouis et ont loué votre courage."
            },
            "stages": {
                0: "{1}",
                1: "{1}{2}",
                2: "{1}{2}{3}"
            }
        },
    }
}
