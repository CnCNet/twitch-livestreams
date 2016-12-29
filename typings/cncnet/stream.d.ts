interface ITwitchProfile
{
    _links: Object;
    stream: ITwitchProfileData;
}

interface ITwitchProfileData
{
    _id: number;
    _links: Object;
    channel: ITwitchProfileChannel;
    preview: ITwitchStreamPreview;
    average_fps: number;
    created_at: string;
    delay: number;
    game: string;
    is_playlist: boolean;
    video_height: number;
    viewers: number;
}

interface ITwitchStreamPreview
{
    large: string;
    medium: string;
    small: string;
    template: string;
}

interface ITwitchProfileChannel
{
    _id: number;
    created_at: string;
    display_name: string;
    followers: number;
    game: string;
    language: string;
    logo: string;
    video_banner: string;
    views: number;
    status: string;
}

interface IStreamConfig
{
    url: string;
    clientId: string;
}

interface IStreamProfile
{
    name: string;
}

declare var Twitch: any;