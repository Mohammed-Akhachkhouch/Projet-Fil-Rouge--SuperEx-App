import { useQuery } from "@tanstack/react-query";
import { getOrderById, getOrders } from "../services/orderService";

export const useOrders = () =>
  useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });

export const useOrder = (id) =>
  useQuery({
    queryKey: ["order", id],
    queryFn: () => getOrderById(id),
    enabled: !!id,
  });
