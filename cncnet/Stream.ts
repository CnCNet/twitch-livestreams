module cncnet
{
    export class Stream
    {
        private url: string;
        private clientId: string;
        private profiles: Array<string>;
        private profilesLive: Array<ITwitchProfile>;
        private filters: Array<string>;

        private readonly TWITCH_API_URL: string = "https://api.twitch.tv/kraken/streams/";

        constructor(config: IStreamConfig, filters: Array<string> = null)
        {
            this.url = config.url;
            this.clientId = config.clientId
            this.filters = filters;
            this.profiles = [];
            this.profilesLive = [];

            this.getProfiles();
        }

        public get liveProfiles(): Array<ITwitchProfile>
        {
            this.getProfiles();
            return this.profilesLive;
        }

        private getProfiles(): void
        {
            $.ajax(this.url).done((response: Array<string>) => this.onProfilesFound(response));
        }

        private onProfilesFound(response: Array<string>)
        {
            this.profiles = response;
            this.getLiveTwitchProfiles();
        }

        private getLiveTwitchProfiles(): void
        {
            // TODO - Rate limit
            this.profilesLive = [];
            
            for (var i: number = 0; i < this.profiles.length; i++)
            {
                var profile = this.profiles[i] as string;
                $.ajaxSetup({ headers: { "Client-ID": this.clientId }});
                $.ajax(this.TWITCH_API_URL + profile['name'])
                    .done((response: ITwitchProfile) => this.onLiveTwitchProfilesFound(response));
            }
        }

        private onLiveTwitchProfilesFound(response: ITwitchProfile): void
        {
            // If stream is live
            if(response.stream != null)
            {
                if(this.filters != null)
                {
                    // Filter channels by game
                    var arr : Array<string> = this.filters.map(function(x){ return x.toLowerCase() });
                    if(arr.indexOf(response.stream.game.toLowerCase()) != -1)
                    {
                        this.profilesLive.push(response);
                    }
                }
                else
                {
                    // No filters supplied
                    this.profilesLive.push(response);
                }
            }
        }
    }
}