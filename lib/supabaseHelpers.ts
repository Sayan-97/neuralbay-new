import { supabase } from "@/app/utils/supabaseClient";

export const checkPurchaseStatus = async (
  principalId: string,
  modelId: string
): Promise<boolean> => {
  const { data, error } = await supabase
    .from("purchases")
    .select("id")
    .eq("principal_id", principalId)
    .eq("model_id", modelId)
    .eq("payment_status", "completed");

  if (error) {
    console.error("Error checking purchase status:", error);
    return false;
  }

  return data.length > 0; // Returns true if a record exists
};

export const recordPurchaseInSupabase = async (
  principalId: string,
  modelId: string,
  paymentStatus: string = "completed"
): Promise<void> => {
  if (!principalId || !modelId) {
    console.error("Error: Missing principalId or modelId");
    return;
  }

  const { data, error } = await supabase
    .from("purchases")
    .insert([
      {
        principal_id: principalId,
        model_id: modelId,
        payment_status: paymentStatus,
      },
    ]);

  if (error) {
    console.error("Error recording purchase in Supabase:", error);
  } else {
    console.log("Purchase recorded in Supabase:", data);
  }
};
