"use server";

import { adminClient } from "@/lib/admin-supabase";

export async function signUpAction(formData: {
  userId: string;
  email: string;
  fullName: string;
  phone: string;
  dateOfBirth: string;
  ssnLast4: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  accountType: string;
  currency: string;
}) {
  // Profile is created using admin client (service role key bypasses RLS)
  const { error: profileError } = await adminClient.from("profiles").insert({
    user_id: formData.userId,
    email: formData.email,
    full_name: formData.fullName,
    phone: formData.phone,
    date_of_birth: formData.dateOfBirth,
    ssn_last_four: formData.ssnLast4,
    address: {
      street: formData.street,
      city: formData.city,
      state: formData.state,
      zip_code: formData.zipCode,
    },
    kyc_status: "pending",
  });

  if (profileError) {
    return { success: false, error: `Profile creation failed: ${profileError.message}` };
  }

  return { success: true };
}