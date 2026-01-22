import { useQuery } from "@tanstack/react-query";
import { getSellerOrders, getSellerStats, getSellerProfile } from "../services/sellerService";

export const useSellerOrders = () =>
  useQuery({
    queryKey: ["seller-orders"],
    queryFn: getSellerOrders,
  });

export const useSellerStats = () =>
  useQuery({
    queryKey: ["seller-stats"],
    queryFn: getSellerStats,
  });

export const useSellerProfile = () =>
  useQuery({
    queryKey: ["seller-profile"],
    queryFn: getSellerProfile,
  });
