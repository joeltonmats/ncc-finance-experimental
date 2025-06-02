import {
  getTransactionById,
  processDeleteTransaction,
  processTransactionUpdate,
} from "@/service/transactionService";
import { NextRequest, NextResponse } from "next/server";

/**
 * Handles GET requests for fetching a specific transaction by its balance and transaction IDs.
 *
 * @param req - The incoming Next.js request object.
 * @param params - An object containing the route parameters as a Promise, including:
 *   - balanceId: The ID of the balance to which the transaction belongs.
 *   - transactionId: The ID of the transaction to retrieve.
 * @returns A JSON response containing the transaction data if found, or an error message with the appropriate HTTP status code.
 *
 * @throws Returns a 400 status if required parameters are missing.
 * @throws Returns a 404 status if the transaction is not found.
 * @throws Returns a 500 status if an unexpected error occurs during retrieval.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ balanceId: string; transactionId: string }> }
) {
  const { balanceId, transactionId } = await params;
  if (!balanceId || !transactionId) {
    return NextResponse.json(
      { error: "Missing balance or transaction ID" },
      { status: 400 }
    );
  }

  try {
    const transaction = await getTransactionById(balanceId, transactionId);
    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(transaction);
  } catch (error) {
    console.error("Error fetching transaction:", error);
    return NextResponse.json(
      { error: "Failed to fetch transaction" },
      { status: 500 }
    );
  }
}
/**
 * Handles HTTP DELETE requests to remove a specific transaction by its ID for a given balance.
 *
 * @param req - The incoming Next.js request object.
 * @param params - An object containing the `balanceId` and `transactionId` as strings, wrapped in a Promise.
 * @returns A JSON response with the deleted transaction data on success, or an error message on failure.
 *
 * @remarks
 * - Returns a 400 status code if either `balanceId` or `transactionId` is missing.
 * - Returns a 200 status code with the deleted transaction on success.
 * - Returns a 500 status code if an error occurs during deletion.
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ balanceId: string; transactionId: string }> }
) {
  const { balanceId, transactionId } = await params;
  if (!balanceId || !transactionId) {
    return NextResponse.json(
      { error: "Missing balance or transaction ID" },
      { status: 400 }
    );
  }

  try {
    const deletedTransaction = await processDeleteTransaction(
      balanceId,
      transactionId
    );
    return NextResponse.json(deletedTransaction, { status: 200 });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return NextResponse.json(
      { error: "Failed to delete transaction" },
      { status: 500 }
    );
  }
}
/**
 * Handles PATCH requests to update a specific transaction for a given balance.
 *
 * @param req - The incoming Next.js request object.
 * @param params - An object containing the `balanceId` and `transactionId` as route parameters (provided as a Promise).
 * @returns A JSON response with the updated transaction on success, or an error message on failure.
 *
 * @remarks
 * - Returns a 400 status if either `balanceId` or `transactionId` is missing.
 * - Returns a 200 status with the updated transaction on success.
 * - Returns a 500 status if an error occurs during the update process.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ balanceId: string; transactionId: string }> }
) {
  const { balanceId, transactionId } = await params;
  if (!balanceId || !transactionId) {
    return NextResponse.json(
      { error: "Missing balance or transaction ID" },
      { status: 400 }
    );
  }
  const oldTransaction = await getTransactionById(balanceId, transactionId);
  if (!oldTransaction) {
    return NextResponse.json(
      { error: "Transaction not found" },
      { status: 404 }
    );
  }
  try {
    const newTransaction = await req.json();
    const updatedTransaction = await processTransactionUpdate(
      balanceId,
      oldTransaction,
      newTransaction
    );
    return NextResponse.json(updatedTransaction, { status: 200 });
  } catch (error) {
    console.error("Error updating transaction:", error);
    return NextResponse.json(
      { error: "Failed to update transaction" },
      { status: 500 }
    );
  }
}
