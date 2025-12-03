import { supabase } from "./config";

/**
 * Vote on a salary entry (upvote or downvote)
 */
export const voteOnSalary = async (
  salaryId: string,
  voteType: "up" | "down"
): Promise<{ success: boolean; message?: string }> => {
  try {
    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, message: "Must be logged in to vote" };
    }

    console.log("voteOnSalary - Checking salary:", salaryId);

    // Get the salary record to check if it exists
    const { data: salary, error: salaryError } = await supabase
      .from("salaries")
      .select("id, upvotes, downvotes")
      .eq("id", salaryId)
      .single();

    if (salaryError || !salary) {
      console.error("Salary not found:", salaryError);
      return { success: false, message: "Salary not found" };
    }

    console.log(
      "Current salary upvotes:",
      salary.upvotes,
      "downvotes:",
      salary.downvotes
    );

    // Check if user already voted
    const { data: existingVote, error: voteError } = await supabase
      .from("salary_votes")
      .select("id, vote_type")
      .eq("salary_id", salaryId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (voteError && voteError.code !== "PGRST116") {
      console.error("Error checking existing vote:", voteError);
      return { success: false, message: "Error checking vote status" };
    }

    console.log("Existing vote:", existingVote);

    if (existingVote) {
      // User already voted - either update or remove
      if (existingVote.vote_type === voteType) {
        // Same vote - remove it (toggle off)
        console.log("Removing existing vote");
        const { error: deleteError } = await supabase
          .from("salary_votes")
          .delete()
          .eq("id", existingVote.id);

        if (deleteError) {
          console.error("Error removing vote:", deleteError);
          return { success: false, message: "Error removing vote" };
        }

        // Wait a bit for trigger to update counts
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Verify counts were updated
        const { data: updatedSalary } = await supabase
          .from("salaries")
          .select("upvotes, downvotes")
          .eq("id", salaryId)
          .single();

        console.log(
          "After delete - upvotes:",
          updatedSalary?.upvotes,
          "downvotes:",
          updatedSalary?.downvotes
        );

        return { success: true };
      } else {
        // Different vote - update to new vote type
        console.log(
          "Switching vote from",
          existingVote.vote_type,
          "to",
          voteType
        );
        const { error: updateError } = await supabase
          .from("salary_votes")
          .update({ vote_type: voteType })
          .eq("id", existingVote.id);

        if (updateError) {
          console.error("Error updating vote:", updateError);
          return { success: false, message: "Error updating vote" };
        }

        // Wait a bit for trigger to update counts
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Verify counts were updated
        const { data: updatedSalary } = await supabase
          .from("salaries")
          .select("upvotes, downvotes")
          .eq("id", salaryId)
          .single();

        console.log(
          "After update - upvotes:",
          updatedSalary?.upvotes,
          "downvotes:",
          updatedSalary?.downvotes
        );

        return { success: true };
      }
    } else {
      // New vote - insert it
      console.log("Inserting new vote");
      const { error: insertError } = await supabase
        .from("salary_votes")
        .insert({
          salary_id: salaryId,
          user_id: user.id,
          vote_type: voteType,
        });

      if (insertError) {
        console.error("Error inserting vote:", insertError);
        return { success: false, message: "Error inserting vote" };
      }

      // Wait a bit for trigger to update counts
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Verify counts were updated
      const { data: updatedSalary } = await supabase
        .from("salaries")
        .select("upvotes, downvotes")
        .eq("id", salaryId)
        .single();

      console.log(
        "After insert - upvotes:",
        updatedSalary?.upvotes,
        "downvotes:",
        updatedSalary?.downvotes
      );

      return { success: true };
    }
  } catch (error) {
    console.error("Error voting on salary:", error);
    return { success: false, message: "An unexpected error occurred" };
  }
};

/**
 * Get user's current vote on a salary entry
 */
export const getUserVote = async (
  salaryId: string
): Promise<"up" | "down" | null> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const { data, error } = await supabase
      .from("salary_votes")
      .select("vote_type")
      .eq("salary_id", salaryId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return data.vote_type as "up" | "down";
  } catch (error) {
    console.error("Error getting user vote:", error);
    return null;
  }
};
