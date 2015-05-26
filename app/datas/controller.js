(function(){
	angular.module("synergy")
	.controller("PannelController", ["$scope", "Data", "$rootScope", function($scope, Data, $rootScope){
		var editting;
		$scope.nodes = Data.nodes;
		$scope.on = "liste";

		function init(node){
			node = node || {}
			editting = node;
			$scope.title = node.title || "";
			$scope.charge = node.charge || 0;
			$scope.description = node.description || "";

			if(!node.index){
				Data.nodes.forEach(function(distant){
					distant.currentSynergy = 0;
					distant.relatedLink = undefined;
				});
			} else {
				Data.links.forEach(function(link){
					var distant;
					if((link.source.index === node.index && (distant = link.target)) || (link.target.index === node.index && (distant = link.source))){
						distant.currentSynergy = 10-link.distance;
						distant.relatedLink = link;
					}
				});
			}
			
		}

		$scope.init = init;

		init();

		$scope.add = function(){
			var node = Data.createNewNode(),
				newLinks = [],
				removeLinks = [];

			if(editting.index){
				node = editting;
			}

			node.title = $scope.title;
			node.charge = parseInt($scope.charge);
			node.description = $scope.description;

			if(editting.index){
				Data.nodes.forEach(function(target){

					if((target.currentSynergy > 0 && target.relatedLink && target.currentSynergy !== 10-parseInt(target.relatedLink.distance)) ||
						(target.currentSynergy > 0)){

						var newLink = Data.createNewLink();

						newLink.source = node;
						newLink.target = target;

						newLink.distance = 10-parseInt(target.currentSynergy);

						newLinks.push(newLink);

						if(target.relatedLink){
							removeLinks.push(target.relatedLink);
						}

						console.log(target);
					} else if(target.relatedLink && target.currentSynergy === 0){
						removeLinks.push(target.relatedLink);
					}

					target.relatedLink = undefined;
				});
			} else {
				Data.nodes.forEach(function(target){
					if(target.currentSynergy > 0){
						var newLink = Data.createNewLink();

						newLink.source = node;
						newLink.target = target;

						newLink.distance = 10-parseInt(target.currentSynergy);

						newLinks.push(newLink);
					}
				});
			}
			

			Data.add(node, newLinks, removeLinks);
			init();
			$scope.on = "liste";
		};

		$scope.save = function(){
			init();
			var toSave = {
					nodes: Data.nodes,
					links: Data.links
				};

			saveData(toSave, "synergy-data.json");
		};

		$scope.remove = function(node){
			Data.remove(node);
		};

		$scope.edit = function(node){
			editting = node;
			init(node);
			$scope.on = "ajouter";
		};

		$scope.toFilter = function(item){
			if(editting && editting.index === item.index){
				return false;
			}
			return true;
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