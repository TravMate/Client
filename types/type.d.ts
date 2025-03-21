interface UserProps {
  $createdAt: string;
  $id: string;
  $updatedAt: string;
  accessedAt: string;
  email: string;
  emailVerification: boolean;
  labels: string[];
  mfa: boolean;
  name: string;
  passwordUpdate: string;
  phone: string;
  phoneVerification: boolean;
  prefs: Record<string, unknown>; // Prefs can store any key-value pairs
  registration: string;
  status: boolean;
  targets: Target[];
}

// types.ts

interface Geometry {
  location: {
    lat: number;
    lng: number;
  };
  viewport: {
    northeast: {
      lat: number;
      lng: number;
    };
    southwest: {
      lat: number;
      lng: number;
    };
  };
}

interface Photo {
  height: number;
  width: number;
  html_attributions: string[];
  photo_reference: string;
}

interface OpeningHours {
  open_now: boolean;
}

interface PlusCode {
  compound_code: string;
  global_code: string;
}

// export interface Place {
//   business_status: string;
//   geometry: Geometry;
//   icon: string;
//   icon_background_color: string;
//   icon_mask_base_uri: string;
//   name: string;
//   opening_hours: OpeningHours;
//   photos: Photo[];
//   place_id: string;
//   plus_code?: PlusCode; // Optional because not all places have a plus_code
//   rating: number;
//   reference: string;
//   scope: string;
//   types: string[];
//   user_ratings_total: number;
//   vicinity: string;
// }

export interface Place {
  id: string;
  displayName: {
    text: string;
    languageCode: string;
  };
  location: {
    latitude: number;
    longitude: number;
  };
  types: string[];
  rating?: number;
  userRatingCount?: number;
  photos?: Array<{
    name: string;
    widthPx: number;
    heightPx: number;
  }>;
  formattedAddress: string;
}

export type PlacesResponse = Place[];

declare interface GoogleInputProps {
  icon?: string;
  initialLocation?: string;
  containerStyle?: string;
  textInputBackgroundColor?: string;
  handlePress: ({
    // eslint-disable-next-line prettier/prettier
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
}

export interface GoogleInputProps {
  icon?: any;
  containerStyle?: string;
  handlePress: (data: any) => void;
  textInputBackgroundColor?: string;
  initialLocation?: string;
}

export type GoogleTextInputRef = {
  clear: () => void;
};
