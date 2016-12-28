module cncnet
{
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
            console.log(this.profiles.indexOf(profile));
            if(this.profiles.indexOf(profile) == -1)
            {
                this.profiles.push(profile);
            }
            this.updateEmbed(profile);
        }

        private updateEmbed(profile: ITwitchProfile): HTMLDivElement
        {
            var streamId = this.getUniqueStreamId(profile);
            var embed : HTMLDivElement = document.getElementById(streamId) as HTMLDivElement;
            
            if(embed == null)
            {
                embed = document.createElement("div") as HTMLDivElement;
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
            + "</div>";
        
            return embed;
        }

        private createUniqueStreamId(profile: ITwitchProfile): string
        {
            console.log("Creating unique id");
            return "stream_" + profile.stream.channel.display_name;
        }

        private getUniqueStreamId(profile: ITwitchProfile): string
        {
            console.log("Getting unique id");
            return "stream_" + profile.stream.channel.display_name;
        } 
    }
}