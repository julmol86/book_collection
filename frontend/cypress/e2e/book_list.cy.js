describe('Book List', () => {
    it('fetches and displays the list of books', () => {
      cy.visit('/');
      cy.get('[data-testid="book-list"]').should('exist');
      cy.get('[data-testid="book-list"] ul li').should('have.length', 2);
      cy.get('[data-testid="book-list"] ul li').eq(0).should('contain', 'The Hunger Games').and('contain', 'Suzanne Collins');
      cy.get('[data-testid="book-list"] ul li').eq(1).should('contain', 'Game of Thrones').and('contain', 'George R. R. Martin');
    });
  });

  describe('Create Book', () => {
    it('creates a new book', () => {
      cy.visit('/'); 
  
      cy.get('[data-testid="title-field"]').type('new test book'); 
      cy.get('[data-testid="author-field"]').type('me'); 
      cy.get('[data-testid="description-field"]').type('a quick fox jumped over a lazy dog'); 
  
      cy.get('[data-testid="save-new-button"]').click();
  
      cy.get('[data-testid="book-list"]').should('contain', 'new test book');
      cy.get('[data-testid="book-list"] ul li').should('have.length', 3);
    });
  });

  describe('Update Book', () => {
    it('updates an existing book', () => {
      cy.visit('/');
      cy.get('[data-testid="book-list"] li').first().click();
      cy.get('[data-testid="title-field"]').type('updated test book');
      cy.get('[data-testid="author-field"]').clear().type('you');
      cy.get('[data-testid="description-field"]').clear().type('lorem ipsum');
      cy.get('[data-testid="save-button"]').click();
      cy.get('[data-testid="book-list"]').first().should('contain', 'updated test book');
      cy.get('[data-testid="book-list"] ul li').should('have.length', 3);
    });
  });

  describe('Delete Book', () => {
    it('deletes a book', () => {
      cy.visit('/');
      cy.get('[data-testid="book-list"] li').first().click();
      cy.get('[data-testid="delete-button"]').click();
      cy.get('[data-testid="book-list"]').should('not.contain', 'updated test book');
    });
  });
    
  