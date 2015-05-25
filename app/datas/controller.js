(function(){
	angular.module("synergy")
	.controller("PannelController", ["$scope", "Data", "$rootScope", function($scope, Data, $rootScope){
		
		$scope.nodes = Data.nodes;

		function init(){
			$scope.title = "";
			$scope.charge = 0;

			Data.nodes.forEach(function(node){
				node.currentSynergy = 0;
			});
		}

		init();

		$scope.add = function(){
			var node = Data.createNewNode(),
				newLinks = [];

			node.title = $scope.title;
			node.charge = parseInt($scope.charge);

			Data.nodes.forEach(function(target){
				if(target.currentSynergy > 0){
					var newLink = Data.createNewLink();

					newLink.source = node;
					newLink.target = target;

					newLink.distance = 10-parseInt(target.currentSynergy);

					newLinks.push(newLink);
				}
			});

			Data.add(node, newLinks);
			init();
		};

		$scope.save = function(){
			var toSave = {
					nodes: Data.nodes,
					links: Data.links
				};

			saveData(toSave, "synergy-data.json");
		};

		var saveData = (function () {
		    var a = document.createElement("a");
		    document.body.appendChild(a);
		    a.style = "display: none";
		    return function (data, fileName) {
		        var json = JSON.stringify(data),
		            blob = new Blob([json], {type: "octet/stream"}),
		            url = window.URL.createObjectURL(blob);
		        a.href = url;
		        a.download = fileName;
		        a.click();
		        window.URL.revokeObjectURL(url);
		    };
		}());


	}])
})();