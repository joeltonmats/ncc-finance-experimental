import { NextRequest, NextResponse } from "next/server";
import { addBalance } from "@/service/balanceService";

/* example: /api/back/balance/USER_ID/add
 * patchAddAmountBalance
 * Adds a specified amount to a user's balance.
 * @param {NextRequest} req - The incoming request object containing the amount to add.
 * @param {Object} params - The route parameters containing the balance ID.
 * @returns {Promise<NextResponse>} JSON response containing the updated balance or an error message.
 * @throws {Error} If the balance ID is missing or if the amount is not a number.
 */
export async function PATCH(
  reqadd: NextRequest,
  { params }: { params: Promise<{ balanceId: string }> }
) {
  const { balanceId } = await params;
  const { amount } = await reqadd.json();

  if (!balanceId) {
    return NextResponse.json({ error: "Missing balance ID" }, { status: 400 });
  }
  if (typeof amount !== "number") {
    return NextResponse.json({ error: "Missing amount" }, { status: 400 });
  }
  const result = await addBalance(balanceId, amount);
  return NextResponse.json(result);
}
