angular.module('starter.controllers', [])

.controller('GameCtrl', function(
  $scope,
  $timeout,
  Cards){

  $scope.cards = new Cards();

  $scope.cards.shuffle();

  console.log($scope.cards);

  $scope.cardSelected = false;
  $scope.cardsMatched = [];

  $scope.playingComputer = false;

  $scope.selectCard = function(card, $event){

    var i     = this.$index;

    if($scope.cards.deck[i].hide) return false;

    if(!$scope.cardSelected){
      // No previous card is selected
      // select this card
      console.warn('Card selected');

      $scope.cards.deck.forEach(function(val, index){
        val.faceUp = false;
      });

      $scope.cardSelected        = card;
      $scope.cardSelected.i      = i;
      $scope.cardSelected.faceUp = true;

      $scope.$broadCast('cardSelected', [card, i]);

    } else if( $scope.cardSelected.number == card.number && $scope.cardSelected.suit != card.suit){
      // card matches selected
      console.warn('Card Matches');
      $scope.$evalAsync(function(){
        card.faceUp                = true;
        $scope.cardSelected.faceUp = true;        
      });

      $scope.cardsMatched.push([ card, $scope.cardSelected ]);

      if($scope.cardsMatched.length == 26){
        window.alert('You won!');
        return;
      }

      $timeout(function(){
        window.alert('Its a match!');
        $scope.cards.deck[ i ].removed                     = true;
        $scope.cards.deck[ $scope.cardSelected.i ].removed = true;
      });

      $scope.$broadCast('cardsMatched', [card, i]);
      $scope.$broadCast('cardsMatched', [$scope.cardSelected, $scope.cardSelected.i]);

    } else {
      console.warn('Card Doesnt match');
      // card doesn't match
      $scope.cardSelected.faceUp = true;
      card.faceUp                = true;
      $scope.cardSelected        = false;

      if($scope.playingComputer){      
        $scope.computerSelect();
      }

    }

  };

  // index card position, when seeing new card, index
  
  $scope.computerMem = {
    known:   {}, // guessed
    possible: {}  // unguessed and on board
  };

  $scope.computerSelect = function(){

    // 
    // Resolve cards matched for computer, for player
    // Resolve cards left on board
    // Resolve positions of cards left on board
    // 

    // 
    // 3 major actions:
    //  make guess
    //  make match
    //  make guess and then match
    // 
    // if match is possible do match
    // guess, re evaluate match possibility then match or guess
    // 

  };

  var function computerEvalSelected(card, i){
    // 
    // Add card to known
    // 
    $scope.computerMem.known[ card.number ] = i;
  };

  var function computerEvalMatched(card, i){
    // 
    // Add to removed
    //
    delete $scope.computerMem.possible[i];
  };

  $scope.restart = function(){
    $scope.cards = new Cards();
    $scope.cards.shuffle();
    $scope.cardsMatched = [];
    $scope.cardSelected = false;
  };

  $scope.playComputer = function(){
    $scope.restart();
    $scope.playingComputer = true;

    $scope.$on('cardSelected', computerEvalSelected);
    $scope.$on('cardsMatched', computerEvalMatched);
  };

});