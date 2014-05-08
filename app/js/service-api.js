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