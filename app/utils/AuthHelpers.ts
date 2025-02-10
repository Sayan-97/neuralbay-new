// authHelpers.ts
import { supabase } from "./supabaseClient";

// Check if the user has already paid for the specific model
export const isUserAuthorized = async (principal: string | null, modelId: string): Promise<boolean> => {
  if (!principal) {
    console.error("Principal is null, cannot authorize");
    return false;
  }

  try {
    const { data, error } = await supabase
      .from("authorized_users")
      .select("principal")
      .eq("principal", principal)
      .eq("model_id", modelId);  // Corrected to 'model_id'

    if (error) {
      console.error("Error checking authorization:", error);
      return false;
    }

    return data && data.length > 0;
  } catch (err) {
    console.error("Exception during authorization check:", err);
    return false;
  }
};

// Save the user's payment status after successful payment
export const savePaymentStatus = async (principal: string, modelId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from("authorized_users")
      .insert([{ principal, model_id: modelId }]);  // Use 'model_id' from your table structure

    if (error) {
      console.error("Error saving payment status:", error);
    } else {
      console.log("Payment status saved successfully");
    }
  } catch (err) {
    console.error("Exception during payment status save:", err);
  }
};