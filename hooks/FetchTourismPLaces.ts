import { fetchTourismPlacesApi } from "@/api/googlePlacesApi";
import { useQuery } from "@tanstack/react-query";

export const useFetchTourismPlaces = (radius: number) => {
  return useQuery({
    queryKey: ["tourism-places"],
    queryFn: () => fetchTourismPlacesApi(radius),
  });
};
