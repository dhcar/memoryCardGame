angular.module('starter.services', [])

.service('Cards', function() {

  var Deck = function(){
    this.suits = ['s','c','d','h'];
    this.cards = ['1','2','3','4','5','6','7','8','9','10','11','12','13'];
    this.deck  = [];
    this.make();
  };

  Deck.prototype.make = function(){

    var self = this;

    this.suits.forEach(function(suit){

      self.cards.forEach(function(number){

        // populate deck with 1-c (ace of clubs) etc.

        var card = {
          number: number,
          suit: suit
        };

        self.deck.push( card );

      });

    });

    return this.deck;

  };

  Deck.prototype.shuffle = function(){
    /* Yates shuffle */

    var len = this.deck.length;
    var value;
    var randomIndex;
  
    // While there remain elements to shuffle…
  
    while (len) {
      // Random unshuffled value
      randomIndex = Math.floor(Math.random() * len-- );
  
      // And swap it with the current element.
      value                  = this.deck[len];
      this.deck[len]         = this.deck[randomIndex];
      this.deck[randomIndex] = value;
    }
  
    return this.deck;
  
  };

  return Deck;

});