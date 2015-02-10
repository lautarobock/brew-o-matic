/**
 * Created with IntelliJ IDEA.
 * User: Joe Linn
 * Date: 8/9/13
 * Time: 12:12 PM
 * To change this template use File | Settings | File Templates.
 */
beforeEach(function(){
    this.addMatchers({
        toHaveClass: function(cls){
            this.message = function(){
                return "Expected '" + angular.mock.dump(this.actual) + "'"+(this.isNot?" not":"")+" to have class '" + cls + "'.";
            };
            return this.actual.hasClass(cls);
        },
		toBeTag: function(tag) {
			this.message = function(){
				return "Expected '" + angular.mock.dump(this.actual) + "'"+(this.isNot?" not":"")+" to be a '" + tag + "' tag.";
			};
			return this.actual.prop('tagName') == tag;
		},
		toBeOneOf: function(options) {
			this.message = function() {
				return "Expected '" + this.actual + "'" + (this.isNot?" not":"") + " to be one of "+options+".";
			};
			return options.indexOf(this.actual) >= 0;
		}
    });
});
