"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CurrencyDisplay } from "@/components/ui/currency"
import { useFormatCurrency } from "@/hooks/use-currency"

export function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState("25000")
  const [interestRate, setInterestRate] = useState("7")
  const [loanTerm, setLoanTerm] = useState("5")
  const [loanType, setLoanType] = useState("personal")
  const formatCurrency = useFormatCurrency()

  const calculateLoan = () => {
    const principal = Number.parseFloat(loanAmount) || 0
    const rate = Number.parseFloat(interestRate) / 100 / 12
    const term = Number.parseFloat(loanTerm) * 12

    const monthlyPayment = (principal * (rate * Math.pow(1 + rate, term))) / (Math.pow(1 + rate, term) - 1)
    const totalPayments = monthlyPayment * term
    const totalInterest = totalPayments - principal

    return {
      monthlyPayment,
      totalPayments,
      totalInterest,
    }
  }

  const generateAmortizationSchedule = () => {
    const principal = Number.parseFloat(loanAmount) || 0
    const rate = Number.parseFloat(interestRate) / 100 / 12
    const term = Number.parseFloat(loanTerm) * 12
    const monthlyPayment = calculateLoan().monthlyPayment

    const schedule = []
    let remainingBalance = principal

    for (let month = 1; month <= Math.min(term, 12); month++) {
      const interestPayment = remainingBalance * rate
      const principalPayment = monthlyPayment - interestPayment
      remainingBalance -= principalPayment

      schedule.push({
        month,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: remainingBalance,
      })
    }

    return schedule
  }

  const result = calculateLoan()
  const schedule = generateAmortizationSchedule()

  const getLoanTypeInfo = (type: string) => {
    switch (type) {
      case "personal":
        return { name: "Personal Loan", typicalRate: "6-36%", description: "Unsecured loan for various purposes" }
      case "auto":
        return { name: "Auto Loan", typicalRate: "3-7%", description: "Secured by the vehicle" }
      case "student":
        return { name: "Student Loan", typicalRate: "3-6%", description: "For education expenses" }
      case "business":
        return { name: "Business Loan", typicalRate: "4-13%", description: "For business purposes" }
      default:
        return { name: "Loan", typicalRate: "Varies", description: "General loan" }
    }
  }

  const loanInfo = getLoanTypeInfo(loanType)

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle>Loan Calculator</CardTitle>
          <CardDescription>Calculate payments for any type of loan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="loan-type">Loan Type</Label>
            <Select value={loanType} onValueChange={setLoanType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="personal">Personal Loan</SelectItem>
                <SelectItem value="auto">Auto Loan</SelectItem>
                <SelectItem value="student">Student Loan</SelectItem>
                <SelectItem value="business">Business Loan</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500 mt-1">
              {loanInfo.description} • Typical rates: {loanInfo.typicalRate}
            </p>
          </div>

          <div>
            <Label htmlFor="loan-amount">Loan Amount</Label>
            <Input
              id="loan-amount"
              type="number"
              placeholder="25000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="interest-rate">Interest Rate (%)</Label>
            <Input
              id="interest-rate"
              type="number"
              step="0.1"
              placeholder="7"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="loan-term">Loan Term (Years)</Label>
            <Input
              id="loan-term"
              type="number"
              placeholder="5"
              value={loanTerm}
              onChange={(e) => setLoanTerm(e.target.value)}
            />
          </div>

          {/* Results */}
          <div className="pt-4 border-t space-y-3">
            <div className="flex justify-between text-lg">
              <span className="font-semibold">Monthly Payment:</span>
              <span className="font-bold text-blue-600">
                <CurrencyDisplay amount={result.monthlyPayment} />
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Interest:</span>
              <span className="font-semibold text-red-600">
                <CurrencyDisplay amount={result.totalInterest} />
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Payments:</span>
              <CurrencyDisplay amount={result.totalPayments} />
            </div>
          </div>

          {/* Loan Tips */}
          <div className="pt-4 border-t">
            <h4 className="font-semibold mb-2">💡 Loan Tips</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Shop around for the best rates</li>
              <li>• Consider shorter terms to save on interest</li>
              <li>• Make extra payments toward principal</li>
              <li>• Check for prepayment penalties</li>
              <li>• Improve credit score for better rates</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Amortization Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Schedule</CardTitle>
          <CardDescription>First 12 months of your loan (sample)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Month</th>
                  <th className="text-right p-2">Payment</th>
                  <th className="text-right p-2">Principal</th>
                  <th className="text-right p-2">Interest</th>
                  <th className="text-right p-2">Balance</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((row) => (
                  <tr key={row.month} className="border-b">
                    <td className="p-2">{row.month}</td>
                    <td className="text-right p-2">{formatCurrency(row.payment)}</td>
                    <td className="text-right p-2 text-blue-600">{formatCurrency(row.principal)}</td>
                    <td className="text-right p-2 text-red-600">{formatCurrency(row.interest)}</td>
                    <td className="text-right p-2">{formatCurrency(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">Understanding Your Payments</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                • <span className="text-blue-600 font-medium">Principal</span>: Reduces your loan balance
              </p>
              <p>
                • <span className="text-red-600 font-medium">Interest</span>: Cost of borrowing money
              </p>
              <p>• Early payments have more interest, later payments have more principal</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
