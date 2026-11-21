import utilities from "../utilities";

describe('Map gh2', () => {
    beforeEach(() => {
        utilities.enableGame('gh2');
        utilities.switchGame('gh2');
    });

    it('It loads the gh2 map and upgrades to highres', () => {
        cy.visit('/tracker/#/map');

        cy.get('#map img.map').should('have.attr', 'src').and('match', /\/img\/maps\/gh2\/highres\.(webp|jpg)/);
    });

    it('It shows the starting scenario sticker on its cell', () => {
        cy.visit('/tracker/#/map');

        cy.get('#map #s1').should('have.length', 1);
        utilities.scenarios().then((scenarios) => {
            const coordinates = scenarios.firstWhere('id', 1).coordinates;
            expect(coordinates.name).to.eq('F4');
            expect(coordinates.x).to.be.greaterThan(0);
            expect(coordinates.y).to.be.greaterThan(0);
        });
    });

    it('It places the 1e-matching scenarios on their printed cell', () => {
        utilities.scenarios().then((scenarios) => {
            expect(scenarios.firstWhere('id', 7).coordinates.name).to.eq('G10');
            expect(scenarios.firstWhere('id', 8).coordinates.name).to.eq('G11');
            expect(scenarios.firstWhere('id', 50).coordinates.name).to.eq('A11');
            expect(scenarios.firstWhere('id', 20).coordinates.name).to.eq('R5');
        });
    });

    it('It can open a scenario from the map', () => {
        cy.visit('/tracker/#/map');

        cy.get('#s1').click();

        cy.get('#scenario-title').should('have.length', 1);
    });
});
