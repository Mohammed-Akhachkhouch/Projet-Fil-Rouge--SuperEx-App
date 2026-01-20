import { useQuery } from "@tanstack/react-query";
import { getSellerOrders } from "../services/sellerService";

export const useSellerOrders = () =>
  useQuery({
    queryKey: ["seller-orders"],
    queryFn: getSellerOrders,
  });
