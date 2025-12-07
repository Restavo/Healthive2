"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Activity, ArrowLeft, User, Target, Calculator, TrendingUp } from "lucide-react"

export default function ProfilePage() {
  // Health Profile State
  const [profile, setProfile] = useState({
    name: "",
    gender: "",
    age: "",
    weight: "",
    height: "",
    activityLevel: "",
  })

  // Results State
  const [bmi, setBmi] = useState<number | null>(null)
  const [bmiCategory, setBmiCategory] = useState("")
  const [bmr, setBmr] = useState<number | null>(null)
  const [tdee, setTdee] = useState<number | null>(null)

  // Weight Goals State
  const [goals, setGoals] = useState({
    targetWeight: "",
    timeFrame: "",
    goalType: "",
  })

  // Nutrition Plan State
  const [nutritionPlan, setNutritionPlan] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  })

  // Load saved data on component mount
  useEffect(() => {
    const savedProfile = localStorage.getItem("healthProfile")
    const savedGoals = localStorage.getItem("weightGoals")

    if (savedProfile) {
      const parsed = JSON.parse(savedProfile)
      setProfile(parsed)
      if (parsed.bmi) setBmi(parsed.bmi)
      if (parsed.bmiCategory) setBmiCategory(parsed.bmiCategory)
      if (parsed.bmr) setBmr(parsed.bmr)
      if (parsed.tdee) setTdee(parsed.tdee)
    }

    if (savedGoals) {
      const parsed = JSON.parse(savedGoals)
      setGoals(parsed)
      if (parsed.dailyCalories) {
        setNutritionPlan({
          calories: parsed.dailyCalories,
          protein: parsed.protein,
          carbs: parsed.carbs,
          fat: parsed.fat,
        })
      }
    }
  }, [])

  // Calculate BMI
  const calculateBMI = () => {
    const weight = Number.parseFloat(profile.weight)
    const height = Number.parseFloat(profile.height) / 100 // convert cm to m

    if (!weight || !height) return

    const bmiValue = weight / (height * height)
    setBmi(bmiValue)

    // Determine BMI Category
    let category = ""
    if (bmiValue < 18.5) category = "Underweight"
    else if (bmiValue < 25) category = "Normal"
    else if (bmiValue < 30) category = "Overweight"
    else if (bmiValue < 35) category = "Obesity I"
    else if (bmiValue < 40) category = "Obesity II"
    else category = "Obesity III"

    setBmiCategory(category)

    // Calculate BMR
    const age = Number.parseFloat(profile.age)
    let bmrValue = 0

    if (profile.gender === "male") {
      bmrValue = 88.4 + 13.4 * weight + 4.8 * Number.parseFloat(profile.height) - 5.68 * age
    } else if (profile.gender === "female") {
      bmrValue = 447.6 + 9.25 * weight + 3.1 * Number.parseFloat(profile.height) - 4.33 * age
    }

    setBmr(bmrValue)

    // Calculate TDEE
    const activityMultipliers: { [key: string]: number } = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      extra: 1.9,
    }

    const tdeeValue = bmrValue * (activityMultipliers[profile.activityLevel] || 1.2)
    setTdee(tdeeValue)

    // Save to localStorage
    const updatedProfile = {
      ...profile,
      bmi: bmiValue,
      bmiCategory: category,
      bmr: bmrValue,
      tdee: tdeeValue,
    }
    localStorage.setItem("healthProfile", JSON.stringify(updatedProfile))
  }

  // Generate Nutrition Plan
  const generatePlan = () => {
    if (!tdee || !goals.targetWeight || !goals.timeFrame) {
      alert("Silakan hitung BMI terlebih dahulu dan isi target berat badan")
      return
    }

    const currentWeight = Number.parseFloat(profile.weight)
    const targetWeight = Number.parseFloat(goals.targetWeight)
    const timeFrameWeeks = Number.parseFloat(goals.timeFrame)
    const timeFrameDays = timeFrameWeeks * 7

    // Calculate weight difference
    const weightDiff = targetWeight - currentWeight

    // Determine goal type
    let goalType = ""
    if (weightDiff > 0) goalType = "gain"
    else if (weightDiff < 0) goalType = "lose"
    else goalType = "maintain"

    // Calculate calorie adjustment
    // 1 kg fat = 7700 calories
    const totalCalorieAdjustment = Math.abs(weightDiff) * 7700
    const dailyCalorieAdjustment = totalCalorieAdjustment / timeFrameDays

    let dailyCalories = tdee
    if (goalType === "gain") {
      dailyCalories += dailyCalorieAdjustment
    } else if (goalType === "lose") {
      dailyCalories -= dailyCalorieAdjustment
    }

    // Calculate macros (standard distribution)
    // Protein: 25%, Carbs: 50%, Fat: 25%
    const protein = (dailyCalories * 0.25) / 4 // 4 cal per gram
    const carbs = (dailyCalories * 0.5) / 4 // 4 cal per gram
    const fat = (dailyCalories * 0.25) / 9 // 9 cal per gram

    const plan = {
      calories: dailyCalories,
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fat: Math.round(fat),
    }

    setNutritionPlan(plan)

    // Update goals
    const updatedGoals = {
      ...goals,
      goalType,
      dailyCalories,
      protein: plan.protein,
      carbs: plan.carbs,
      fat: plan.fat,
    }
    setGoals(updatedGoals)

    // Save to localStorage
    localStorage.setItem("weightGoals", JSON.stringify(updatedGoals))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-green-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="bg-gradient-to-br from-green-500 to-teal-600 p-2 rounded-xl">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                HEALTHIVE
              </h1>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Page Title */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Profil Kesehatan & Target</h2>
            <p className="text-gray-600">Masukkan data tubuh Anda dan tetapkan target berat badan ideal</p>
          </div>

          {/* Health Profile Form */}
          <Card className="border-green-100">
            <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-green-600" />
                Data Profil Kesehatan
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input
                    id="name"
                    placeholder="Masukkan nama Anda"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Jenis Kelamin</Label>
                  <Select value={profile.gender} onValueChange={(value) => setProfile({ ...profile, gender: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis kelamin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Laki-laki</SelectItem>
                      <SelectItem value="female">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Usia (tahun)</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="25"
                    value={profile.age}
                    onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Berat Badan (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    placeholder="65"
                    value={profile.weight}
                    onChange={(e) => setProfile({ ...profile, weight: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="height">Tinggi Badan (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="170"
                    value={profile.height}
                    onChange={(e) => setProfile({ ...profile, height: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="activity">Tingkat Aktivitas</Label>
                  <Select
                    value={profile.activityLevel}
                    onValueChange={(value) => setProfile({ ...profile, activityLevel: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tingkat aktivitas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">Sangat Ringan (1.2)</SelectItem>
                      <SelectItem value="light">Ringan (1.375)</SelectItem>
                      <SelectItem value="moderate">Sedang (1.55)</SelectItem>
                      <SelectItem value="active">Aktif (1.725)</SelectItem>
                      <SelectItem value="extra">Sangat Aktif (1.9)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  onClick={calculateBMI}
                  className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  Hitung BMI & BMR
                </Button>
              </div>

              {/* BMI Results */}
              {bmi && (
                <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Hasil Perhitungan:</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">BMI Anda</div>
                      <div className="text-2xl font-bold text-green-600">{bmi.toFixed(1)}</div>
                      <div className="text-sm text-gray-500">{bmiCategory}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">BMR</div>
                      <div className="text-2xl font-bold text-teal-600">{bmr?.toFixed(0)}</div>
                      <div className="text-sm text-gray-500">kkal/hari</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">TDEE</div>
                      <div className="text-2xl font-bold text-emerald-600">{tdee?.toFixed(0)}</div>
                      <div className="text-sm text-gray-500">kkal/hari</div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-white rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Kategori {bmiCategory}:</strong>{" "}
                      {bmiCategory === "Underweight" &&
                        "Tingkatkan asupan nutrisi seimbang dan konsultasikan dengan ahli gizi."}
                      {bmiCategory === "Normal" && "Pertahankan pola makan seimbang dan rutin beraktivitas fisik."}
                      {bmiCategory === "Overweight" && "Kurangi kalori secara bertahap dan tingkatkan aktivitas fisik."}
                      {bmiCategory.includes("Obesity") &&
                        "Konsultasikan dengan dokter untuk program penurunan berat badan yang aman."}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Weight Goals Section */}
          <Card id="goals" className="border-teal-100">
            <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50">
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-teal-600" />
                Target Berat Badan
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="targetWeight">Target Berat Badan (kg)</Label>
                  <Input
                    id="targetWeight"
                    type="number"
                    step="0.1"
                    placeholder="60"
                    value={goals.targetWeight}
                    onChange={(e) => setGoals({ ...goals, targetWeight: e.target.value })}
                  />
                  <p className="text-xs text-gray-500">Berat saat ini: {profile.weight} kg</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeFrame">Jangka Waktu (minggu)</Label>
                  <Input
                    id="timeFrame"
                    type="number"
                    placeholder="8"
                    value={goals.timeFrame}
                    onChange={(e) => setGoals({ ...goals, timeFrame: e.target.value })}
                  />
                  <p className="text-xs text-gray-500">Rentang sehat: 4-12 minggu</p>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  onClick={generatePlan}
                  className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Generate Rencana Nutrisi
                </Button>
              </div>

              {/* Nutrition Plan Results */}
              {nutritionPlan.calories > 0 && (
                <div className="mt-6 p-4 bg-teal-50 rounded-xl border border-teal-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Rencana Nutrisi Harian Anda:</h4>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-white p-4 rounded-lg">
                      <div className="text-sm text-gray-600">Kalori</div>
                      <div className="text-2xl font-bold text-teal-600">{Math.round(nutritionPlan.calories)}</div>
                      <div className="text-xs text-gray-500">kkal</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <div className="text-sm text-gray-600">Protein</div>
                      <div className="text-2xl font-bold text-emerald-600">{nutritionPlan.protein}</div>
                      <div className="text-xs text-gray-500">gram</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <div className="text-sm text-gray-600">Karbohidrat</div>
                      <div className="text-2xl font-bold text-lime-600">{nutritionPlan.carbs}</div>
                      <div className="text-xs text-gray-500">gram</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <div className="text-sm text-gray-600">Lemak</div>
                      <div className="text-2xl font-bold text-cyan-600">{nutritionPlan.fat}</div>
                      <div className="text-xs text-gray-500">gram</div>
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>
                        Untuk mencapai target {goals.targetWeight} kg dalam {goals.timeFrame} minggu:
                      </strong>
                      <br />
                      Konsumsi sekitar <strong>{Math.round(nutritionPlan.calories)} kkal</strong> per hari dengan
                      distribusi <strong>{nutritionPlan.protein}g protein</strong>,{" "}
                      <strong>{nutritionPlan.carbs}g karbohidrat</strong>, dan{" "}
                      <strong>{nutritionPlan.fat}g lemak</strong>.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/tracker" className="flex-1">
              <Button className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700">
                Mulai Lacak Makanan Hari Ini
              </Button>
            </Link>
            <Link href="/meals" className="flex-1">
              <Button
                variant="outline"
                className="w-full border-green-600 text-green-600 hover:bg-green-50 bg-transparent"
              >
                Lihat Rekomendasi Menu
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
