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
        cy.visit('/tracker#/shared/1/local/N4Rohg5gwgSgRALlGAzgbTgcVgWTgXQF8AacCAQRgBVFl0tK5iGomH5nNzXPHef2bLgK4cWQvuN5jhEmdzkSRk2dKWL+BEiBQBGWjoAuIAMalDGAOxbSYAAoAxAMoGwAdxC7SJgPZeQADYgAAzaKABMBijGJmEAzFEx5hgAbACsNuB2AFJ2rh7+vv5BoaQoACyJpslwcQAcbOUpmSgZSEbVIBZwlczhDURlze3Rnd1pwZn2ACIAQvme3n6kJWHWIzFhDRtjGGn6g+CYVDgOC4XLgSFhAJxVAEZhupM7Zl0Yugfa9uTTAKLnJbFa5lXQJdomAAWujSZSS7zgzxaukqrxq4WahzAxzsAPa7kWpkuq1BbVAo1ioOG5Ph3S+oPWNN2cEs9J0um2TLe3RSCUOejuaIRumsWLsTlY+IKQJWIJ04ReXLC4X0QrpGSxxxgADlAUTgaV5ZE1RgVVNZFLCUVZYbsYxLcElo6rrpleCuTU4ndmJZIpryDRLRdYVdnQBbMBy+xUeBBmWh5Woj0IyyTMVUABqkuQ0v1NuVZJAAAcTHAACYAJ0gPgAdlBIT4AJYmACm+jhzLSA2+dio02z4Fz1oTZQxVW5qUxPYcA4JFwNysZHUp8s5y89fp75AAknrhyT5YLk91ymzsVQ-tM98S5Sg4orlz2qE4M9eF2U4qrj6k7vy4salQ-d1i1LStqzrBtmzbJhH1sXsM0DHMrRvW1e2mRDB2Q98dDiJMOnudE+XiQtRkeD9qXw+IlwpGpyl-J8qAwud4wPO81xohFwnouCYHIN98w-I91xTIi4IDK84zzEcdHKB8OJPUVvi4KgAMw+cBJkr9hO6cJKk1TMzkk-db3KVTSLCcpgPkjA4g1JSAHV5iMlCLLwikLIo6yem7WxMD+AB5Wchx8OINIqajaQ+BpmDSRTfICqBVOYqTWPKdjIrgFI9KUhLgOS4zDVaLSvLSKd4v8zB+Ok1ozM2Mo0isuqdDSNymtaCLmQSPpN3q9LTDCFJiralJas7bidF5ccal0HqJta5lxpQdJxwGzyMt0ZpmDiMqjgDPLguwpaOonRFsqGPqTriUSJqE9yylTKaER2lBWRW+7RpXF7Gv6+75pOhUWksNbmUsOz7uOtYLq2IbmRSHydDqVSS3CDsTpGlo6m+z66j+2jZpQG4-oY3VnMOm4SKa89pj40mws+KpIRqMGdEhUAoTAYA4BeRZEUQHnjR58EedRHm2h54YefWHnth5wUeaRBB5dVeWBa8REhbVlE+c1sXNYlzWpddZgTEbQwAE9aG0MsRudRsy055W1d1ra5bV09teYNKPbgNJVZi13mBSfWfW5tWblD5gbgDxEFaVv3EXCeOwQj9Wk6u72YQ15gYRFnXncRWKM67Ivo42x3s8mxW1e1MASc8bQi0bQbSArGFmArHwwDLS3SAAV05lPy7geOs56b3DcIJ8qpKUgI3ruCAAknDxJD1NDWfIyNrJZic1eWJCDf592qg8PylzfIDQsz7J4GTpuNkUDqW71q6npX-COKsicWM95Sg+QDnlvR+fVIQ9nsi4B0TobSH1tNgGAeBabVTqB1UBcEqDigWM6XwzoZ4AMjIVOowNUE6BuN9YhPwcBMQ8FgnwOD-5z0KvfN6JDRqNh7P2ae9DN5KUYnkRBrEbgQzKDcNcUJETBBRs8LqIF-BeUsItKOBgxHPHKMQZ4GRSDI1RjUcmyJggPhLLIjKQM2B1GZnoYIMM77XWxAAaW3Hw3+vhVHSXsEFLCdMJGPW6JYawzBCF6KxjUOoZ5MD2LsElA6njcYImQXoimzJMamPhnYhx+0PHVWeEQp4wQUFKXCafKJmTghrhLKFWC7JgjP0SZMSOZ12QKzZtCFE2jYn1PsJgCSTjz5ZH+JwwqnwtKGNad0RGUw7AL0cWpfeAytavC3F06Zf9ZlYyUnYGm3SUauMwOsyJGTWKfASXfHa2InBUP2becOVQ2FlDqHJYwNzmrVM+ike5IBHmtASWwwgQA');
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

});
