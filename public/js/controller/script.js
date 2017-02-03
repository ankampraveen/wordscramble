var app = angular.module('wordScramble', ['ngAnimate','ngCookies']);

app.controller('wordScrambleCtrl', function($scope, $http, $timeout, $window, $cookies) {
	$scope.arr = [];
	var arr = [];
	var word = "";
	$scope.result = "";
	$scope.message = "";
	if($cookies.get('score')) {
		$scope.score = $cookies.get('score');
	}
	else {
		$scope.score = 0;	
	}
	$http.get("https://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef=true&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=5&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5")
	.success(function(response) {
		var testword = response.word;
		console.log("unscrambled:" + testword);
		word = testword.toLowerCase();
		var wordArray = testword.toLowerCase().split("");
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
		scrambledWord(wordArray)

		arr = $scope.arr;
	});
	
	function scrambledWord(wordArray) {
		$scope.arr = [];
		for (var i = 0; i < wordArray.length; i++) {
			$scope.arr.push({
				val : i,
				id : '' + wordArray[i]				
			});
		}
	}

	$scope.refresh = function() {
		$window.location.reload();
	}
	
	$scope.showAnswer = function() {
		scrambledWord(word.split(""));
	}
	
	currentKeyPress = 0;
	charCount = 0;

	// function to verify user input
	$scope.swap = function($event) {
		if ($scope.result.length == word.length) {
			if ($scope.result == word) {
				$scope.score++;
				$cookies.put('score',$scope.score);
				$scope.message = "Congrats!!!";
				// Swap the tiles with correct word
				scrambledWord($scope.result.split(""));
			} else {
				$scope.message = "Try again!!!";
			}
		}
		else {
			$scope.message = "";
		}
	}
});
