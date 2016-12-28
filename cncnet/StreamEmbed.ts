module cncnet
{
    declare var Twitch: any;
    
    export class StreamEmbed
    {
        private container: HTMLDivElement;
        private embedded: Array<HTMLDivElement>;
        private profiles: Array<ITwitchProfile>;

        constructor(container: HTMLDivElement)
        {   
            this.container = container;
            this.embedded = [];
            this.profiles = [];
        }

        public addProfile(profile: ITwitchProfile): void
        {
            if(this.profiles.indexOf(profile) == -1)
                this.profiles.push(profile);

            this.updateEmbed(profile);
        }

        private updateEmbed(profile: ITwitchProfile): void
        {
            var streamId = this.getUniqueStreamId(profile);
            var embed : HTMLDivElement = document.getElementById(streamId) as HTMLDivElement;
            
            if(embed == null)
            {
                embed = document.createElement("div") as HTMLDivElement;
                embed.id = this.createUniqueStreamId(profile);
                document.body.appendChild(embed);
                // This only gets called once
                this.addTwitchPlayer(profile, embed);
            }
            else
            {
                // TODO - Bit messy tidy at some point.
                var profileInfo: HTMLDivElement = document.getElementById("profile_" + embed.id) as HTMLDivElement;

                if(profileInfo == null)
                {
                    profileInfo = document.createElement("div") as HTMLDivElement;
                    embed.appendChild(profileInfo);
                }
                
                profileInfo.id = "profile_" + embed.id;
                profileInfo.classList.add("profile");
                profileInfo.innerHTML =
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
                            + "<li>Total Views: " + profile.stream.channel.views.toLocaleString() + "</li>"
                            + "<li>Followers: " + profile.stream.channel.followers.toLocaleString() + "</li>"
                        + "</ul>";
                + "</div>";
            }
        }

        private addTwitchPlayer(profile: ITwitchProfile, embed: HTMLDivElement): void
        {
            var options = 
            {
                width: 854,
                height: 380,
                channel: profile.stream.channel.display_name
            };

            var player = new Twitch.Player(embed.id, options);
            player.pause();

            var iframe = embed.getElementsByTagName("iframe")[0];
            console.log("Iframe found", iframe);
            if(iframe == null)
            {
                console.log("Adding Player to Embed");
                embed.appendChild(player);
            }            
        }

        private createUniqueStreamId(profile: ITwitchProfile): string
        {
            return "stream_" + profile.stream.channel.display_name;
        }

        private getUniqueStreamId(profile: ITwitchProfile): string
        {
            return "stream_" + profile.stream.channel.display_name;
        }
    }
}