export enum Intent {
      LOCATION = 0
    , SCHEDULE = 1
    , TOPIC = 2
}

export interface Image {
      type: string
    , link: string
}

export interface Event {
      date: string
    , startTime: string
    , endTime: string
    , title: string
    , speakers: string
    , location: string
    , keywords: string
    , link: string
    , type: string
    , images?: Array<Image>
}
