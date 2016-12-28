/// <reference path="typings/index.d.ts" />
window.onload = function () {
    // TODO Tidy up into something simple
    // Basic Usuage Example
    var container = document.querySelector(".twitch-container");
    var config = {
        clientId: "cds8o89o71q4a4us2desr58fo3tyizd",
        url: "app.json" // "https://cncnet.org/app_json/streams.php"
    };
    var stream = new cncnet.Stream(config);
    var streamEmbed = new cncnet.StreamEmbed(container);
    var timer = setInterval(function () {
        var liveUsernames = stream.liveUsernames;
        if (liveUsernames != null) {
            for (var i = 0; i < liveUsernames.length; i++) {
                var user = liveUsernames[i];
                streamEmbed.addProfile(user);
            }
        }
        console.log("Live Usernames: ", liveUsernames);
    }, 3000);
};
var cncnet;
(function (cncnet) {
    var Stream = (function () {
        function Stream(config) {
            this.TWITCH_API_URL = "https://api.twitch.tv/kraken/streams/";
            this.url = config.url;
            this.clientId = config.clientId;
            this.usernames = [];
            this.usernamesLive = [];
            this.getUsernames();
        }
        Object.defineProperty(Stream.prototype, "liveUsernames", {
            get: function () {
                this.getUsernames();
                return this.usernamesLive;
            },
            enumerable: true,
            configurable: true
        });
        Stream.prototype.getUsernames = function () {
            var _this = this;
            $.ajax(this.url).done(function (response) { return _this.onUsernamesFound(response); });
        };
        Stream.prototype.onUsernamesFound = function (response) {
            this.usernames = response;
            this.getLiveTwitchUsernames();
        };
        Stream.prototype.getLiveTwitchUsernames = function () {
            var _this = this;
            // TODO - Rate limit
            this.usernamesLive = [];
            for (var i = 0; i < this.usernames.length; i++) {
                var user = this.usernames[i];
                $.ajaxSetup({ headers: { "Client-ID": this.clientId } });
                $.ajax(this.TWITCH_API_URL + user['name'])
                    .done(function (response) { return _this.onLiveTwitchUsernamesFound(response); });
            }
        };
        Stream.prototype.onLiveTwitchUsernamesFound = function (response) {
            if (response.stream != null) {
                if (this.usernamesLive.indexOf(response)) {
                    this.usernamesLive.push(response);
                }
            }
        };
        return Stream;
    }());
    cncnet.Stream = Stream;
})(cncnet || (cncnet = {}));
var cncnet;
(function (cncnet) {
    var StreamEmbed = (function () {
        function StreamEmbed(container) {
            this.container = container;
            this.embedded = [];
            this.profiles = [];
        }
        StreamEmbed.prototype.addProfile = function (profile) {
            console.log(this.profiles.indexOf(profile));
            if (this.profiles.indexOf(profile) == -1) {
                this.profiles.push(profile);
            }
            this.updateEmbed(profile);
        };
        StreamEmbed.prototype.updateEmbed = function (profile) {
            var streamId = this.getUniqueStreamId(profile);
            var embed = document.getElementById(streamId);
            if (embed == null) {
                embed = document.createElement("div");
                embed.id = this.createUniqueStreamId(profile);
                document.body.appendChild(embed);
            }
            embed.innerHTML =
                "<div class='bio'>"
                    + "<div class='profile'>"
                    + "<h3><span class='badge'>Live</span>"
                    + profile.stream.channel.display_name
                    + "<span class='badge badge-right'> Viewers: "
                    + profile.stream.viewers
                    + "</span>"
                    + "</h3>"
                    + "</div>"
                    + "<ul class='list-unstyled'>"
                    + "<li>Playing : " + profile.stream.game + "</li>"
                    + "<li>Average FPS: " + profile.stream.average_fps.toFixed(1) + "</li>"
                    + "<li>Total Views: " + profile.stream.channel.views + "</li>"
                    + "<li>Followers: " + profile.stream.channel.followers + "</li>"
                    + "</ul>";
            +"</div>";
            return embed;
        };
        StreamEmbed.prototype.createUniqueStreamId = function (profile) {
            console.log("Creating unique id");
            return "stream_" + profile.stream.channel.display_name;
        };
        StreamEmbed.prototype.getUniqueStreamId = function (profile) {
            console.log("Getting unique id");
            return "stream_" + profile.stream.channel.display_name;
        };
        return StreamEmbed;
    }());
    cncnet.StreamEmbed = StreamEmbed;
})(cncnet || (cncnet = {}));
