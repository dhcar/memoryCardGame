anuglar.module('starter.directives')

.directive('CardScoper', function() {
	return {
		restrict: 'A',
		scope: '=',
		link: function (scope, el, attrs) {
			// 
			// used solely to resolve card indexing and grouping
			// so that we're not referencing card({{$index + 3}})
			// 
			scope.card = card;
		}
	};
});