var app = angular.module('wordScramble', ['ngAnimate','ngCookies']);

app.controller('wordScrambleCtrl', function($scope, $http, $timeout, $window, $cookies) {
	$scope.wordArray = [];
	var arr = [];
	var originalWord = "";
	$scope.isLoaded = false;
	$scope.wordTiles = "scrambledWord";
	$scope.result = "";
	$scope.message = "";
	if($cookies.get('score')) {
		$scope.score = $cookies.get('score');
	}
	else {
		$scope.score = 0;	
	}
	$http.get("http://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef=true&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=5&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5")
	.success(function(response) {
		$scope.isLoaded = true;
		
		var testword = response.word;
		console.log("unscrambled:" + testword);
		originalWord = testword.toLowerCase();
		var wordArray = originalWord.split("");
		var tempArrForDuplicates = wordArray;
		var duplicates = false;

		//find duplicates
		for (var i = 0; i < tempArrForDuplicates.length; i++) {
			for (var j = i + 1; j < tempArrForDuplicates.length; j++) {
				if (tempArrForDuplicates[i] == tempArrForDuplicates[j]) {
					duplicates = true;
				}
			}
		}
		// avoiding words that have duplicate characters in the word
		if (duplicates) {
			$window.location.reload();
		}

		// scramble the word
		for (var i = 0; i < wordArray.length; i++) {
			var randomNumber = Math.floor((Math.random() * wordArray.length));
			var temp = wordArray[i];
			wordArray[i] = wordArray[randomNumber];
			wordArray[randomNumber] = temp;
		}

		// store the scrambled word in an array
		updateWordTiles(wordArray)

		arr = $scope.wordArray;
	});
	
	function updateWordTiles(wordArray) {
		$scope.wordArray = [];
		for (var i = 0; i < wordArray.length; i++) {
			$scope.wordArray.push({
				val : i,
				id : '' + wordArray[i]				
			});
		}
	}

	$scope.refresh = function() {
		$window.location.reload();
	}
	
	$scope.showAnswer = function() {
		updateWordTiles(originalWord.split(""));
	}
	
	// function to verify user input
	$scope.swap = function($event) {
		if ($scope.result.length == originalWord.length) {
			if ($scope.result == originalWord) {
				$scope.score++;
				$cookies.put('score',$scope.score);
				$scope.message = "Congrats!!!";
				$scope.wordTiles = "rightWord";
				// Swap the tiles with correct word
				updateWordTiles($scope.result.split(""));
			} else {
				$scope.wordTiles = "wrongWord";
				$scope.message = "Try again!!!";
			}
		}
		else {
			$scope.message = "";
		}
	}
});
