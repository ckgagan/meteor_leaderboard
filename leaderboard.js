// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players."

Players = new Meteor.Collection("players");

if (Meteor.is_client) {
  Template.leaderboard.players = function () {
    return Players.find({}, {sort: {score: -1, name: 1}});
  };

  Template.leaderboard.selected_name = function () {
    var player = Players.findOne(Session.get("selected_player"));
    return player && player.name;
  };

  Template.player.selected = function () {
    return Session.equals("selected_player", this._id) ? "selected" : '';
  };

  Template.leaderboard.events = {
    'click input.inc': function () {
      Players.update(Session.get("selected_player"), {$inc: {score: 5}});
    },
    'click input.remove': function() {
      var player = Players.findOne(Session.get("selected_player"));
      Players.remove({_id: player._id})
    }

  };

  // Template.leaderboard.events = {
  //   'click input.remove': function() {
  //     var player = Players.findOne(Session.get("selected_player"));
  //     Players.remove({_id: player._id})
  //   }
  // };

  Template.player.events = {
    'click': function () {
      Session.set("selected_player", this._id);
    }
  };

  Template.add_player.events = {
    'click input.add': function () {
      Players.insert({name: $('#player_name').val(), score: 0})
    }
  };
}


// On server startup, create some players if the database is empty.
if (Meteor.is_server) {
  Meteor.startup(function () {
    if (Players.find().count() === 0) {
      var names = ["Ada Lovelace",
                   "Grace Hopper",
                   "Marie Curie",
                   "Carl Friedrich Gauss",
                   "Nikola Tesla",
                   "Claude Shannon"];
      for (var i = 0; i < names.length; i++)
        Players.insert({name: names[i], score: Math.floor(Math.random()*10)*5});
    }
  });
}

