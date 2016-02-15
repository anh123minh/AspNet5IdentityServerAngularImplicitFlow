!function(){var a=angular.module("mainApp",["ui.router","LocalStorageModule"]);a.config(["$stateProvider","$urlRouterProvider","$locationProvider",function(a,b,c){b.otherwise("/authorized"),a.state("authorized",{url:"/authorized",templateUrl:"/templates/authorized.html",controller:"AuthorizedController"}).state("home",{"abstract":!0,url:"/home",templateUrl:"/templates/home.html"}).state("forbidden",{url:"/forbidden",templateUrl:"/templates/forbidden.html"}).state("details",{parent:"home",url:"/details/:id",templateUrl:"/templates/details.html",controller:"DetailsController",resolve:{DataEventRecordsService:"DataEventRecordsService",dataEventRecords:["DataEventRecordsService",function(a){return a.GetDataEventRecords()}],dataEventRecord:["DataEventRecordsService","$stateParams",function(a,b){var c=b.id;return console.log(b.id),a.GetDataEventRecord({id:c})}]}}).state("overviewindex",{parent:"home",url:"/overviewindex",templateUrl:"/templates/overviewindex.html",controller:"OverviewController",resolve:{DataEventRecordsService:"DataEventRecordsService",dataEventRecords:["DataEventRecordsService",function(a){return a.GetDataEventRecords()}]}}).state("create",{parent:"home",url:"/create",templateUrl:"/templates/create.html",controller:"DetailsController",resolve:{dataEventRecords:["DataEventRecordsService",function(a){return a.GetDataEventRecords()}],dataEventRecord:[function(){return{Id:"",Name:"",Description:"",Timestamp:"2016-02-15T08:57:32"}}]}}),c.html5Mode(!0)}]),a.run(["$rootScope",function(a){a.$on("$stateChangeError",function(a,b,c,d,e,f){console.log(a),console.log(b),console.log(c),console.log(d),console.log(e),console.log(f)}),a.$on("$stateNotFound",function(a,b,c,d){console.log(a),console.log(b),console.log(c),console.log(d)})}])}(),function(){"use strict";function a(a,b,c,d,e){if(b.info("AuthorizedController called"),a.message="AuthorizedController created",e.set("authorizationData",""),console.log(e.get("authorizationData")),""!==e.get("authorizationData"))a.message="AuthorizedController created logged on",d.go("overviewindex");else if(console.log("AuthorizedController created, no auth data"),c.location.hash){console.log("AuthorizedController created, has hash"),a.message="AuthorizedController created with a code";var f=window.location.hash.substr(1),g=f.split("&").reduce(function(a,b){var c=b.split("=");return a[c[0]]=c[1],a},{}),h="";g.error||(g.state!==e.get("authStateControl")?console.log("AuthorizedController created. no myautostate"):(e.set("authStateControl",""),console.log("AuthorizedController created. returning access token"),h=g.access_token)),e.set("authorizationData",h),console.log(e.get("authorizationData")),d.go("overviewindex")}else{a.message="AuthorizedController time to log on";var i="https://localhost:44345/connect/authorize",j="angularclient",k="https://localhost:44347/authorized",l="token",m="dataEventRecords aReallyCoolScope",n=Date.now()+""+Math.random();e.set("authStateControl",n),console.log("AuthorizedController created. adding myautostate: "+e.get("authStateControl"));var o=i+"?client_id="+encodeURI(j)+"&redirect_uri="+encodeURI(k)+"&response_type="+encodeURI(l)+"&scope="+encodeURI(m)+"&state="+encodeURI(n);c.location=o}}var b=angular.module("mainApp");b.controller("AuthorizedController",["$scope","$log","$window","$state","localStorageService",a])}(),function(){"use strict";function a(a,b,c,d,e){b.info("DetailsController called"),a.message="dataEventRecord Create, Update or Delete",a.DataEventRecordsService=d,a.state=e,a.dataEventRecord=c,a.Update=function(){b.info("Updating"),b.info(c),a.DataEventRecordsService.UpdateDataEventRecord(c).then(function(){a.state.go("overviewindex")})},a.Create=function(){b.info("Creating"),b.info(c),a.DataEventRecordsService.AddDataEventRecord(c).then(function(){a.state.go("overviewindex")})}}var b=angular.module("mainApp");b.controller("DetailsController",["$scope","$log","dataEventRecord","DataEventRecordsService","$state",a])}(),function(){"use strict";function a(a,b,c,d,e){b.info("OverviewController called"),a.message="Overview",a.DataEventRecordsService=d,b.info(c),a.dataEventRecords=c,a.Delete=function(c){b.info("deleting"),a.DataEventRecordsService.DeleteDataEventRecord(c).then(function(){e.go(e.current,{},{reload:!0})})}}var b=angular.module("mainApp");b.controller("OverviewController",["$scope","$log","dataEventRecords","DataEventRecordsService","$state",a])}(),function(){"use strict";function a(a,b){console.log("AuthorizationInterceptor created");var c=function(c){return c.headers=c.headers||{},""!==b.get("authorizationData")&&(c.headers.Authorization="Bearer "+b.get("authorizationData")),c||a.when(c)},d=function(a){return console.log("console.log(responseFailure);"),console.log(a),403===a.status?b.set("authorizationData",""):401===a.status&&b.set("authorizationData",""),this.q.reject(a)};return{request:c,responseError:d}}var b=angular.module("mainApp");b.service("authorizationInterceptor",["$q","localStorageService",a]),b.config(["$httpProvider",function(a){a.interceptors.push("authorizationInterceptor")}])}(),function(){"use strict";function a(a,b,c,d){b.info("DataEventRecordsService called");var e="https://localhost:44390/",f=function(b){var d=c.defer();return console.log("addDataEventRecord started"),console.log(b),a({url:e+"api/DataEventRecords",method:"POST",data:b}).success(function(a){d.resolve(a)}).error(function(a){d.reject(a)}),d.promise},g=function(b){var d=c.defer();return console.log("addDataEventRecord started"),console.log(b),a({url:e+"api/DataEventRecords/"+b.Id,method:"PUT",data:b}).success(function(a){d.resolve(a)}).error(function(a){d.reject(a)}),d.promise},h=function(b){var d=c.defer();return console.log("DeleteDataEventRecord begin"),console.log(b),a({url:e+"api/DataEventRecords/"+b,method:"DELETE",data:""}).success(function(a){d.resolve(a)}).error(function(a){d.reject(a)}),d.promise},i=function(){var b=c.defer();return console.log("GetDataEventRecords started"),console.log(d.authorizationData),a({url:e+"api/DataEventRecords",method:"GET"}).success(function(a){console.log("GetDataEventRecords success"),b.resolve(a)}).error(function(a){console.log("GetDataEventRecords error"),b.reject(a)}),b.promise},j=function(d){b.info("DataEventRecordService GetDataEventRecord called: "+d.id),b.info(d);var f=c.defer();return a({url:e+"api/DataEventRecords/"+d.id,method:"GET"}).success(function(a){console.log("GetDataEventRecords success"),f.resolve(a)}).error(function(a){console.log("GetDataEventRecords error"),f.reject(a)}),f.promise};return{AddDataEventRecord:f,UpdateDataEventRecord:g,DeleteDataEventRecord:h,GetDataEventRecords:i,GetDataEventRecord:j}}var b=angular.module("mainApp");b.factory("DataEventRecordsService",["$http","$log","$q","$rootScope",a])}();