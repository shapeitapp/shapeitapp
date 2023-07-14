describe('Release cycle', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/projects/org/shapeitapp/2')
    })

    it('It contains the right project information', () => {
        cy.getByData("project-title").contains("Testing")
    })

    it('It contains the right cycle information', () => {
        cy.getByData("cycle-name").contains("Release 1.0")
        cy.getByData("cycle-notice").contains("The release date will be displayed after the completion of all scopes, Stay tuned!")
    })

    it('It contains the right bet information', () => {
        cy.getByData("bet-name").contains("Bet 1")
    })

    it('It contains the right scopes information', () => {
        cy.getByData("scopes").contains("Task 1")
        cy.getByData("scopes").contains("Task 2")
        cy.getByData("scopes").contains("Task 3")
        cy.getByData("scopes").contains("Task 4")
    })

    it('It contains the history information', () => {
        cy.getByData("history").contains("Task 4")
        cy.getByData("history").contains("50%")
        cy.getByData("history").contains("Fri Jul 14 2023")
        cy.getByData("history").contains("Updated progress of")
        cy.getByData("history").contains("This is a test")
    })

    it('I can navigate to the next cycle', () => {
        cy.getByData("next-cycle").click()
        cy.getByData("cycle-name").contains("Release 2.0")
        cy.getByData("next-cycle").click()
        cy.getByData("cycle-name").contains("Release 3.0")
        cy.getByData("pitches").contains("Pitch Test")
        cy.getByData("previous-cycle").click()
        cy.getByData("cycle-name").contains("Release 2.0")
        cy.getByData("previous-cycle").click()
        cy.getByData("cycle-name").contains("Release 1.0")
    })
})