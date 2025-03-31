"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getCurrentBudget(accountId) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("User not found");
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    //* finding user budget

    const budget = await db.budget.findFirst({
      where: {
        userId: user.id,
      },
    });

    //* finding current month expense

    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );

    // Get the last day of the current month by:
    // 1. Creating a date with the next month (currentMonth + 1)
    // 2. Setting the day to 0 (which gives us the last day of previous month)
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    //* Adding Expenses
    const expenses = await db.transaction.aggregate({
      where: {
        userId: user.id,
        type: "EXPENSE",
        date: {
          gte: startOfMonth, // greater than or equal to
          lte: endOfMonth, // less than or equal to
        },
        accountId,
      },
      _sum: {
        amount: true,
      },
    });

    return {
      budget: budget ? { ...budget, amount: budget.amount.toNumber() } : null,
      currentExpenses: expenses._sum.amount
        ? expenses._sum.amount.toNumber()
        : 0,
    };
  } catch (error) {
    console.error("Error Fetching budget", error);
    throw error;
  }
}

//* creating a function for updating budget

export async function updateBudget(amount) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("User not found");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    const budget = await db.budget.upsert({
      where: {
        userId: user.id,
      },
      update: {
        amount,
      },
      create: {
        userId: user.id,
        amount,
      },
    });

    revalidatePath("/dashboard");
    return {
      success: true,
      data: { ...budget, amount: budget.amount.toNumber() },
    };
  } catch (error) {
    console.error("❌ Error updating budget:", error.stack || error.message);

    return { success: false, error: error.message };
  }
}
