import { fetchAutocompletePlacesNew } from "@/api/googleAutoCompleteApi";
import { useQuery } from "@tanstack/react-query";

export const useGoogleAutoComplete = (
  input: string,
  debouncedInput: string
) => {
  return useQuery({
    queryKey: ["autocomplete-places"],
    queryFn: () => fetchAutocompletePlacesNew(input),
    enabled: debouncedInput.length > 1, // Only fetch when input is at least 3 character
  });
};
