/// <reference path="../typings/index.d.ts" />
module cncnet
{
    export class StreamEmbed
    {
        private container: HTMLDivElement;
        private embedded: Array<HTMLDivElement>;
        private chat: boolean;
        private profiles: Array<ITwitchProfile>;
        private readonly TWITCH_CHAT_URL: string = "https://www.twitch.tv/";

        constructor(container: HTMLDivElement, chat: boolean = false)
        {   
            this.container = container;
            this.embedded = [];
            this.profiles = [];
            this.chat = chat;
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
                // This only gets called once
                embed = document.createElement("div") as HTMLDivElement;
                embed.id = this.createUniqueStreamId(profile);
                embed.classList.add("twitch-profile-embed");
                this.container.appendChild(embed);
            }
            else
            {
                var profileInfo: HTMLDivElement = document.getElementById("profile_" + embed.id) as HTMLDivElement;

                if(profileInfo == null)
                {
                    // We only want to initialize this block once
                    profileInfo = document.createElement("div") as HTMLDivElement;
                    embed.appendChild(profileInfo);

                    // Check Twitch Player exists already
                    var iframe = embed.getElementsByTagName("iframe")[0] as HTMLIFrameElement;
                    if(iframe == null)
                    {
                        this.addTwitchPlayer(profile, embed);
                        
                        // // If chat is enabled
                        if(this.chat)
                        {
                            this.addTwitchChat(profile, embed);
                        }
                    }                    
                }
                
                // We want to update this on a regular occasion
                profileInfo.id = "profile_" + embed.id;
                profileInfo.classList.add("twitch-profile-bio");
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

        private addTwitchPlayer(profile: ITwitchProfile, embed: HTMLDivElement): HTMLDivElement
        {
            var options = 
            {
                width: 854,
                height: 380,
                channel: profile.stream.channel.display_name
            };

            var player = new Twitch.Player(embed.id, options);
            player.pause();

            return player;
        }

        private addTwitchChat(profile: ITwitchProfile, embed: HTMLDivElement): void
        {
            var twitchChat : HTMLDivElement = document.createElement("div");
            twitchChat.classList.add("chat");
            
            var chatIframe = document.createElement("iframe") as HTMLIFrameElement;
            chatIframe.src = this.TWITCH_CHAT_URL + profile.stream.channel.display_name + "/chat";
            chatIframe.width = "500";
            chatIframe.height = "400";

            twitchChat.appendChild(chatIframe);
            embed.appendChild(twitchChat);
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