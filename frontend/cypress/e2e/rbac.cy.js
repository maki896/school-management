describe('Role-Based Access Control E2E Tests', () => {
    it('should show login page by default', () => {
        cy.visit('/');
        cy.url().should('include', '/login');
        cy.contains('Login');
    });

    it('should login as Admin and view admin dashboard', () => {
        cy.visit('/login');
        cy.get('input[formControlName="email"]').type('admin@school.com');
        cy.get('input[formControlName="password"]').type('admin123');
        cy.get('button[type="submit"]').click();

        cy.url().should('include', '/admin');
        cy.contains('Admin Dashboard');
    });

    it('should login as Teacher and view teacher dashboard', () => {
        cy.visit('/login');
        cy.get('input[formControlName="email"]').type('teacher@school.com');
        cy.get('input[formControlName="password"]').type('teacher123');
        cy.get('button[type="submit"]').click();

        cy.url().should('include', '/teacher');
        cy.contains('Teacher Dashboard');
    });
});
