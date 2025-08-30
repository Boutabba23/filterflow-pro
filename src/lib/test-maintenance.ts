import { supabase } from "@/integrations/supabase/client";

export const testMaintenanceConnection = async () => {
  console.log("Testing maintenance connection...");
  try {
    // First test if we can connect to Supabase at all
    const { data: testData, error: testError } = await supabase
      .from('maintenance_preventive')
      .select('count', { count: 'exact', head: true });

    if (testError) {
      console.error("Connection test failed:", testError);
      return { success: false, error: testError.message };
    }

    console.log("Connection test successful. Count:", testData);

    // Now try to fetch actual data
    const { data, error } = await supabase
      .from('maintenance_preventive')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5); // Limit to 5 for testing

    if (error) {
      console.error("Fetch error:", error);
      return { success: false, error: error.message };
    }

    console.log("Fetch successful. Data:", data);
    return { success: true, data: data || [] };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { success: false, error: err.message };
  }
};
