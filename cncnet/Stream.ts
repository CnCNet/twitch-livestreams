module cncnet
{
    export class Stream
    {
        private url: string;
        private clientId: string;
        private usernames: Array<string>;
        private usernamesLive: Array<ITwitchProfile>;

        private readonly TWITCH_API_URL: string = "https://api.twitch.tv/kraken/streams/";

        constructor(config: IStreamConfig)
        {
            this.url = config.url;
            this.clientId = config.clientId
            this.usernames = [];
            this.usernamesLive = [];

            this.getUsernames();
        }

        public get liveUsernames(): Array<ITwitchProfile>
        {
            this.getUsernames();
            return this.usernamesLive;
        }

        private getUsernames(): void
        {
            $.ajax(this.url).done((response: Array<string>) => this.onUsernamesFound(response));
        }

        private onUsernamesFound(response: Array<string>)
        {
            this.usernames = response;
            this.getLiveTwitchUsernames();
        }

        private getLiveTwitchUsernames(): void
        {
            // TODO - Rate limit
            this.usernamesLive = [];
            
            for (var i: number = 0; i < this.usernames.length; i++)
            {
                var user = this.usernames[i] as string;
                $.ajaxSetup({ headers: { "Client-ID": this.clientId }});
                $.ajax(this.TWITCH_API_URL + user['name'])
                    .done((response: ITwitchProfile) => this.onLiveTwitchUsernamesFound(response));
            }
        }

        private onLiveTwitchUsernamesFound(response: ITwitchProfile): void
        {
            if(response.stream != null)
            {
                if(this.usernamesLive.indexOf(response))
                {
                    this.usernamesLive.push(response);
                }
            }
        }
    }
}
