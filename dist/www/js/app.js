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
var colourMemoryApp = angular.module('colour-memory-api', ['cardboard', 'keyhandler', 'service-api', 'dialog']);

colourMemoryApp.controller('ColourMemoryGameCtrl', ['$scope', '$attrs', '$timeout', '$parse', '$http', 'userInfoService', '$rootScope', function($scope, $attrs, $timeout, $parse, $http, userInfoService, $rootScope){
  $scope.openCards = [];

	/**
     * Init the game
     */
    $scope.start = function() {
      // Check coherence between numbers of lines*columns, and numers of provided images
      var lines = $attrs.lines ? $attrs.lines : $scope.lines;
      var columns = $attrs.columns ? $attrs.columns : $scope.columns;

      if (($scope.tilesSrc.length * 2 === lines * columns)) {
        var deck = makeDeck($scope.tilesSrc);
        $scope.grid = makeGrid(deck);
        $scope.firstPick = $scope.secondPick = undefined;
        $scope.unmatchedPairs = $scope.tilesSrc.length;

        $scope.focusCol = 0;
        $scope.focusRow = 0;
        $scope.score = 0;

        columns = $attrs.columns;
        lines = $attrs.lines;

        resetOpenCards();

        $scope.openCards = [];
      }
    }


    // On load, init the game
    $scope.start();

    /**
     * Define Tile object
     * @param {string} title Filename of the picture associated to the tile
     */
    function Tile(title) {
      this.title = title;
      this.flipped = false;
    }

    /**
     * Method flip for Tile
     */
    Tile.prototype.flip = function() {
      this.flipped = !this.flipped;
    };

    /**
     * Function called when player click on a Tile
     * @param {Tile} tile Tile picked by the player
     */
    $scope.flipTile = function(tile) {
      if (tile.flipped) {
        return;
      }
      tile.flip();
      if (!$scope.firstPick) {
        $scope.firstPick = tile;
      } else {
        if ($scope.firstPick.title === tile.title) {
          $scope.unmatchedPairs--;

          var cardStyleVar1 = "card_" + tile.row + "_" + tile.col;
          var cardStyle1 = $parse(cardStyleVar1);
          cardStyle1.assign($scope, {opacity:0});

          var cardStyleVar2 = "card_" + $scope.firstPick.row + "_" + $scope.firstPick.col;
          var cardStyle2 = $parse(cardStyleVar2);
          cardStyle2.assign($scope, {opacity:0});

          $scope.openCards.push(cardStyleVar1);
          $scope.openCards.push(cardStyleVar2);

          addScore();
          
          $scope.$emit("MatchedPairEvent");
          if ($scope.unmatchedPairs == 0) {
            var args = {'score' : $scope.score, 'lines' : $attrs.lines, 'columns' : $attrs.columns}
            $scope.$emit("GameCompletedEvent", args);
          }
        } else {
          $scope.secondPick = tile;
          
          subScore();

          $scope.$emit("UnmatchedPairEvent");
          var tmpFirstPick = $scope.firstPick;
          var tmpSecondPick = $scope.secondPick;
          $timeout(function() {
            tmpFirstPick.flip();
            tmpSecondPick.flip();
          }, 1000);
        }
        $scope.firstPick = $scope.secondPick = undefined;
      }
    };

    /**
    * Restart the game.
    */
    $scope.$on("GameRestartEvent", function(event, args) {
      if (args && args.tilesSrc) {
        $scope.tilesSrc = args.tilesSrc;
      }
      $scope.start();
    });

    /**
    * Subtract score.
    */
    function subScore(){
      $scope.score--;
    }

    /**
    * Add score.
    */
    function addScore(){
      $scope.score ++;
    }

    /**
    * Reset open cards.
    */
    function resetOpenCards(){
      var openCards = $scope.openCards;

      for(var i=0; i<openCards.length; i++){
          var cardStyle = $parse(openCards[i]);

          if(cardStyle){
            cardStyle.assign($scope, {opacity:100});
          }
      }
    }

    /**
     * Create set of tiles
     * @param {array} tileNames Array of filenames
     * @return {array} tileDeck Array of Tiles
     */
    function makeDeck(tileNames) {
      var tileDeck = [];
      for (var i = 0; i < tileNames.length; i++) {
        tileDeck.push(new Tile(tileNames[i]));
        tileDeck.push(new Tile(tileNames[i]));
      };
      return tileDeck;
    }

    /**
     * Arrange a set of Tiles in grid
     * @param {array} tileDeck Array of Tiles
     * @return {array} grid array of Tiles
     */
    function makeGrid(tileDeck) {
      var grid = [];
      for (var row = 0; row < $attrs.lines; row++) {
        grid[row] = [];
        for (var col = 0; col < $attrs.columns; col++) {
            grid[row][col] = removeRandomTile(tileDeck);

            grid[row][col].row = row;
            grid[row][col].col = col;
        }
      }
      return grid;
    }

    /**
     * Pick a random Tile from a deck to put it on a grid
     * @param {array} tileDeck Array of Tiles
     * @return {tile} Randomly picked Tile
     */
    function removeRandomTile(tileDeck) {
      var i = Math.floor(Math.random()*tileDeck.length);
      return tileDeck.splice(i, 1)[0];
    }

    //Handle keys
    $scope.keys = [];
    
    //ENTER
    $scope.keys.push({ code: 13, action: function() {
      var focusCol = $scope.focusCol;
      var focusRow = $scope.focusRow;

      if(!angular.isUndefined(focusCol) && !angular.isUndefined(focusRow) && !angular.isUndefined($scope.grid)){
        var selectedTile = $scope.grid[focusRow][focusCol];
        $scope.flipTile(selectedTile);
      }
    }});

    //LEFT
    $scope.keys.push({ 
      code: 37, 
      action: function() {
        if($scope.focusCol != 0){
          $scope.focusCol--;
        }
      }
    });

    //UP
    $scope.keys.push({ 
      code: 38, 
      action: function() {
        if($scope.focusRow !=0){
          $scope.focusRow--;
        }
      }
    });

    //RIGHT
    $scope.keys.push({ 
      code: 39, 
      action: function() {
        if($scope.focusCol < ($attrs.columns-1)){
          $scope.focusCol++; 
        }
      }
    });

    //DOWN
    $scope.keys.push({ 
      code: 40, 
      action: function() {
        if($scope.focusRow < ($attrs.lines -1)){
          $scope.focusRow++;
        }
      }
    });


    /**
    * Keyboard handler.
    */
    $scope.$on('keydown', function( msg, code ) {
      $scope.keys.forEach(function(o) {
        if ( o.code !== code ) { return; }
        o.action();
        $scope.$apply();
      });
    });

    //Game Information Event
    $scope.$on("GameInfoEvent", function() {
        showGameInfo();
    });

    $scope.highlightUser = function(emailaddress){
        if(emailaddress === $scope.user){
          return "highlight-user";
        }else{
          return "";
        }
    }

    /**
    * Show Game Score board.
    */
    function showGameInfo(){
        $scope.user = localStorage.getItem("user");

        $http({
            url: serverUrl, //'http://localhost/~brendon/getgameinfo.php', 
            method: "GET",
            params: {'getscore': 'getscore'}
         }).success(function(data, status, headers, config){
            $scope.rankings=[];

            $scope.rankings = data;

            $scope.showDialog = "scoreboard-light-show";
            $scope.showOverlay = "scoreboard-fade-overlay-show";

            $rootScope.showScoreboard();
         }).error(function(data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
            alert("Error getting the score board.");
        });
    }

    /**
    * Hide Game score board.
    */
    function hideGameInfo(){
        $scope.showDialog = "scoreboard-light-hide";
        $scope.showOverlay = "scoreboard-fade-overlay-hide";
    }
    //Game Information Event - END

    /**
    * Hide Dialog
    */
    $scope.hideDialog = function(){
        hideGameInfo();

        hideUserInfo();

        if(!angular.isUndefined($scope.unmatchedPairs) && $scope.unmatchedPairs== 0){
            $rootScope.restartGame();
        }
    }


    /**
    * User information Event.
    */
    $scope.$on("UserInfoEvent", function() {
        showUserInfo();
    });

    /**
    * Add User information to DB.
    */
    $rootScope.addUserInfo = function(args){
        if(!angular.isUndefined(args)){
            args.score = $scope.score;

            
            if(angular.isUndefined(args.score)){
                args.score =9999; //dummy score
            }

            userInfoService.addUser(args, function(){
              //hideUserInfo();
              $rootScope.hideUserInfo();

              $rootScope.restartGame();

              showGameInfo();
              
            },function(data){
                //error when saving data.
                alert("Error when saving data.");
                console.log(data);
            });
        }
    };

    /**
    * Show User Information
    */
    function showUserInfo(){
        $scope.showDialog = "userinfo-light-show";
        $scope.showOverlay = "userinfo-fade-overlay-show";
    }

    /**
    * Hide User Information
    */
    function hideUserInfo(){
        $scope.showDialog = "userinfo-light-hide";
        $scope.showOverlay = "userinfo-fade-overlay-hide";

        $rootScope.hideUserInfo();
    }
}]);
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
/**
  * Service for handling user information.
  */
var serviceApi = angular.module('service-api', []);

serviceApi.service('userInfoService', ['$http', function($http){
    this.addUser = function(paramsData, successCallback, errorCallback){
        $http({
            url: serverUrl, 
            method: "POST",
            data: {'name': paramsData.name, 'emailaddress': paramsData.emailaddress, 'score': paramsData.score}
         }).success(function(data, status, headers, config){
            successCallback(data);

         }).error(function(data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          errorCallback(data);
        });
    };
}]);