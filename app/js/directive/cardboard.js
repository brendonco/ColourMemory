var cardboard = angular.module('cardboard', []);

cardboard.directive('cardBoard', function(){
	return {
		restrict: 'E',
		replace: true,
		scope: {
			tilesDir: '@',
			tilesSrc: '=',
			tilesHeight: '@',
			tilesWidth: '@'
		},
		templateUrl: 'html/cardboard.html',
		 controller: 'ColourMemoryGameCtrl'
	};
});