import { useQuery } from "@tanstack/react-query";
import { getOrderById } from "../services/orderService";

export const useOrder = (id) =>
  useQuery({
    queryKey: ["order", id],
    queryFn: () => getOrderById(id),
    enabled: !!id,
  });
