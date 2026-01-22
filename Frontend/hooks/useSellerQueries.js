import { useQuery } from "@tanstack/react-query";
import { getSellerOrders, getSellerOrderById } from "../services/sellerService";

export const useSellerOrders = () =>
  useQuery({
    queryKey: ["seller-orders"],
    queryFn: getSellerOrders,
  });

export const useSellerOrder = (id) =>
  useQuery({
    queryKey: ["seller-order", id],
    queryFn: () => getSellerOrderById(id),
    enabled: !!id,
  });
