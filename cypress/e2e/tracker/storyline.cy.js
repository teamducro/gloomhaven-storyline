import utilities from "../utilities";

describe('Storyline', () => {

    it('It loads the storyline', () => {
        cy.visit('/tracker');

        cy.get('#chapter1').should(($chapter) => {
            expect($chapter).css('display', 'inline');
        });
    });

    it('It switches between landscape and portrait', () => {
        cy.visit('/tracker');

        cy.get('.landscape').should(($node) => {
            expect($node.length).to.be.greaterThan(4);
        });

        cy.get('.portrait').should(($node) => {
            expect($node).to.have.length(0);
        });

        cy.viewport(500, 800);

        cy.get('.landscape').should(($node) => {
            expect($node).to.have.length(0);
        });

        cy.get('.portrait').should(($node) => {
            expect($node.length).to.be.greaterThan(4);
        });
    });

    it('It can complete a scenario', () => {
        cy.visit('/tracker');
        utilities.isNodeVisible(1);
        utilities.isNodeHidden(2);

        utilities.completeScenario(1);
        utilities.isNodeVisible(2);
    });

    it('It can incomplete a scenario', () => {
        cy.visit('/tracker');
        utilities.completeScenario(1);

        utilities.isNodeVisible(2);

        utilities.incompleteScenario(1);

        utilities.isNodeHidden(2);
    });

    it('It cant complete scenarios in read only mode', () => {
        cy.visit('/tracker');

        utilities.setReadOnly().then(() => {
            utilities.completeScenario(1);

            utilities.isNodeHidden(2);
        });
    });

    it('It reveals chapters', () => {
        let alerted = false;
        cy.on('window:alert', message => alerted = message);

        cy.visit('/tracker?states=1_c-2_c');

        cy.window().then((window) => {
            expect(alerted.includes('deprecated')).to.be.true;
        });

        cy.get('#chapter1').should(($chapter) => {
            expect($chapter).css('display', 'inline');
        });

        cy.get('#chapter2').should(($chapter) => {
            expect($chapter).css('display', 'none');
        });

        utilities.completeScenario(3);

        cy.get('#chapter1, #chapter2').should(($chapter) => {
            expect($chapter).css('display', 'inline');
        });
    });

    it('It blocks blocked scenarios', () => {
        cy.visit('/tracker?states=1_c-2_c-3_c-8_c');

        utilities.isNodeBlocked(9);
        utilities.openScenario(9);
        cy.get('#complete').should(($radio) => {
            expect($radio).attr('disabled', 'disabled');
        });
        utilities.closeModel();
    });

    it('It blocks required scenarios', () => {
        cy.visit('/tracker?states=1_c-2_c-3_c-8_c');

        utilities.isNodeRequired(7);
        utilities.openScenario(7);
        cy.get('#complete').should(($radio) => {
            expect($radio).attr('disabled', 'disabled');
        });
        utilities.closeModel();
    });

    it('It blocks required side scenarios', () => {
        cy.visit('/tracker?states=1_c-64_i');

        utilities.isNodeRequired(64);
        utilities.openScenario(64);
        cy.get('#complete').should(($radio) => {
            expect($radio).attr('disabled', 'disabled');
        });
        utilities.closeModel();
    });

    it('It unlocks required scenarios', () => {
        cy.visit('/tracker?states=1_c-2_c-3_c-8_c');

        utilities.isNodeRequired(7);

        utilities.completeScenario(14);

        utilities.isNodeVisible(7);
        cy.get('#node7 .required').should(($radio) => {
            expect($radio).css('display', 'none');
        });

        utilities.openScenario(7);
        cy.get('#complete')
            .should('not.have.attr', 'disabled');
        utilities.closeModel();
    });

    it('It unlocks required side scenarios', () => {
        cy.visit('/tracker?states=1_c-2_c-4_c-6_c-7_c-8_c-14_c-20_c-18_c-64_i');

        utilities.isNodeRequired(64);

        utilities.completeScenario(43);

        utilities.isNodeVisible(64);
        cy.get('#node64 .required').should(($radio) => {
            expect($radio).css('display', 'none');
        });

        utilities.openScenario(64);
        cy.get('#complete')
            .should('not.have.attr', 'disabled');
        utilities.closeModel();
    });

    it('It can share side scenarios', () => {
        cy.visit('/tracker');

        cy.get('#node52.opacity-50').should(($node) => {
            expect($node).to.have.length(1);
        });

        cy.visit('/tracker?states=52_i');

        utilities.isNodeVisible(52);
        cy.get('#node52.opacity-50').should(($node) => {
            expect($node).to.have.length(0);
        });
    });

    it('It can open a scenario via url', () => {
        cy.visit('/tracker/#/story/1');

        cy.get('#scenario-title').contains('#1 Black Barrow');
    });

    it('It shows summaries', () => {
        cy.visit('/tracker');

        utilities.openScenario(1);

        cy.get('#scenario-content').contains('Preceding events');
        cy.get('#scenario-content label').contains('Complete').click();
        cy.get('#scenario-content').contains('Summary').click();
        cy.get('#scenario-content').contains('Jekserah');

        utilities.closeModel();
    });

    it('It opens FC', () => {
        cy.visit('/tracker');

        utilities.switchGame('fc');

        cy.get('#chapter20').contains('Diviner');
        utilities.isNodeIncomplete(96);
        utilities.completeScenario(96);
        utilities.isNodeComplete(96);
        utilities.isNodeIncomplete(97);
    });

    it('It opens JotL', () => {
        cy.visit('/tracker');

        utilities.switchGame('jotl');

        cy.get('#chapter4').contains('Characters');
        utilities.isNodeIncomplete(1);
        utilities.completeScenario(1);
        utilities.isNodeComplete(1);
        utilities.isNodeIncomplete(2);
    });

    it('Storyline renders correclty', () => {
        cy.visit('/tracker#/shared/1/local/N4Rohg5gwgSgRALlGAzgbTgcVgWTgXQF8AacCAQRgBVFl0tK5iGomH5nNzXPHef2bLgK4cWQvuN5jhEmdzkSRk2dKWL+BEuAAKAMQDKtcAHcQARlIBjAPaWQAGxAAGbWB0ApHcbBn7t+ydXUncAEQAhHz9rO1Igt0wqHD0oixjAlzcdclCAUVT-WMdMkMSdfKRTNJAAuJLdA1ZK32ra4uDwRJgAOQL0uo6wWWbomqL40sYRlxjnOvME8hppwoBWAdIAWzB69yp4Ff72rKoANSbkUbaJ3SpQi6rCjMH9B5angazyAEk+seeElRcqE-tddjoqAZTqDxuCzstLq1YS87gjHkcbnsqGj3hjwTByDCASFsnciZ9JlQAEzk46lM4pQ7-CmdADqkSZYMGmFyAHk3lcbABmFlDPlQGmc5EJcVC2mYnm8zDy3ZcKhyqXE25UXqa0WJUKEvV0kAoAAWoCsZrAwDgzkQaTg5gdljgksdGsdABYXcxVr64AA2AMAdgDAA4AwBOAPme0IR3mZ0J13md2pz2pn0p5jmf05p3BgvmMMpkhwKwASwALgBPWhOgPp5iZ5jZx35x1Fx2lx2Rgsx4vxxPJxPNp2tp3t1Od1Pd1O91P9xODx1U4euqmjzfjqmTqnT5hU2dH+dHxdH5eb1euoUblujuZwIXup9Cz1v9tvztv7tv3tvsub6rk+XrDqBj5tq+bYfm2X5tj+bZ-m2AFtkBbYgX64F+pBcCrNBeGwXh8F4YheHIXhqF4eheGYUG2FBrhgYEYGRGBiRgZkYGFGBlRgY0YGdEhgxIa4SGBEhkRIYkSGZEhhRIZUSGNEhnR4YMeGuHhgR4ZEeGJHhmR4YUeGVHhjR4Z0VG4HaAAJsxcwgJWtm2tufoBkKN5tm5cBelefrjqsXlBmecDCaGYkSVJMlyQpSkqWpGlaTpekGUZJlmRZVn3nAUa4VGBFRkRUYkVGZFRhRUZUVGNFRsFcYMXGuFxgRcZEXGJFxmRcYUXGVFxjRcZ0UmOVJs1aaxuY7XmJ1eYOk+Sa9SW825uYg3mMN64rU6W7bWm45pu1B57ceJ29VS-VUoNVLDXesZCs1L73ZOU2dUK3VCr1Qr9UKg2eXtYEA81XqtV67Vep1XrdV6vVev1fkA8NqyNaszX4Xtqwvash5OqsJ6471qwXrj-m4-VgaNYGPnmMxe2sbG7Hbd0YC6hY2gAA6VlTpAAE55swPM2GAtkNj546Tjj+OhcTpP1aN1MHS9ONzcWoXLcWpMbU2OW7QWVK7vuOOnXroUXU2pM3R5OUPdtT0Jm+RFCiR722xR322zR-3222DFerhIPbWDgckVDgcUXDgc0V6dHI9tqNxwRmNxyReNxxRRNxzRQXbRTOdMSxbEcVxPF8QJakpfN2gAK62qNTYeQGks59tMuVycKqOdsbMkgAEgYFSIh87RbDsCwkuEHKD3inej4sVDZlPzImkMSz5ovXJZAYBzr8iI-d7orJGNMjm2I5QR79yuAdycOhH4iJ82GfMwgF3LzkDgOJmA-T8z+C9wd3vMenRsTeGNAqAA0t8UBO8vSih0AKJEWohiQJ0JKHeSDMAoI1Og-UKCF7oiXpiHQmAQRgL-gPAhG9e7QModKEkORr6lGyDCKk+pshoNoRggwn9EEshQBAM0ABaZMoAUDVhqKQasGAwxEFIPwoRHCxE1G0PIwR2DTTiKsJIjAnEtByIEYI-BSitEgCkc+SMSE9GmgMWvDREjTEYB9JeKxqiiyiM0dovC9pZHWKEaWdxyj9FCP7AEkxZj44+NUYOAJAAjFRBi4zGGMZ4pMLiEnqKtPzOxYSMCJMiQkoxHiHFumDPkoRKtQnxPKW47JKS0nlP8bU4pol6nCJCU0sx9MynCOiR03JMiqmCK2pUYxgzdahJSf6bp+sklFLMbtaZ6jknFP+swcSrTjojLmdI7xYzbHsysHAWyPNIA2AAHZQDNDYSsVgACmzo5HbOohsmpyzOmlLGY00ZQShntLeRgJ60zen-N8s6bpd0tmBN8WokRfSgwxnBYozRgz3zGAOUck5EBzmXOuXch52SUWFJADEzxe5Wku0hXEn5n1ZnEpRV8p50cmDR3BX8p5ltwXAqeZJVpgNIU5N8gMn5ftaUCuOt0gOlLBlB35Z4l2EqiVWGla8xlkYJUMvsWYtabAM4SrZZqnRPpunx1lcU1YHyfno35YMpO1rLWKptRqgVcojw0mNfqpVPyqaisGbTU14SEW+qWU8ia3TGb+owIGr1tjvnQu4qKlJwYWwWrjU6lJRrfUerlXKMNXKoWqPChGoMrSWl2uhesstBbg35oMdJBNxStrdPkvWsxskS1OsGcpH1PzNItp0WqwZ2k0VWFYXC2m3TdLduhfpPtvk3WDJKlOqJMbkU-NSZCs0nipkqIAGZWEERVWdeVWmWVnVNNgQdzwnv1WaQdGrb09pVSAB90Kiq0pfVE2FsaolIqcru-dVUl17oPe0q0TpnCsLakwEABz7AgtUi44DdVjBgY6sQLq0GDmjpBWVRD+6GrDrg9ypNcBDJ4eEc4L9Ty32ROAy1Wdik2DGXI1BotvbaP4ecIqzxpkWPOBXQa0jLrSMDrkXR5wT6P3ifvf+ij7SDkigJWJzjeaBXqTYIujjwjEmVEyTNR5gmZ1abGoRgzan53Ke0w6yzSZq2etNHRipcLD3dOsrSysg74wBI85a1TvqvN2J89C1OkKguqPXGguAJyzm2RsJsAA+jWW5CXqw81uagKuaWVqBbGc4bBUWwAxbi4l6syX4upfSygTLtzstKLCwY9cC8CtFYS0llLaWMtZe9jln56417Ndi610r7XKvVdq+I+rCiJMNmi4NkrZWKudZq91uruX-EDeK218rHWqtdefqt3rzgQkbaGwtnbY2VsTdy9Ek782RtLfG3+3rOnbSzc28N7bo29uOQO9CrcIjbtbcW7t5b+2rvPci290792QePcm0M89SBAcfeBxdsHT2-szRm4VubQPzvfYM-Drc-Wod3c+w9y7GPws02xy1snqOCc9cx+t0neOvug5++DzHx3Wco-xxzwnhBCBAA/story');
        let expectedData = JSON.parse('{"achievementgroup-CR":{"achievements":["GCRM"]},"achievementgroup-ART":{"achievements":["GAR","GAC","GAR","GAC","GAR","GAC","GAR","GAC","GAR","GAC","GAR","GAC","GAR","GAC","GAR","GAC","GAR","GAC","GAR","GAC","GAR","GAC","GAR","GAC"]},"achievement-PFS":{"awarded":true,"count":1,"lost":false},"achievement-PJP":{"awarded":true,"count":1,"lost":false},"achievement-PDB":{"awarded":true,"count":1,"lost":false},"achievement-GTMF":{"awarded":true,"count":1,"lost":false},"achievement-PADE":{"awarded":true,"count":1,"lost":false},"achievement-GTPE":{"awarded":true,"count":1,"lost":false},"achievement-PSC":{"awarded":true,"count":1,"lost":false},"achievement-GTRN":{"awarded":true,"count":1,"lost":false},"achievement-GAC":{"awarded":true,"count":1,"lost":false},"achievement-GAR":{"awarded":false,"count":0,"lost":true},"achievement-GAT":{"awarded":true,"count":5,"lost":false,"manual_awarded":false},"achievement-PTR":{"awarded":true,"count":1,"lost":false},"achievement-PTVC":{"awarded":true,"count":1,"lost":false},"achievement-PTDC":{"awarded":true,"count":1,"lost":false},"achievement-PFC":{"awarded":true,"count":1,"lost":false},"achievement-PAI":{"awarded":true,"count":1,"lost":false},"achievement-GTED":{"awarded":true,"count":1,"lost":false},"achievement-PTSV":{"awarded":true,"count":1,"lost":false},"achievement-PTVT":{"awarded":true,"count":1,"lost":false},"achievement-PTDT":{"awarded":true,"count":1,"lost":false},"achievement-PTTT":{"awarded":true,"count":1,"lost":false},"achievement-PRA":{"awarded":true,"count":1,"lost":false},"achievement-PATD":{"awarded":true,"count":1,"lost":false},"achievement-GAT2":{"awarded":true,"count":1,"lost":false},"achievement-GTVF":{"awarded":true,"count":1,"lost":false},"achievement-GWB":{"awarded":true,"count":1,"lost":false},"achievement-GEOC":{"awarded":true,"count":3,"lost":false},"achievement-GEOC2":{"awarded":true,"count":1,"lost":false},"achievement-GEOC3":{"awarded":true,"count":1,"lost":false},"achievement-GEOG":{"awarded":true,"count":1,"lost":false},"achievement-GAT3":{"awarded":true,"count":1,"lost":false},"achievement-PTTN":{"awarded":true,"count":1,"lost":false},"achievement-GTDA":{"awarded":true,"count":1,"lost":false},"sheet":{"archivedCharacters":{},"characterUnlocks":{"BR":true,"CH":true,"SW":true,"TI":true,"SC":true,"MT":true,"DS":true,"EL":true,"SB":true,"SS":true,"SK":true,"NS":true,"SU":true,"BE":true,"QM":true,"PH":true,"BT":true,"DR":true},"characters":{},"city":{"1":true,"2":true,"3":true,"4":true,"5":true,"6":true,"7":true,"8":true,"9":true,"10":true,"11":true,"12":true,"13":true,"14":true,"15":true,"16":true,"17":true,"18":true,"19":true,"20":true,"21":true,"22":true,"23":true,"24":true,"25":true,"26":true,"27":true,"28":true,"29":true,"30":true},"donations":620,"itemDesigns":{"1":true,"5":true,"19":true,"23":true,"33":true,"39":true,"41":true,"44":true,"45":true,"48":true,"52":true,"53":true,"59":true,"66":true,"69":true,"70":true,"90":true,"96":true,"97":true,"98":true,"99":true,"100":true,"101":true,"103":true,"104":true,"107":true,"108":true,"110":true,"111":true,"112":true,"115":true,"116":true,"122":true,"123":true,"130":true,"132":true,"133":true,"153":true,"154":true,"155":true,"158":true,"161":true,"163":true,"NaN":true},"prosperityIndex":61,"reputation":15,"road":{"1":true,"2":true,"3":true,"4":true,"5":true,"6":true,"7":true,"8":true,"9":true,"10":true,"11":true,"12":true,"13":true,"14":true,"15":true,"16":true,"17":true,"18":true,"19":true,"20":true,"21":true,"22":true,"23":true,"24":true,"25":true,"26":true,"27":true,"28":true,"29":true,"30":true},"unlocks":{"0":true,"1":true,"2":true,"3":true,"4":true,"7":true},"xClues":{"1":false,"2":false,"3":false,"4":false,"5":false,"6":false,"7":false,"8":false,"9":false}},"achievement-PT":{"awarded":true,"count":1,"lost":false,"manual_awarded":true},"achievement-PHSE":{"awarded":true,"count":1,"lost":false,"manual_awarded":true},"achievement-PBB":{"awarded":true,"count":1,"lost":false,"manual_awarded":true},"achievement-GAT4":{"awarded":true,"count":1,"lost":false},"achievement-GAT5":{"awarded":true,"count":1,"lost":false},"achievement-PSR":{"awarded":true,"count":1,"lost":false,"manual_awarded":true},"achievement-PWS":{"awarded":false,"count":0,"lost":false,"manual_awarded":false},"achievement-GCRM":{"awarded":true,"count":1,"lost":false},"achievement-PTPS":{"awarded":false,"count":0,"lost":false,"manual_awarded":false},"achievement-PAMT":{"awarded":false,"count":0,"lost":false,"manual_awarded":false},"achievement-PDC":{"awarded":true,"count":1,"lost":false,"manual_awarded":true},"achievement-GTTP":{"awarded":true,"count":1,"lost":false},"achievement-GKIP":{"awarded":true,"count":4,"lost":false},"achievement-PC":{"awarded":true,"count":1,"lost":false},"achievement-GKIP2":{"awarded":true,"count":1,"lost":false},"achievement-GKIP3":{"awarded":true,"count":1,"lost":false},"achievement-GKIP4":{"awarded":true,"count":1,"lost":false},"achievement-PGD":{"awarded":true,"count":1,"lost":false},"achievement-PDE":{"awarded":true,"count":1,"lost":false},"achievement-PHP":{"awarded":true,"count":1,"lost":false},"achievement-PAD":{"awarded":true,"count":1,"lost":false},"achievement-GPA":{"awarded":true,"count":2,"lost":false},"achievement-GPA2":{"awarded":true,"count":1,"lost":false},"achievement-GST":{"awarded":true,"count":1,"lost":false},"scenario-gh-1":{"state":"complete","treasures":["7"]},"scenario-gh-2":{"state":"complete"},"scenario-gh-3":{"state":"complete","treasures":["65"]},"scenario-gh-4":{"state":"complete","treasures":["38","46"]},"scenario-gh-5":{"state":"complete","treasures":["4","28"]},"scenario-gh-6":{"state":"complete","treasures":["50"]},"scenario-gh-7":{"state":"complete"},"scenario-gh-8":{"state":"complete","treasures":["51"]},"scenario-gh-9":{"state":"blocked"},"scenario-gh-10":{"state":"complete","treasures":["11"]},"scenario-gh-13":{"choice":15,"state":"complete","treasures":["10"]},"scenario-gh-14":{"state":"complete","treasures":["26"]},"scenario-gh-15":{"state":"complete"},"scenario-gh-16":{"state":"complete","treasures":["1"]},"scenario-gh-17":{"state":"complete","treasures":["71"]},"scenario-gh-18":{"state":"complete","treasures":["63"]},"scenario-gh-19":{"state":"complete","treasures":["17"]},"scenario-gh-20":{"state":"complete"},"scenario-gh-21":{"state":"complete","treasures":["15"]},"scenario-gh-22":{"state":"complete","treasures":["21"]},"scenario-gh-23":{"state":"complete","treasures":["39","72"]},"scenario-gh-24":{"state":"complete","treasures":["70"]},"scenario-gh-25":{"promptChoice":"dragonChoice1","state":"complete","treasures":["58"]},"scenario-gh-26":{"state":"complete","treasures":["66"]},"scenario-gh-27":{"state":"complete"},"scenario-gh-28":{"state":"complete","treasures":["32"]},"scenario-gh-29":{"state":"complete","treasures":["41"]},"scenario-gh-30":{"state":"complete"},"scenario-gh-31":{"state":"complete","treasures":["69"]},"scenario-gh-32":{"state":"complete"},"scenario-gh-33":{"promptChoice":"dragonChoice1","state":"complete"},"scenario-gh-34":{"state":"blocked","treasures":["23"]},"scenario-gh-35":{"state":"blocked"},"scenario-gh-36":{"state":"blocked"},"scenario-gh-37":{"state":"complete","treasures":["49"]},"scenario-gh-38":{"state":"complete","treasures":["29"]},"scenario-gh-39":{"state":"complete","treasures":["73"]},"scenario-gh-40":{"state":"complete","treasures":["47"]},"scenario-gh-41":{"state":"complete","treasures":["24"]},"scenario-gh-42":{"state":"blocked"},"scenario-gh-43":{"state":"complete","treasures":["35"]},"scenario-gh-44":{"state":"complete"},"scenario-gh-46":{"state":"complete","treasures":["48"]},"scenario-gh-47":{"state":"complete","treasures":["18","57"]},"scenario-gh-48":{"state":"complete","treasures":["64"]},"scenario-gh-51":{"state":"complete","treasures":["56"]},"scenario-gh-52":{"state":"complete"},"scenario-gh-53":{"state":"complete"},"scenario-gh-54":{"state":"complete"},"scenario-gh-57":{"state":"complete","treasures":["3","22"]},"scenario-gh-58":{"state":"complete"},"scenario-gh-61":{"state":"complete"},"scenario-gh-62":{"state":"complete","treasures":["59"]},"scenario-gh-63":{"state":"complete","treasures":["12"]},"scenario-gh-64":{"state":"complete","treasures":["9"]},"scenario-gh-65":{"state":"complete"},"scenario-gh-66":{"state":"complete","treasures":["16","36"]},"scenario-gh-67":{"state":"complete","treasures":["14"]},"scenario-gh-68":{"state":"complete","treasures":["33"]},"scenario-gh-69":{"state":"complete"},"scenario-gh-70":{"state":"complete","treasures":["6"]},"scenario-gh-71":{"state":"complete"},"scenario-gh-72":{"state":"complete"},"scenario-gh-73":{"state":"complete"},"scenario-gh-74":{"state":"complete","treasures":["20"]},"scenario-gh-76":{"state":"complete","treasures":["75"]},"scenario-gh-77":{"state":"complete"},"scenario-gh-78":{"state":"complete"},"scenario-gh-81":{"state":"complete","treasures":["68"]},"scenario-gh-82":{"promptChoice":2,"state":"complete","treasures":["62"]},"scenario-gh-83":{"state":"complete"},"scenario-gh-84":{"state":"complete","treasures":["42"]},"scenario-gh-94":{"state":"complete"},"scenario-gh-95":{"state":"complete"},"scenario-gh-11":{"state":"hidden","treasures":["5"]},"scenario-fc-96":{"state":"complete","treasures":["91"]},"scenario-gh-89":{"state":"complete","treasures":["13","43","27"]},"scenario-gh-88":{"state":"hidden"},"scenario-gh-87":{"state":"hidden"},"scenario-gh-86":{"state":"hidden"},"scenario-gh-93":{"state":"hidden"},"scenario-gh-91":{"state":"complete"},"scenario-gh-92":{"state":"incomplete"},"scenario-fc-97":{"state":"complete"},"scenario-fc-98":{"choice":"102,103","promptChoice":1,"state":"complete","treasures":["79"]},"scenario-fc-99":{"choice":"104,105","promptChoice":2,"state":"complete","treasures":["95"]},"scenario-fc-100":{"promptChoice":1,"state":"complete","treasures":["76","85"]},"scenario-fc-101":{"state":"complete","treasures":["93"]},"scenario-fc-102":{"state":"complete","treasures":["77","86"]},"scenario-fc-103":{"state":"complete","treasures":["81"]},"scenario-fc-104":{"state":"complete","treasures":["87"]},"scenario-fc-105":{"state":"complete","treasures":["83","88"]},"scenario-fc-106":{"state":"hidden"},"scenario-fc-107":{"state":"hidden"},"scenario-fc-108":{"promptChoice":3,"state":"complete"},"scenario-fc-109":{"state":"complete","treasures":["80","94"]},"scenario-fc-110":{"choice":114,"state":"complete","treasures":["84"]},"scenario-fc-111":{"promptChoice":1,"state":"complete","treasures":["82"]},"scenario-fc-114":{"state":"complete"},"scenario-fc-113":{"state":"complete"},"scenario-fc-115":{"state":"complete","treasures":["96"]},"scenario-gh-90":{"state":"incomplete"},"scenario-gh-80":{"state":"incomplete"},"scenario-gh-59":{"state":"complete"},"scenario-gh-60":{"state":"incomplete"},"scenario-gh-55":{"state":"incomplete"},"scenario-jotl-1":{"state":"incomplete"},"sheet-jotl":{"archivedCharacters":{},"characterUnlocks":{"RG":true,"DM":true,"HT":true,"VW":true},"characters":{},"city":{"1":true,"2":true,"3":true,"4":true,"5":true,"6":true,"7":true,"8":true,"9":true,"10":true,"11":true,"12":true,"13":true,"14":true,"15":true,"16":true,"17":true,"18":true,"19":true,"20":true,"21":true,"22":true},"itemDesigns":{},"prosperityIndex":1,"road":{},"unlocks":{},"xClues":{}}}');

        // check GH scenarios
        for (let id = 1; id <= 95; id++) {
            let data = expectedData['scenario-gh-' + id];
            utilities.checkNodeState(id, data ? data.state : 'hidden');
        }

        utilities.switchGame('fc');

        // check FC scenarios
        for (let id = 96; id <= 115; id++) {
            let data = expectedData['scenario-fc-' + id];
            utilities.checkNodeState(id, data ? data.state : 'hidden');
        }

        cy.visit('/tracker#/shared/1/local/N4Rozg5gFgtAjAIgFyjAFxASwL4BpwBmAxjAJwBsyqGO+YUwCAhgE5FSYBuApgCYDCUVkyJpuLMFTwJ2w0eICqAOwA2AeyIBrSSgQAhAErIQcXAn4AJY6YQBlAOrWzAFQCSTu-w8BZZx4AiRkgmeCCywNJEmGgAnlQIiME2AEweAMweACweAKwelElmAOweABwepB5wAAxViSZmcKmFCRktcNntee0FDQkl7eXtlS3JtaP1Kc19yW0znTPdM70pAzNDMyN9aeMh+Ji8EfgADpg2LGpMvPGTZtM2czYLNks2K8VlFVW7NnC3CfdGo9Gs9Gq9Gu9+lUNr8tikfnd-slAQhZh5kqDUeDUZDkmsUjC7nCzDtrKEAK5HBAAD34KnJ3B0jHq1TuxlZCDmHIWHKWHN6HLWHI2HK21WwoTAACs1GgVPAqOAMERpPRuNw0DAZXL4qx2Fw+II5GIJFIzLIWCITcp1FomQgDABxALeDwWPwtABqjiSoXCkWicV0SPSWVy+Q8+LMhIQxISCIS-yaVWBCUxcGxcEhcCjCRjcDjY3RSPuoQOzMxyRjyTjaX+aVTaVeoVO50u1xQFKptPpjKkku18ua1DCA9l8raI5VdEHME6U7Hcpg3QXM-HMAKq-As4GI4ARov5UMt9L1yMT7Oaor0KO10u-tflYf4MOlSAD3f5XBJ2-p9v1wWj63v+94rr+z5ZkBf6nveu7gZ+MBFigb60CBQ6vje0GzhiUHPskiQXuuaLITeqEwUOYGkRKQA');
        expectedData = JSON.parse('{"scenario-gh-1":{"state":"incomplete"},"scenario-fc-96":{"state":"incomplete"},"sheet":{"archivedCharacters":{},"characterUnlocks":{"BR":true,"CH":true,"SW":true,"TI":true,"SC":true,"MT":true,"DR":true},"characters":{},"city":{"1":true,"2":true,"3":true,"4":true,"5":true,"6":true,"7":true,"8":true,"9":true,"10":true,"11":true,"12":true,"13":true,"14":true,"15":true,"16":true,"17":true,"18":true,"19":true,"20":true,"21":true,"22":true,"23":true,"24":true,"25":true,"26":true,"27":true,"28":true,"29":true,"30":true},"itemDesigns":{},"prosperityIndex":1,"road":{"1":true,"2":true,"3":true,"4":true,"5":true,"6":true,"7":true,"8":true,"9":true,"10":true,"11":true,"12":true,"13":true,"14":true,"15":true,"16":true,"17":true,"18":true,"19":true,"20":true,"21":true,"22":true,"23":true,"24":true,"25":true,"26":true,"27":true,"28":true,"29":true,"30":true},"unlocks":{},"xClues":{"1":false,"2":false,"3":false,"4":false,"5":false,"6":false,"7":false,"8":false,"9":false}},"scenario-jotl-1":{"state":"complete"},"sheet-jotl":{"archivedCharacters":{},"characterUnlocks":{"RG":true,"DM":true,"HT":true,"VW":true},"characters":{},"city":{"1":true,"2":true,"3":true,"4":true,"5":true,"6":true,"7":true,"8":true,"9":true,"10":true,"11":true,"12":true,"13":true,"14":true,"15":true,"16":true,"17":true,"18":true,"19":true,"20":true,"21":true,"22":true},"itemDesigns":{"14":true,"28":true,"29":true,"31":true,"33":true,"35":true},"prosperityIndex":1,"road":{},"unlocks":{},"xClues":{}},"scenario-jotl-2":{"state":"complete"},"scenario-jotl-3":{"state":"complete"},"scenario-jotl-4":{"state":"complete"},"scenario-jotl-5":{"state":"complete"},"scenario-jotl-6":{"state":"complete"},"scenario-jotl-7":{"state":"blocked"},"scenario-jotl-8":{"state":"complete"},"scenario-jotl-9":{"state":"complete"},"scenario-jotl-10":{"state":"complete"},"scenario-jotl-11":{"state":"complete"},"scenario-jotl-12":{"state":"blocked"},"scenario-jotl-13":{"state":"complete"},"scenario-jotl-19":{"state":"complete"},"scenario-jotl-15":{"state":"complete"},"scenario-jotl-16":{"state":"complete"},"scenario-jotl-17":{"state":"complete"},"scenario-jotl-20":{"state":"incomplete"},"scenario-jotl-22":{"state":"complete"},"scenario-jotl-24":{"state":"complete"},"scenario-jotl-21":{"state":"complete"},"scenario-jotl-23":{"state":"incomplete"},"scenario-jotl-25":{"state":"incomplete"}}');

        utilities.switchGame('jotl');

        // check JOTL scenarios
        for (let id = 1; id <= 25; id++) {
            let data = expectedData['scenario-jotl-' + id];
            utilities.checkNodeState(id, data ? data.state : 'hidden');
        }
    });

    it('unlocks scenarios from treasures', () => {
        cy.visit('/tracker#/shared/1/local/N4Rozg5gFgtAjAIgFyjAFxAYwL4BpzQwBMADEcqhgJZ4GykDMF41tk9JALM+iDfu2IkArD1YDCpAGxi+bSSQDss-uABmmGAE4ZKFnPwBDCAGEASs0NgA2ggDi5gLIIAurUMOzzvYYDuIOHxMAHtAkAAbEBJ3AAUAMQBlS38wkLDI6Il6WRwsmCY9XgAjeVhuQoxcuhhRCqxSmF1KeqMYgCkY5ICg0PwM2IARACEu1N6IqIaADhz3OwAVRzjRnvTJvOU6qsE4AtBMKDhhAUqGuHLm7cIj2aMFmIBRFaxx-rzSW+q4EhUzrV+8nAmvpVDsZlsGkRwc1QZI9vorvRgbxETBOPCUXMAILzZ5pPpRfAAW0M6xAhhi8wsPhSqwJmXJ8RMeNeZMERHIEKMECxZlxPhs9l5CFwQuZbjuwpphJeJAJcAaDEQXOqDFqlAQACcAKYARwArlQdQATBCK5FoLV6w0ms2S5nSsZrBmCBibS6K6EIxX-OqqClmLEs50NTgXEGhr28f12ADqI0ddImDIp8zTwfpofdEcB2d4UDYalgPz9hdgyphZaEFZz6g4nMrAiLQgx4jrQnD0arpHVtbAzekAPAACtgmhwvAh2BMGBJ6WBDOahaDOBF8I823p7PhFHN2vfY3V7OpCXD1vGjWuwvjw2+4upK2V+epJ298flzRsEA/story');
        utilities.isNodeHidden(17);

        // Unlock treasure
        utilities.openScenario(37);
        cy.get('#treasure-49').click();
        utilities.closeModel();

        utilities.isNodeIncomplete(17);
    });

    it('is shows boss icon', () => {
        cy.visit('/tracker#/shared/1/local/N4Rozg5gFgtAjAIgFzAQJwIYDsAmB7AWwH0BLAFwFNiy0KMwBXW5EABgBpwyQBjAX04YACgDEAyslAYA7iDiceeeSAA2bAeGgwATJPTZ8xclSI06jZkjacw3fja0BmPZlyFSlarXpMKLDlwgJBqQsAAsLgbuxl7mvv423MEOsNqsuij6bkaept4WflYBtkEhWmnOma6GHiZmPpbWgcmaqawRVVE5dfnxRYmlKTqsAKyR2bWxDYVNJS2hwwBs4zUxeXGNxUllbQDsK9G59QUJzSEAZjwwAJzLnRNrx32z24IQAMIASpIg9ADaCAA4l8ALIIAC6GgwwM+YJQv1kykUyjUrD4fCAA/story');

        utilities.openScenario(2);
        cy.get('.mdc-dialog.mdc-dialog--open .mdc-dialog__title img.boss').should('be.visible');
    });

    it('manual requirements', () => {
        cy.visit('/tracker#/shared/1/local/N4RozgZgFgtADAIgFzAQJwIYDsAmB7AWwH0BLAFwFNiy0KMwBXW5EOAGnDJAGMBfDyLACMyUAAduAFjbps+YuSpEadRsySsBXPgOgwATHBEpZuQqUrVa9JhRbtOIEv3B7D+0afkWlKm+s1HZ11YQwBmT0wzBUtlazU7DQcwLmDXULhJSLlzRStVW3stJxdBAzgAVmzon3z-RMCUkpDygDZq7zy4goDk1NK3DtzYvwSixwAjAdgIkyjOkfjCpOKdBDwANwo0ABsMAE8YPQB1TzFaMAosMhYhaZgslB4oBFa2AHY2AA4EDgkhGTzYa+Ja9Vb3dpzHIxEE9Bp9ZrpGDvIYwupjFaOHRIn5QmpdUbLRr9DgYADCFIAyqIQBgAO4gAE8PD6Dg7Vj3ISzVBAtHderjJppMpCR486G1fkY4k8FzkqkeJ70xkcbh4JnsuBysmU6lKhlMtUajktfSK8X4xZwwXae5hbleYHool9dAUACODBItBwCF4vCAA/story/fh');

        utilities.isNodeRequired(33);
        utilities.isNodeHidden(42);

        utilities.openScenario(33);
        cy.get('#complete').should(($radio) => {
            expect($radio).attr('disabled', 'disabled');
        });

        // Unlock and complete scenario.
        cy.get('#scenario-content label').contains('Incomplete').click();
        utilities.completeScenario(33);

        // Next scenario should be available.
        utilities.isNodeRequired(42);
    });

});
