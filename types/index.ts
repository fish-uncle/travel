export interface Trip {
  id: string;
  title: string;
  cover?: string; // base64, 可选
  startAt: string; // YYYY-MM-DD
  endAt: string;
  days: Day[];
  createdAt: number;
  updatedAt: number;
  deletedAt?: number; // 软删
}

export interface Day {
  id?: string;
  tripId?: string;
  date: string;
  items: Item[];
}

export type ItemType = "flight" | "train" | "bus" | "hotel" | "spot" | "other";

export interface Item {
  id: string;
  type: ItemType;
  time?: string; // HH:mm
  flightNo?: string;
  trainNo?: string;
  busNo?: string;
  hotelName?: string;
  spotName?: string;
  title?: string;
  from?: string; // 城市
  to?: string; // 城市
  address?: string; // 酒店/景点地址
  lat?: number;
  lng?: number;
  coordinates?: {
    from?: { lat: number; lng: number };
    to?: { lat: number; lng: number };
  };
  note?: Note;
}

export interface Note {
  text?: string;
  attachments: Attachment[];
}

export interface Attachment {
  id: string;
  type: "pdf" | "image";
  data: string; // base64
  name: string;
}

export type TripStatus = "all" | "ongoing" | "upcoming" | "completed";

export interface TripFilter {
  status: TripStatus;
  keyword?: string;
}

export interface CreateTripData {
  title: string;
  cover?: string;
  startAt: string;
  endAt: string;
}

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  type: ItemType;
  item: Item;
}

export interface PageTransition {
  name: string;
  mode: "out-in" | "in-out";
}
