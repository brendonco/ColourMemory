var serverUrl;

var app = angular.module('app', ['colour-memory-api']);

app.controller('MainCtrl', ['$scope', '$rootScope','$location', function($scope, $rootScope, $location){
	var fileCount = 8;
	var fileName = "colour";
	var fileExt = ".gif";
	var fileList = [];

	serverUrl = $location.absUrl().replace("index.html", "getgameinfo.php");

	hideDialog();

	for(var i=0; i<fileCount; i++){
		fileList[i] = fileName + (i+1) + fileExt;
	}

	$scope.tilesSrc = fileList;

	$scope.$on('UnmatchedPairEvent', function(){
		$scope.message = "Try again!";
	});

	$scope.$on('MatchedPairEvent', function(){
		$scope.message = "Match!";
	});

	$scope.$on('GameCompletedEvent', function(event, arg){
		$scope.message = "Thank you for playing.  Play Again?";
		$scope.score = arg.score;
		$scope.lines = arg.lines;
		$scope.columns = arg.columns;
		$scope.unmatchedPairs = 0;

		showUserInfo();

		$scope.$broadcast("UserInfoEvent");
	});

	$rootScope.restartGame = function(){
		$scope.restartBtn();
	}

	$scope.restartBtn = function(){
		var newParams = {
	      "tilesSrc": []
	    };

	    newParams.tilesSrc = fileList;

		$scope.$broadcast("GameRestartEvent", newParams);
	};

	$scope.showGameInfo = function(){
		showScoreboard();

		$scope.$broadcast("GameInfoEvent");
	};

	$scope.addUser = function(){
		var userInfo = {"name" : this.name, "emailaddress" : this.emailaddress, "score" : $scope.score};

		localStorage.setItem("user", this.emailaddress);
		
		$rootScope.addUserInfo(userInfo);
	}

	function showUserInfo(){
		$scope.userInfoWindow = "userinfo-dialog-show";
	}

	$rootScope.showUserInfo = function(){
		showUserInfo();
	};

	$rootScope.hideUserInfo = function(){
		hideUserInfo();
	}

	$rootScope.showScoreboard = function(){
		showScoreboard();
	}

	function hideDialog (){
		hideScoreboard();
		hideUserInfo();
	}

	function showScoreboard(){
		$scope.scoreboardWindow = "scoreboard-dialog-show";
	}

	function hideScoreboard(){
		$scope.scoreboardWindow = "scoreboard-dialog-hide";
	}

	function hideUserInfo(){
		$scope.userInfoWindow = "userinfo-dialog-hide";
	}
}]);