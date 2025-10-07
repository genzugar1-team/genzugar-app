"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calculator, TrendingUp } from "lucide-react"
import type { Profile, BMIHistory } from "@/lib/types"
import { useRouter } from "next/navigation"

interface BMICalculatorProps {
  userId: string
  profile: Profile | null
  bmiHistory: BMIHistory[]
}

export function BMICalculator({ userId, profile, bmiHistory }: BMICalculatorProps) {
  const [height, setHeight] = useState(profile?.height_cm?.toString() || "")
  const [weight, setWeight] = useState(profile?.weight_kg?.toString() || "")
  const [bmi, setBmi] = useState<number | null>(null)
  const [category, setCategory] = useState<string>("")
  const [isCalculating, setIsCalculating] = useState(false)
  const router = useRouter()

  const getBMICategory = (bmiValue: number): string => {
    if (bmiValue < 18.5) return "Kurus"
    if (bmiValue < 25) return "Normal"
    if (bmiValue < 30) return "Gemuk"
    return "Obesitas"
  }

  const getBMICategoryColor = (cat: string): string => {
    switch (cat) {
      case "Kurus":
        return "text-blue-600 dark:text-blue-400"
      case "Normal":
        return "text-green-600 dark:text-green-400"
      case "Gemuk":
        return "text-orange-600 dark:text-orange-400"
      case "Obesitas":
        return "text-red-600 dark:text-red-400"
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }

  const calculateBMI = async () => {
    const heightNum = Number.parseFloat(height)
    const weightNum = Number.parseFloat(weight)

    if (!heightNum || !weightNum || heightNum <= 0 || weightNum <= 0) {
      return
    }

    setIsCalculating(true)

    const heightInMeters = heightNum / 100
    const bmiValue = weightNum / (heightInMeters * heightInMeters)
    const bmiCategory = getBMICategory(bmiValue)

    setBmi(Number.parseFloat(bmiValue.toFixed(1)))
    setCategory(bmiCategory)

    const supabase = createClient()
    await supabase.from("bmi_history").insert({
      user_id: userId,
      height_cm: heightNum,
      weight_kg: weightNum,
      bmi_value: Number.parseFloat(bmiValue.toFixed(1)),
      bmi_category: bmiCategory,
    })

    await supabase
      .from("profiles")
      .update({
        height_cm: heightNum,
        weight_kg: weightNum,
      })
      .eq("id", userId)

    setIsCalculating(false)
    router.refresh()
  }

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-gray-800 lg:p-6">
      <div className="mb-4 flex items-center gap-2 lg:mb-6">
        <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
          <Calculator className="h-5 w-5 text-blue-600 dark:text-blue-400 lg:h-6 lg:w-6" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white lg:text-xl">Kalkulator BMI</h3>
      </div>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400 lg:text-base">
        Hitung Body Mass Index kamu untuk pantau kesehatan
      </p>

      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:gap-4">
          <div className="space-y-2">
            <Label htmlFor="height" className="text-sm font-medium lg:text-base">
              Tinggi Badan (cm)
            </Label>
            <Input
              id="height"
              type="number"
              placeholder="170"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="h-11 text-base lg:h-12"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight" className="text-sm font-medium lg:text-base">
              Berat Badan (kg)
            </Label>
            <Input
              id="weight"
              type="number"
              placeholder="60"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="h-11 text-base lg:h-12"
            />
          </div>
        </div>

        <Button
          onClick={calculateBMI}
          disabled={isCalculating}
          className="h-11 w-full rounded-xl text-sm font-semibold active:scale-95 transition-transform lg:h-12 lg:text-base"
        >
          <Calculator className="mr-2 h-4 w-4 lg:h-5 lg:w-5" />
          {isCalculating ? "Menghitung..." : "Hitung BMI"}
        </Button>

        {bmi !== null && (
          <div className="rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 p-4 dark:from-blue-900/20 dark:to-purple-900/20 lg:p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 lg:text-base">BMI Kamu</p>
              <p className="mt-2 text-4xl font-bold text-gray-900 dark:text-white lg:text-5xl">{bmi}</p>
              <p className={`mt-2 text-lg font-semibold lg:text-xl ${getBMICategoryColor(category)}`}>{category}</p>
            </div>
          </div>
        )}

        {bmiHistory.length > 0 && (
          <div className="space-y-2 lg:space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white lg:text-base">Riwayat BMI</h4>
            </div>
            <div className="space-y-2">
              {bmiHistory.slice(0, 3).map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between rounded-xl bg-gray-50 p-3 dark:bg-gray-700/50"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white lg:text-base">
                      BMI: {record.bmi_value}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 lg:text-sm">
                      {new Date(record.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <span className={`text-sm font-semibold lg:text-base ${getBMICategoryColor(record.bmi_category)}`}>
                    {record.bmi_category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
