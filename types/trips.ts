import { TripPlace } from "@/store/planTripStore";

export interface Trip {
  $id?: string;
  userId: string;
  places: TripPlace[];
  guideId: string | null;
  totalAmount: number;
  status: "booked" | "cancelled";
  paymentIntentId: string;
  createdAt: Date;
  routes: any[];
}
