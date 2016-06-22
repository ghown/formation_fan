(function() {
	'use strict';

	describe('Hello World app', function() {

		describe('Main page', function() {

			beforeEach(function() {
				browser.get('app/index.html');
			});

			it('should display the table', function() {
				var lien = element.all(by.css('ors-header a')).get(2);
				lien.click();
				var ligne = element.all(by.css('tbody tr')).get(1);
				var cell = ligne.all(by.css('td')).get(0);
				expect(cell.getText()).toEqual('Salaire');
			});
		});
	});
})();
	