(function(){
	angular.module("synergy")
	.directive("pannel", ["Data", function(Data){
		return{
			restrict: "E",
			scope: {},
			templateUrl: "app/datas/directive.html",
			controller: "PannelController",
			controllerAs: "ctrl",
			link: function(scope){
				JsonObj = null 

				function handleFileSelect(evt) {
				    var files = evt.target.files; // FileList object
				     f = files[0];
				      var reader = new FileReader();

				      // Closure to capture the file information.
				      reader.onload = (function(theFile) {
				        return function(e) {
				          // Render thumbnail.
				         JsonObj = JSON.parse(e.target.result);
				         scope.$apply(function(){
				         	Data.resetWith(JsonObj);
				         });
				        };
				      })(f);

				      // Read in the image file as a data URL.
				      reader.readAsText(f);
				    }

				document.getElementById('files').addEventListener('change', handleFileSelect, false);

				scope.$watch("on", function(){
					$("pannel").scrollTop(0);
				});
			}
		}
	}]);
})();