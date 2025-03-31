"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { endOfDay, format, startOfDay, subDays } from "date-fns";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const DATE_RANGES = {
  "7D": { label: "Last 7 Days", days: 7 },
  "1M": { label: "Last 30 Days", days: 30 },
  "6M": { label: "Last 6 Months", days: 180 },
  All: { label: "All Time", days: null },
};

const AccountChart = ({ transactions }) => {
  const [dateRange, setDateRange] = useState("1M");
  const filteredData = useMemo(() => {
    const range = DATE_RANGES[dateRange];
    const now = new Date();
    const startDate = range.days
      ? startOfDay(subDays(now, range.days))
      : startOfDay(new Date(0));

    // Filter transactions that fall within the selected date range
    const filtered = transactions.filter(
      (t) =>
        // Convert transaction date to Date object and check if it falls within the date range
        new Date(t.date) >= startDate && new Date(t.date) <= endOfDay(now)
    );

    // Group the filtered transactions by date
    const grouped = filtered.reduce((acc, transaction) => {
      // Format the transaction date to "MMM dd" (e.g., "Feb 07") for grouping
      const date = format(new Date(transaction.date), "MMM dd");

      // If there is no entry for this date, initialize it with default values
      if (!acc[date]) {
        acc[date] = { date, income: 0, expense: 0 };
      }

      // If the transaction is an income, add its amount to the income field
      if (transaction.type == "INCOME") {
        acc[date].income += transaction.amount;
      }
      // Otherwise, consider it an expense and add the amount to the expense field
      else {
        acc[date].expense += transaction.amount;
      }

      // Return the updated accumulator object
      return acc;
    }, {}); // Initialize the accumulator as an empty object

    //* converting grouped data to array
    return Object.values(grouped).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  }, [transactions, dateRange]);

  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, day) => ({
        income: acc.income + day.income,
        expense: acc.expense + day.expense,
      }),
      { income: 0, expense: 0 } // Initial values for accumulation
    );
  }, [filteredData]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <CardTitle className="text-base font-normal">
          Transaction Overview
        </CardTitle>
        <Select defaultValue={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select Range" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(DATE_RANGES).map(([key, { label }]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="flex justify-around mb-6 text-sm">
          <div className="text-center">
            <p className="text-muted-foreground">Total Income</p>
            <p className="text-lg font-bold text-green-500">
              ${totals.income.toFixed(2)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">Total Expenses</p>
            <p className="text-lg font-bold text-red-500">
              ${totals.expense.toFixed(2)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">Net Balance</p>
            <p
              className={`text-lg font-bold text-green-500 ${
                totals.income - totals.expense >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              ${(totals.income - totals.expense).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredData}
              margin={{
                top: 10,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" />
              <YAxis
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip formatter={(value) => [`$${value}`, undefined]} />
              <Legend />
              <Bar
                dataKey="income"
                name="Income"
                fill="#8884d8"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="expense"
                fill="#82ca9d"
                name="Expense"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountChart;
