describe("Word Cloud Directive", function() {

	var $compile;
	var $rootScope;
	var element;

	beforeEach(module('vr.directives.wordCloud'));

	beforeEach(inject(function(_$compile_, _$rootScope_) {
		$compile = _$compile_;
		$rootScope = _$rootScope_;
	}));

	describe('with a simple array', function() {

		beforeEach(function() {
			$rootScope.words = [ 'one', 'two', 'three' ];
			$rootScope.clicked = jasmine.createSpy('clicked');
		});

		describe('and an ngClick attribute', function() {

			beforeEach(function() {
				element = $compile("<word-cloud words='words' ng-click='clicked'><a href='javascript;:' ng-click='clickFn(word.word)'>{{ word.word }}</a></word-cloud>")($rootScope);
				$rootScope.$digest();
			});

			it('should add the elements to the dom', function() {
				// expect(element).toBeTag('DIV');
				expect(element.hasClass('word-cloud-group')).toBeTruthy();

				var words = element.find('span');
				expect(words.length).toBe(3);
				expect(words.eq(0).hasClass('word-cloud-group-item')).toBeTruthy();
				expect(words.eq(0).attr('style')).toBe(undefined);
				expect(words.eq(0).find('a').text()).toBe('one');
				expect(words.eq(1).find('a').text()).toBe('two');
				expect(words.eq(2).find('a').text()).toBe('three');
			});

			it('should send the word with the click', function() {
				element.find('a').eq(0).click();
				expect($rootScope.clicked).toHaveBeenCalledWith('one');
			});

			it('should add another word to the list', function() {
				$rootScope.$apply(function() { $rootScope.words.push('four'); });
				expect(element.find('span').length).toBe(4);
				expect(element.find('span').eq(3).find('a').text()).toBe('four');
			});

			it('should remove a word from the list', function() {
				$rootScope.$apply(function() { $rootScope.words.splice(1,1); });
				expect(element.find('span').length).toBe(2);
				expect(element.find('span').eq(1).find('a').text()).toBe('three');
			});

		});

		describe('sorted in ascending order alphabetically',function() {

			beforeEach(function() {
				element = $compile("<word-cloud words='words' sort='alphaAsc'><p>{{ word.word }}</p></word-cloud>")($rootScope);
				$rootScope.$digest();
			});

			it('should put them in ascending order', function() {
				var words = element.find('span');
				expect(words.eq(0).find('p').text()).toBe('one');
				expect(words.eq(1).find('p').text()).toBe('three');
				expect(words.eq(2).find('p').text()).toBe('two');
			});

		});

		describe('sorted in descending order alphabetically',function() {

			beforeEach(function() {
				element = $compile("<word-cloud words='words' sort='alphaDesc'><p>{{ word.word }}</p></word-cloud>")($rootScope);
				$rootScope.$digest();
			});

			it('should put them in descending order', function() {
				var words = element.find('span');
				expect(words.eq(0).find('p').text()).toBe('two');
				expect(words.eq(1).find('p').text()).toBe('three');
				expect(words.eq(2).find('p').text()).toBe('one');
			});

		});

	});

	describe('with an array', function() {

		describe('using custom properties', function() {
			beforeEach(function() {
				$rootScope.words = [
					{word:'one',size:1, custom: 'value one'},
					{word:'two',size:3, custom: 'value two'},
					{word:'three',size:2, custom: 'value three'}
				];

				/*jshint quotmark: double */
				element = $compile(
					"<word-cloud words='words' type='list'>" +
						"<p>" +
							"{{ word.word }}-{{ word.custom }}" +
						"</p>" +
					"</word-cloud>")($rootScope);

				$rootScope.$digest();
			});

			it('should use ', function() {
				var buttons = element.find('span');
				expect(buttons.eq(0).find('p').text()).toBe('one-value one');
				expect(buttons.eq(1).find('p').text()).toBe('two-value two');
				expect(buttons.eq(2).find('p').text()).toBe('three-value three');
			});
		});

		describe('using integer sizes', function() {

			beforeEach(function() {
				$rootScope.words = [ {word:'one',size:1}, {word:'two',size:3}, {word:'three',size:2} ];
			});

			describe('as an unsorted list',function() {

				beforeEach(function() {
					element = $compile("<word-cloud words='words' type='list'><p>{{ word.word }}</p></word-cloud>")($rootScope);
					$rootScope.$digest();
				});

				it('should keep the words in the order they came in', function() {
					var buttons = element.find('span');
					expect(buttons.eq(0).find('p').text()).toBe('one');
					expect(buttons.eq(1).find('p').text()).toBe('two');
					expect(buttons.eq(2).find('p').text()).toBe('three');
				});

				it('should not set the size of the buttons individually', function() {
					//expect(element.find('span').eq(0).css('font-size')).not.toBeOneOf(['1em','16px']);
					expect(['3em','48px'].indexOf(element.find('span').eq(1).css('font-size')) === -1);
					expect(['2em','32px'].indexOf(element.find('span').eq(2).css('font-size')) === -1);
				});

			});

			describe('as a list sorted in ascending order by size',function() {

				beforeEach(function() {
					element = $compile("<word-cloud words='words' type='list' sort='asc'><p>{{ word.word }}</p></word-cloud>")($rootScope);
					$rootScope.$digest();
				});

				it('should put them in ascending order', function() {
					var buttons = element.find('span');
					expect(buttons.eq(0).find('p').text()).toBe('one');
					expect(buttons.eq(1).find('p').text()).toBe('three');
					expect(buttons.eq(2).find('p').text()).toBe('two');
				});

			});

			describe('as a list sorted in descending order by size',function() {

				beforeEach(function() {
					element = $compile("<word-cloud words='words' type='list' sort='desc'><p>{{ word.word }}</p></word-cloud>")($rootScope);
					$rootScope.$digest();
				});

				it('should put them in descending order', function() {
					var buttons = element.find('span');
					expect(buttons.eq(0).find('p').text()).toBe('two');
					expect(buttons.eq(1).find('p').text()).toBe('three');
					expect(buttons.eq(2).find('p').text()).toBe('one');
				});

			});

			describe('when the size of a word is changed',function() {

				beforeEach(function() {
					element = $compile("<word-cloud words='words' type='list' sort='desc'><p>{{ word.word }}</p></word-cloud>")($rootScope);
					$rootScope.$digest();
					$rootScope.$apply(function() { $rootScope.words[0].size = 4; })
				});

				it('should put them in descending order', function() {
					var buttons = element.find('span');
					expect(buttons.eq(0).find('p').text()).toBe('one');
					expect(buttons.eq(1).find('p').text()).toBe('two');
					expect(buttons.eq(2).find('p').text()).toBe('three');
				});

			});

			describe('as an unsorted cloud',function() {

				beforeEach(function() {
					element = $compile("<word-cloud words='words' type='cloud'><p>{{ word.word }}</p></word-cloud>")($rootScope);
					$rootScope.$digest();
				});

				it('should keep the words in the order they came in', function() {
					var buttons = element.find('span');
					expect(buttons.length).toBe(3);
					expect(buttons.eq(0).find('p').text()).toBe('one');
					expect(buttons.eq(1).find('p').text()).toBe('two');
					expect(buttons.eq(2).find('p').text()).toBe('three');
				});

				it('should set the size of the buttons individually', function() {
					expect(['1em','16px'].indexOf(element.find('span').eq(0).css('font-size')) !== -1);
					expect(['3em','48px'].indexOf(element.find('span').eq(1).css('font-size')) !== -1);
					expect(['2em','32px'].indexOf(element.find('span').eq(2).css('font-size')) !== -1);
				});

			});

			describe('as a cloud sorted in ascending order by size',function() {

				beforeEach(function() {
					element = $compile("<word-cloud words='words' type='cloud' sort='asc'><p>{{ word.word }}</p></word-cloud>")($rootScope);
					$rootScope.$digest();
				});

				it('should put them in ascending order', function() {
					var buttons = element.find('span');
					expect(buttons.eq(0).find('p').text()).toBe('one');
					expect(buttons.eq(1).find('p').text()).toBe('three');
					expect(buttons.eq(2).find('p').text()).toBe('two');
				});

				it('should set the size of the buttons individually', function() {
					expect(['1em','16px'].indexOf(element.find('span').eq(0).css('font-size')) !== -1);
					expect(['2em','32px'].indexOf(element.find('span').eq(1).css('font-size')) !== -1);
					expect(['3em','48px'].indexOf(element.find('span').eq(2).css('font-size')) !== -1);
				});

			});

			describe('as a cloud sorted in descending order by size',function() {

				beforeEach(function() {
					element = $compile("<word-cloud words='words' type='cloud' sort='desc'><p>{{ word.word }}</p></word-cloud>")($rootScope);
					$rootScope.$digest();
				});

				it('should put them in descending order', function() {
					var buttons = element.find('span');
					expect(buttons.eq(0).find('p').text()).toBe('two');
					expect(buttons.eq(1).find('p').text()).toBe('three');
					expect(buttons.eq(2).find('p').text()).toBe('one');
				});

				it('should set the size of the buttons individually', function() {
					expect(['3em','48px'].indexOf(element.find('span').eq(0).css('font-size')) !== -1);
					expect(['2em','32px'].indexOf(element.find('span').eq(1).css('font-size')) !== -1);
					expect(['1em','16px'].indexOf(element.find('span').eq(2).css('font-size')) !== -1);
				});

			});

		});

		describe('using pixel sizes', function() {

			beforeEach(function() {
				$rootScope.words = [ {word:'one',size:'15px'}, {word:'two',size:'10px'}, {word:'three',size:'20px'} ];
			});

			describe('as an unsorted list',function() {

				beforeEach(function() {
					element = $compile("<word-cloud words='words' type='list'><p>{{ word.word }}</p></word-cloud>")($rootScope);
					$rootScope.$digest();
				});

				it('should keep the words in the order they came in', function() {
					var buttons = element.find('span');
					expect(buttons.eq(0).find('p').text()).toBe('one');
					expect(buttons.eq(1).find('p').text()).toBe('two');
					expect(buttons.eq(2).find('p').text()).toBe('three');
				});

			});

			describe('as a list sorted in ascending order by size',function() {

				beforeEach(function() {
					element = $compile("<word-cloud words='words' type='list' sort='asc'><p>{{ word.word }}</p></word-cloud>")($rootScope);
					$rootScope.$digest();
				});

				it('should put them in ascending order', function() {
					var buttons = element.find('span');
					expect(buttons.eq(0).find('p').text()).toBe('two');
					expect(buttons.eq(1).find('p').text()).toBe('one');
					expect(buttons.eq(2).find('p').text()).toBe('three');
				});

			});

			describe('as a list sorted in descending order by size',function() {

				beforeEach(function() {
					element = $compile("<word-cloud words='words' type='list' sort='desc'><p>{{ word.word }}</p></word-cloud>")($rootScope);
					$rootScope.$digest();
				});

				it('should put them in ascending order', function() {
					var buttons = element.find('span');
					expect(buttons.eq(0).find('p').text()).toBe('three');
					expect(buttons.eq(1).find('p').text()).toBe('one');
					expect(buttons.eq(2).find('p').text()).toBe('two');
				});

			});

			describe('as an unsorted cloud',function() {

				beforeEach(function() {
					element = $compile("<word-cloud words='words' type='cloud'><p>{{ word.word }}</p></word-cloud>")($rootScope);
					$rootScope.$digest();
				});

				it('should keep the words in the order they came in', function() {
					var buttons = element.find('span');
					expect(buttons.eq(0).find('p').text()).toBe('one');
					expect(buttons.eq(1).find('p').text()).toBe('two');
					expect(buttons.eq(2).find('p').text()).toBe('three');
				});

				it('should set the size of the buttons individually', function() {
					expect(element.find('span').eq(0).css('font-size')).toBe('15px');
					expect(element.find('span').eq(1).css('font-size')).toBe('10px');
					expect(element.find('span').eq(2).css('font-size')).toBe('20px');
				});

			});

			describe('as a cloud sorted in ascending order by size',function() {

				beforeEach(function() {
					element = $compile("<word-cloud words='words' type='cloud' sort='asc'><p>{{ word.word }}</p></word-cloud>")($rootScope);
					$rootScope.$digest();
				});

				it('should put them in ascending order', function() {
					var buttons = element.find('span');
					expect(buttons.eq(0).find('p').text()).toBe('two');
					expect(buttons.eq(1).find('p').text()).toBe('one');
					expect(buttons.eq(2).find('p').text()).toBe('three');
				});

				it('should set the size of the buttons individually', function() {
					expect(element.find('span').eq(0).css('font-size')).toBe('10px');
					expect(element.find('span').eq(1).css('font-size')).toBe('15px');
					expect(element.find('span').eq(2).css('font-size')).toBe('20px');
				});

			});

			describe('as a cloud sorted in descending order by size',function() {

				beforeEach(function() {
					element = $compile("<word-cloud words='words' type='cloud' sort='desc'><p>{{ word.word }}</p></word-cloud>")($rootScope);
					$rootScope.$digest();
				});

				it('should put them in descending order', function() {
					var buttons = element.find('span');
					expect(buttons.eq(0).find('p').text()).toBe('three');
					expect(buttons.eq(1).find('p').text()).toBe('one');
					expect(buttons.eq(2).find('p').text()).toBe('two');
				});

				it('should set the size of the buttons individually', function() {
					expect(element.find('span').eq(0).css('font-size')).toBe('20px');
					expect(element.find('span').eq(1).css('font-size')).toBe('15px');
					expect(element.find('span').eq(2).css('font-size')).toBe('10px');
				});

			});

		});

	});

});
