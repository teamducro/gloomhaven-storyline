describe('Info', () => {

    it('It loads the info page', () => {
        cy.visit('/tracker/#/info');

        cy.get('#info').within(() => {
            cy.contains('Play Gloomhaven with a storyline tracker');
        });
    });

    it('It decode the email', () => {
        cy.visit('/tracker/#/info');

        cy.get('#info').within(() => {
            cy.get('.link').contains('send me an e-mail')
                .then($link => $link.on('click', e => e.preventDefault()))
                .click()
                .should(($link) => {
                    expect($link).attr('href', 'mailto:support@gloomhaven-storyline.com');
                });
        });
    });

    it('It has a github link', () => {
        cy.visit('/tracker/#/info');

        cy.get('#info').within(() => {
            cy.get('.mdc-button').first().parent('a').should(($button) => {
                expect($button).attr('href', 'https://github.com/teamducro/gloomhaven-storyline');
            });
        });
    });

});
