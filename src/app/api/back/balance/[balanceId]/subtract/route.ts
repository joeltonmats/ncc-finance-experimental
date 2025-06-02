import { NextRequest, NextResponse } from "next/server";
import { subtractBalance } from "@/service/balanceService";

/* example: /api/back/balance/[balanceId]/subtract
 * patchSubtractAmountBalance
 * Subtracts a specified amount from a user's balance.
 * @param {NextRequest} req - The incoming request object containing the amount to subtract.
 * @param {Object} params - The route parameters containing the balance ID.
 * @returns {Promise<NextResponse>} JSON response containing the updated balance or an error message.
 * @throws {Error} If the balance ID is missing or if the amount is not a number.
 */
export async function PATCH(
  reqsub: NextRequest,
  { params }: { params: Promise<{ balanceId: string }> }
) {
  const { balanceId } = await params;
  console.log("patchSubtractAmountBalance called with balanceId:", balanceId);
  if (!balanceId) {
    return NextResponse.json({ error: "Missing balance ID" }, { status: 400 });
  }

  if (!reqsub.body) {
    return NextResponse.json(
      { error: "Missing request body" },
      { status: 400 }
    );
  }

  const { amount } = await reqsub.json();

  if (typeof amount !== "number") {
    return NextResponse.json(
      { error: "Missing id or amount" },
      { status: 400 }
    );
  }
  const result = await subtractBalance(balanceId, amount);
  return NextResponse.json(result);
}
