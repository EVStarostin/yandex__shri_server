export interface EventsData {
  events: Event[];
  total: number;
}

export interface Event {
  type: string;
  title: string;
  source: string;
  time: string;
  description: string;
  icon: string;
  size: string;
  data?: {
    type?: string;
    values?: {
      electricity: Array<number | string>;
      water: Array<number | string>;
      gas: Array<number | string>;
    };
    buttons?: string[];
    image?: string;
    temperature?: number;
    humidity?: string;
    albumcover?: string;
    artist?: string;
    track?: {
      name: string;
      length: string;
    };
    volume?: number;
  };
}
