angular.module('starter.controllers', [])

.controller('GameCtrl', function(
  $scope,
  $timeout,
  Cards){

  $scope.cards = new Cards();

  $scope.cards.shuffle();

  $scope.cardSelected = false;
  $scope.cardsMatched = [];

  $scope.computerCardsMatched = [];

  $scope.playingComputer = false;

  $scope.selectCard = function(i, computer, $event){

    // if($event){
    //   $event.stopPropagation();
    //   $event.preventDefault();
    // }

    // 
    var card = $scope.cards.deck[i];
    card.i   = i;

    if($scope.cardSelected.i == i) return false;

    // if($scope.cards.deck[i].hide) return false;

    if(!$scope.cardSelected){
      // No previous card is selected
      // select this card

      $scope.cards.deck.forEach(function(val, index){
        val.faceUp = false;
      });

      $scope.cardSelected        = card;
      $scope.cardSelected.i      = i;
      $scope.cardSelected.faceUp = true;

      $scope.$broadcast('cardSelected', card);

      if(computer){
        $scope.computerTurn();
      }

    } else if( $scope.cardSelected.number == card.number && $scope.cardSelected.suit != card.suit){
      // card matches selected

      card.faceUp                = true;
      card.i                     = i;
      $scope.cardSelected.faceUp = true;

      computer ?  $scope.computerCardsMatched.push([ card, $scope.cardSelected ]) : $scope.cardsMatched.push([ card, $scope.cardSelected ]);

      if($scope.cardsMatched.length + $scope.computerCardsMatched.length == 26){
        if($scope.computerCardsMatched.length > $scope.cardsMatched.length){
          window.alert('You won!');
        } else {
          window.alert('Computer won!');
        }
      }

      var _cardSelectedIndex = $scope.cardSelected.i;
      // $timeout(function(){
        window.alert('Its a match!');
        $scope.cards.deck[ i ].removed                  = true;
        $scope.cards.deck[ _cardSelectedIndex ].removed = true;
      // });

      $scope.$broadcast('cardsMatched', $scope.cardSelected);
      $scope.$broadcast('cardsMatched', card);

      $scope.cardSelected = false;

      if(computer){
        console.warn('match');
        $timeout($scope.computerTurn);
      }

    } else {
      console.warn('Card Doesnt match');
      // card doesn't match
      $scope.cardSelected.faceUp = true;
      card.faceUp                = true;
      $scope.cardSelected        = false;

      $scope.$broadcast('cardSelected', card);

      if(!computer && $scope.playingComputer){   
        $timeout($scope.computerTurn, 1500);
      }

    }

  };

  // index card position, when seeing new card, index

  $scope.computerTurn = function(){

    console.warn('Computer\'s turn');
    // 
    // Resolve cards matched for computer, for player
    // Resolve cards left on board
    // Resolve positions of cards left on board
    // 

    // 
    // 3 major actions:
    //  make match
    //  make guess and if possible then match, otherwise guess
    // 
    var known   = $scope.computerMem.known;

    var maxCount = 0;
    var maxVal   = {}

    var vals = [];

    var _count = 0;

    angular.forEach( known, function(val, key){
      // just figure out if it matches in here

      angular.forEach( val, function(suitVal, suitKey){
        vals.push(suitVal);
        if(Object.keys(val).length > 1) vals.push(suitVal);
      });

    });

    console.log(vals);

    // console.log(maxCount);
    // console.log(maxVal);

    // if(!$scope.cardSelected && vals.length){
    //   // if a match
    //   console.warn('a match');

    //   $scope.selectCard(vals.pop().i, true);

    // } else
    if(!$scope.cardSelected && known[$scope.cardSelected.number]){
      // if already pursuing match
      // 
      console.warn('pursuing match');
      var counter = 0;
      angular.forEach( known[$scope.cardSelected.number], function(val, index){
        if( counter == 1 ){
          $scope.selectCard( index, true );
        }
        counter++;
      });

    } else {

      console.warn('just guess');

      // default comp guess
      var counter = 0;

      $scope.computerMem.possible.forEach(function(val, index){
        if( counter < 1 && (!known[ val.number ] || !known[ val.number ][ val.suit ]) ){
          $scope.selectCard( index, true);
          counter++;
        }
      });

    }

  };

  var computerEvalSelected = function(event, card){
    // 
    // Add card to known
    // 
    // var _cardToAdd =  {
    //   suit: card.suit,
    //   i: card.i
    // };


    if( $scope.computerMem.known[ card.number ] && !$scope.computerMem.known[ card.number ][ card.suit ]){
      $scope.computerMem.known[ card.number ][ card.suit ] = card;
    } else {
      var cardObj                             = {};
      cardObj[card.suit]                      = card;
      $scope.computerMem.known[ card.number ] = cardObj;      
    }

  };

  var computerEvalMatched = function(event, card){
    // 
    // remove from $scope.computerMem.possible
    //
    // remove from $scope.computerMem.known
    // 

    // console.log($scope.computerMem.known[ card.number ])

    delete $scope.computerMem.known[ card.number ][ card.suit ];
    delete $scope.computerMem.possible[ card.i ];

  };

  $scope.restart = function(){
    $scope.cards = new Cards();
    $scope.cards.shuffle();
    $scope.cardsMatched    = [];
    $scope.cardSelected    = false;
    $scope.playingComputer = false;
  };

  $scope.playComputer = function(){
    $scope.restart();
    $scope.playingComputer = true;
    $scope.computerCardsMatched = [];

    $scope.computerMem = {
      known:   {}, // guessed by either player
      possible: $scope.cards.deck.slice(0)  // unguessed and on game board
    };

    listeners.forEach(function(val){ val(); });

    listeners.push($scope.$on('cardSelected', computerEvalSelected));
    listeners.push($scope.$on('cardsMatched', computerEvalMatched));
  };

  var listeners = [];

});