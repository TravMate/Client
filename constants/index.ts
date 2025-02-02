import logo from "@/assets/images/logo.png";
import destination from "../assets/images/Destination-amico 1.png";
import tourGuide from "../assets/images/Tour guide-amico 1.png";
import journey from "../assets/images/Journey-amico 1.png";
import travmate from "../assets/images/TravMate.png";

export const images = {
  logo,
  destination,
  tourGuide,
  journey,
  travmate,
};

export const onboarding = [
  {
    id: 1,
    title: "Welcome to TravMate!",
    description:
      "“Plan your trip your way. Discover the hidden gems of Egypt without any hassle!”",
    image: images.journey,
  },
  {
    id: 2,
    title: "Create Your Own Itinerary!",
    description:
      "Pick your destinations, set your schedule, and travel like a local",
    image: images.destination,
  },
  {
    id: 3,
    title: "Travel Safely with a Guide",
    description:
      "Rent a car with or without a local guide to make your trip unforgettable",
    image: images.tourGuide,
  },
];

export const data = {
  onboarding,
};
