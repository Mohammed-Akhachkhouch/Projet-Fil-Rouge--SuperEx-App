import { useMutation } from "@tanstack/react-query";
import { createOrder } from "../services/orderService";

export const useCreateOrderMutation = () =>
  useMutation({
    mutationFn: createOrder,
  });
