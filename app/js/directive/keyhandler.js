var keyhandler = angular.module('keyhandler', []);

keyhandler.directive('keyHandler', function(){
	return{
		link: function( scope, element, attrs ) {
	    	element.bind('keydown', function( event ) {
	      		scope.$broadcast('keydown', event.keyCode );
	    	});
		}
	};

});