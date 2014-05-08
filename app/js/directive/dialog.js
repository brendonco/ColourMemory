var dialog = angular.module('dialog', []);

dialog.directive('dialog', function(){
	return {
		restrict: 'EA',
		replace: true,
		transclude: true,
		templateUrl: 'html/dialog.html',
		controller: 'ColourMemoryGameCtrl'
	};
});