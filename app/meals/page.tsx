"use client"

import { Label } from "@/components/ui/label"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Activity, ArrowLeft, Plus, Search, Utensils, Book, Star, Filter } from "lucide-react"

export default function MealsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")

  const [dailyTarget, setDailyTarget] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  })

  const [currentIntake, setCurrentIntake] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  })

  useEffect(() => {
    loadDailyData()
  }, [])

  const loadDailyData = () => {
    // Load targets
    const goals = JSON.parse(localStorage.getItem("weightGoals") || "{}")
    if (goals.dailyCalories) {
      setDailyTarget({
        calories: goals.dailyCalories || 2000,
        protein: goals.protein || 100,
        carbs: goals.carbs || 250,
        fat: goals.fat || 60,
      })
    }

    // Load today's intake
    const today = new Date().toISOString().split("T")[0]
    const foodLog = JSON.parse(localStorage.getItem(`foodLog_${today}`) || "[]")
    const totals = foodLog.reduce(
      (acc: any, item: any) => ({
        calories: acc.calories + item.calories,
        protein: acc.protein + item.protein,
        carbs: acc.carbs + item.carbs,
        fat: acc.fat + item.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    )

    setCurrentIntake(totals)
  }

  // Food Library Database (per 100g)
  const foodLibrary = [
    // Protein
    {
      id: 1,
      name: "Ayam Dada",
      category: "protein",
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      description: "Tinggi protein, rendah lemak",
    },
    {
      id: 2,
      name: "Ikan Salmon",
      category: "protein",
      calories: 208,
      protein: 20,
      carbs: 0,
      fat: 13,
      description: "Kaya omega-3",
    },
    {
      id: 3,
      name: "Telur Ayam",
      category: "protein",
      calories: 155,
      protein: 13,
      carbs: 1.1,
      fat: 11,
      description: "Protein lengkap",
    },
    {
      id: 4,
      name: "Tempe",
      category: "protein",
      calories: 193,
      protein: 20,
      carbs: 9,
      fat: 8,
      description: "Sumber protein nabati",
    },
    {
      id: 5,
      name: "Tahu",
      category: "protein",
      calories: 76,
      protein: 8,
      carbs: 1.9,
      fat: 4.8,
      description: "Protein nabati rendah kalori",
    },
    {
      id: 6,
      name: "Ikan Tuna",
      category: "protein",
      calories: 132,
      protein: 28,
      carbs: 0,
      fat: 1.3,
      description: "Tinggi protein, sangat rendah lemak",
    },

    // Carbs
    {
      id: 7,
      name: "Nasi Putih",
      category: "carbs",
      calories: 130,
      protein: 2.7,
      carbs: 28,
      fat: 0.3,
      description: "Karbohidrat utama",
    },
    {
      id: 8,
      name: "Nasi Merah",
      category: "carbs",
      calories: 111,
      protein: 2.6,
      carbs: 23,
      fat: 0.9,
      description: "Lebih tinggi serat",
    },
    {
      id: 9,
      name: "Kentang",
      category: "carbs",
      calories: 77,
      protein: 2,
      carbs: 17,
      fat: 0.1,
      description: "Karbohidrat kompleks",
    },
    {
      id: 10,
      name: "Ubi Jalar",
      category: "carbs",
      calories: 86,
      protein: 1.6,
      carbs: 20,
      fat: 0.1,
      description: "Kaya vitamin A",
    },
    {
      id: 11,
      name: "Roti Gandum",
      category: "carbs",
      calories: 247,
      protein: 13,
      carbs: 41,
      fat: 3.4,
      description: "Tinggi serat",
    },
    {
      id: 12,
      name: "Oatmeal",
      category: "carbs",
      calories: 389,
      protein: 17,
      carbs: 66,
      fat: 7,
      description: "Karbohidrat sehat",
    },
    {
      id: 13,
      name: "Pasta Gandum",
      category: "carbs",
      calories: 157,
      protein: 5.8,
      carbs: 30,
      fat: 0.9,
      description: "Karbohidrat kompleks",
    },

    // Vegetables
    {
      id: 14,
      name: "Brokoli",
      category: "vegetables",
      calories: 34,
      protein: 2.8,
      carbs: 7,
      fat: 0.4,
      description: "Kaya vitamin C",
    },
    {
      id: 15,
      name: "Bayam",
      category: "vegetables",
      calories: 23,
      protein: 2.9,
      carbs: 3.6,
      fat: 0.4,
      description: "Tinggi zat besi",
    },
    {
      id: 16,
      name: "Wortel",
      category: "vegetables",
      calories: 41,
      protein: 0.9,
      carbs: 10,
      fat: 0.2,
      description: "Kaya beta-karoten",
    },
    {
      id: 17,
      name: "Tomat",
      category: "vegetables",
      calories: 18,
      protein: 0.9,
      carbs: 3.9,
      fat: 0.2,
      description: "Kaya likopen",
    },
    {
      id: 18,
      name: "Paprika",
      category: "vegetables",
      calories: 31,
      protein: 1,
      carbs: 6,
      fat: 0.3,
      description: "Kaya vitamin C",
    },

    // Fruits
    {
      id: 19,
      name: "Pisang",
      category: "fruits",
      calories: 89,
      protein: 1.1,
      carbs: 23,
      fat: 0.3,
      description: "Energi cepat",
    },
    {
      id: 20,
      name: "Apel",
      category: "fruits",
      calories: 52,
      protein: 0.3,
      carbs: 14,
      fat: 0.2,
      description: "Tinggi serat",
    },
    {
      id: 21,
      name: "Alpukat",
      category: "fruits",
      calories: 160,
      protein: 2,
      carbs: 9,
      fat: 15,
      description: "Lemak sehat",
    },
    {
      id: 22,
      name: "Jeruk",
      category: "fruits",
      calories: 47,
      protein: 0.9,
      carbs: 12,
      fat: 0.1,
      description: "Kaya vitamin C",
    },
    {
      id: 23,
      name: "Mangga",
      category: "fruits",
      calories: 60,
      protein: 0.8,
      carbs: 15,
      fat: 0.4,
      description: "Kaya vitamin A",
    },

    // Healthy Fats
    {
      id: 24,
      name: "Kacang Almond",
      category: "fats",
      calories: 579,
      protein: 21,
      carbs: 22,
      fat: 50,
      description: "Lemak sehat",
    },
    {
      id: 25,
      name: "Kacang Mete",
      category: "fats",
      calories: 553,
      protein: 18,
      carbs: 30,
      fat: 44,
      description: "Kaya magnesium",
    },
    {
      id: 26,
      name: "Minyak Zaitun",
      category: "fats",
      calories: 884,
      protein: 0,
      carbs: 0,
      fat: 100,
      description: "Lemak tak jenuh",
    },

    // Dairy
    {
      id: 27,
      name: "Susu",
      category: "dairy",
      calories: 42,
      protein: 3.4,
      carbs: 5,
      fat: 1,
      description: "Kaya kalsium",
    },
    {
      id: 28,
      name: "Yogurt Greek",
      category: "dairy",
      calories: 59,
      protein: 10,
      carbs: 3.6,
      fat: 0.4,
      description: "Tinggi protein",
    },
    {
      id: 29,
      name: "Keju Cottage",
      category: "dairy",
      calories: 98,
      protein: 11,
      carbs: 3.4,
      fat: 4.3,
      description: "Protein tinggi",
    },
  ]

  // Meal Recommendations based on deficit/surplus
  const mealRecommendations = [
    {
      id: 1,
      name: "Sarapan Protein Tinggi",
      type: "breakfast",
      items: [
        { name: "Oatmeal", amount: 50 },
        { name: "Telur Ayam", amount: 100 },
        { name: "Pisang", amount: 100 },
      ],
      totalNutrition: { calories: 410, protein: 21, carbs: 53, fat: 13 },
      description: "Sarapan berenergi dengan protein untuk memulai hari",
    },
    {
      id: 2,
      name: "Sarapan Ringan",
      type: "breakfast",
      items: [
        { name: "Roti Gandum", amount: 60 },
        { name: "Alpukat", amount: 50 },
        { name: "Susu", amount: 200 },
      ],
      totalNutrition: { calories: 310, protein: 11, carbs: 32, fat: 15 },
      description: "Sarapan praktis kaya serat dan lemak sehat",
    },
    {
      id: 3,
      name: "Makan Siang Seimbang",
      type: "lunch",
      items: [
        { name: "Nasi Merah", amount: 150 },
        { name: "Ayam Dada", amount: 100 },
        { name: "Brokoli", amount: 100 },
        { name: "Tempe", amount: 50 },
      ],
      totalNutrition: { calories: 465, protein: 51, carbs: 42, fat: 8 },
      description: "Makan siang lengkap dengan protein dan sayuran",
    },
    {
      id: 4,
      name: "Makan Siang Ikan",
      type: "lunch",
      items: [
        { name: "Nasi Putih", amount: 150 },
        { name: "Ikan Salmon", amount: 100 },
        { name: "Bayam", amount: 100 },
        { name: "Wortel", amount: 50 },
      ],
      totalNutrition: { calories: 464, protein: 27, carbs: 52, fat: 15 },
      description: "Kaya omega-3 dan vitamin",
    },
    {
      id: 5,
      name: "Makan Malam Ringan",
      type: "dinner",
      items: [
        { name: "Kentang", amount: 200 },
        { name: "Ikan Tuna", amount: 100 },
        { name: "Paprika", amount: 100 },
        { name: "Tomat", amount: 50 },
      ],
      totalNutrition: { calories: 345, protein: 31, carbs: 45, fat: 3 },
      description: "Makan malam rendah kalori tinggi protein",
    },
    {
      id: 6,
      name: "Makan Malam Vegetarian",
      type: "dinner",
      items: [
        { name: "Pasta Gandum", amount: 100 },
        { name: "Tahu", amount: 100 },
        { name: "Brokoli", amount: 100 },
        { name: "Tomat", amount: 100 },
      ],
      totalNutrition: { calories: 284, protein: 18, carbs: 43, fat: 6 },
      description: "Opsi vegetarian sehat dan mengenyangkan",
    },
    {
      id: 7,
      name: "Camilan Sehat",
      type: "snack",
      items: [
        { name: "Yogurt Greek", amount: 150 },
        { name: "Kacang Almond", amount: 20 },
        { name: "Apel", amount: 100 },
      ],
      totalNutrition: { calories: 258, protein: 19, carbs: 24, fat: 12 },
      description: "Camilan tinggi protein rendah gula",
    },
    {
      id: 8,
      name: "Camilan Energi",
      type: "snack",
      items: [
        { name: "Pisang", amount: 100 },
        { name: "Kacang Mete", amount: 20 },
        { name: "Susu", amount: 150 },
      ],
      totalNutrition: { calories: 263, protein: 9, carbs: 35, fat: 11 },
      description: "Camilan praktis untuk boost energi",
    },
  ]

  // Filter and sort food library
  let filteredLibrary = foodLibrary.filter(
    (food) =>
      food.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (categoryFilter === "all" || food.category === categoryFilter),
  )

  if (sortBy === "calories-asc") {
    filteredLibrary = filteredLibrary.sort((a, b) => a.calories - b.calories)
  } else if (sortBy === "calories-desc") {
    filteredLibrary = filteredLibrary.sort((a, b) => b.calories - a.calories)
  } else if (sortBy === "protein") {
    filteredLibrary = filteredLibrary.sort((a, b) => b.protein - a.protein)
  } else {
    filteredLibrary = filteredLibrary.sort((a, b) => a.name.localeCompare(b.name))
  }

  const addMealToTracker = (meal: any) => {
    const today = new Date().toISOString().split("T")[0]
    const foodLog = JSON.parse(localStorage.getItem(`foodLog_${today}`) || "[]")

    meal.items.forEach((item: any) => {
      const foodData = foodLibrary.find((f) => f.name === item.name)
      if (foodData) {
        const multiplier = item.amount / 100
        foodLog.push({
          id: Date.now().toString() + Math.random(),
          name: foodData.name,
          portion: item.amount,
          calories: foodData.calories * multiplier,
          protein: foodData.protein * multiplier,
          carbs: foodData.carbs * multiplier,
          fat: foodData.fat * multiplier,
          mealTime: meal.type,
        })
      }
    })

    localStorage.setItem(`foodLog_${today}`, JSON.stringify(foodLog))
    alert(`Menu "${meal.name}" berhasil ditambahkan ke tracker!`)
    loadDailyData()
  }

  const remaining = {
    calories: dailyTarget.calories - currentIntake.calories,
    protein: dailyTarget.protein - currentIntake.protein,
    carbs: dailyTarget.carbs - currentIntake.carbs,
    fat: dailyTarget.fat - currentIntake.fat,
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
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Page Title */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Rencana Makan & Perpustakaan Makanan</h2>
            <p className="text-gray-600">Rekomendasi menu sehat dan database makanan lengkap</p>
          </div>

          {/* Nutrition Status */}
          <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-teal-50">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Sisa Kebutuhan Nutrisi Hari Ini</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Kalori</div>
                  <div className={`text-2xl font-bold ${remaining.calories >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {Math.round(remaining.calories)}
                  </div>
                  <div className="text-xs text-gray-500">kkal tersisa</div>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Protein</div>
                  <div className={`text-2xl font-bold ${remaining.protein >= 0 ? "text-teal-600" : "text-red-600"}`}>
                    {Math.round(remaining.protein)}
                  </div>
                  <div className="text-xs text-gray-500">gram tersisa</div>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Karbohidrat</div>
                  <div className={`text-2xl font-bold ${remaining.carbs >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                    {Math.round(remaining.carbs)}
                  </div>
                  <div className="text-xs text-gray-500">gram tersisa</div>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Lemak</div>
                  <div className={`text-2xl font-bold ${remaining.fat >= 0 ? "text-cyan-600" : "text-red-600"}`}>
                    {Math.round(remaining.fat)}
                  </div>
                  <div className="text-xs text-gray-500">gram tersisa</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Meal Recommendations */}
          <Card className="border-green-100">
            <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50">
              <CardTitle className="flex items-center gap-2">
                <Utensils className="h-5 w-5 text-green-600" />
                Rekomendasi Menu Harian
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Breakfast */}
                <div>
                  <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    Sarapan
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {mealRecommendations
                      .filter((m) => m.type === "breakfast")
                      .map((meal) => (
                        <Card key={meal.id} className="border-green-100 hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h5 className="font-semibold text-gray-900">{meal.name}</h5>
                                <p className="text-sm text-gray-600">{meal.description}</p>
                              </div>
                              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                            </div>

                            <div className="space-y-1 mb-3">
                              {meal.items.map((item, idx) => (
                                <div key={idx} className="text-sm text-gray-600">
                                  • {item.name} ({item.amount}g)
                                </div>
                              ))}
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                              <div className="text-sm">
                                <span className="font-semibold text-green-600">
                                  {meal.totalNutrition.calories} kkal
                                </span>
                                <span className="text-gray-400 mx-1">|</span>
                                <span className="text-gray-600">
                                  P: {meal.totalNutrition.protein}g C: {meal.totalNutrition.carbs}g F:{" "}
                                  {meal.totalNutrition.fat}g
                                </span>
                              </div>
                            </div>

                            <Button
                              onClick={() => addMealToTracker(meal)}
                              size="sm"
                              className="w-full mt-3 bg-green-600 hover:bg-green-700"
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Tambah ke Tracker
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>

                {/* Lunch */}
                <div>
                  <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-teal-600 rounded-full"></span>
                    Makan Siang
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {mealRecommendations
                      .filter((m) => m.type === "lunch")
                      .map((meal) => (
                        <Card key={meal.id} className="border-teal-100 hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h5 className="font-semibold text-gray-900">{meal.name}</h5>
                                <p className="text-sm text-gray-600">{meal.description}</p>
                              </div>
                              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                            </div>

                            <div className="space-y-1 mb-3">
                              {meal.items.map((item, idx) => (
                                <div key={idx} className="text-sm text-gray-600">
                                  • {item.name} ({item.amount}g)
                                </div>
                              ))}
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                              <div className="text-sm">
                                <span className="font-semibold text-teal-600">{meal.totalNutrition.calories} kkal</span>
                                <span className="text-gray-400 mx-1">|</span>
                                <span className="text-gray-600">
                                  P: {meal.totalNutrition.protein}g C: {meal.totalNutrition.carbs}g F:{" "}
                                  {meal.totalNutrition.fat}g
                                </span>
                              </div>
                            </div>

                            <Button
                              onClick={() => addMealToTracker(meal)}
                              size="sm"
                              className="w-full mt-3 bg-teal-600 hover:bg-teal-700"
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Tambah ke Tracker
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>

                {/* Dinner */}
                <div>
                  <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
                    Makan Malam
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {mealRecommendations
                      .filter((m) => m.type === "dinner")
                      .map((meal) => (
                        <Card key={meal.id} className="border-emerald-100 hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h5 className="font-semibold text-gray-900">{meal.name}</h5>
                                <p className="text-sm text-gray-600">{meal.description}</p>
                              </div>
                              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                            </div>

                            <div className="space-y-1 mb-3">
                              {meal.items.map((item, idx) => (
                                <div key={idx} className="text-sm text-gray-600">
                                  • {item.name} ({item.amount}g)
                                </div>
                              ))}
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                              <div className="text-sm">
                                <span className="font-semibold text-emerald-600">
                                  {meal.totalNutrition.calories} kkal
                                </span>
                                <span className="text-gray-400 mx-1">|</span>
                                <span className="text-gray-600">
                                  P: {meal.totalNutrition.protein}g C: {meal.totalNutrition.carbs}g F:{" "}
                                  {meal.totalNutrition.fat}g
                                </span>
                              </div>
                            </div>

                            <Button
                              onClick={() => addMealToTracker(meal)}
                              size="sm"
                              className="w-full mt-3 bg-emerald-600 hover:bg-emerald-700"
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Tambah ke Tracker
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>

                {/* Snacks */}
                <div>
                  <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-cyan-600 rounded-full"></span>
                    Camilan
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {mealRecommendations
                      .filter((m) => m.type === "snack")
                      .map((meal) => (
                        <Card key={meal.id} className="border-cyan-100 hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h5 className="font-semibold text-gray-900">{meal.name}</h5>
                                <p className="text-sm text-gray-600">{meal.description}</p>
                              </div>
                              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                            </div>

                            <div className="space-y-1 mb-3">
                              {meal.items.map((item, idx) => (
                                <div key={idx} className="text-sm text-gray-600">
                                  • {item.name} ({item.amount}g)
                                </div>
                              ))}
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                              <div className="text-sm">
                                <span className="font-semibold text-cyan-600">{meal.totalNutrition.calories} kkal</span>
                                <span className="text-gray-400 mx-1">|</span>
                                <span className="text-gray-600">
                                  P: {meal.totalNutrition.protein}g C: {meal.totalNutrition.carbs}g F:{" "}
                                  {meal.totalNutrition.fat}g
                                </span>
                              </div>
                            </div>

                            <Button
                              onClick={() => addMealToTracker(meal)}
                              size="sm"
                              className="w-full mt-3 bg-cyan-600 hover:bg-cyan-700"
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Tambah ke Tracker
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Food Library */}
          <Card className="border-teal-100">
            <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50">
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5 text-teal-600" />
                Perpustakaan Makanan Sehat
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {/* Filters */}
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="space-y-2">
                  <Label>
                    <Search className="inline h-4 w-4 mr-1" />
                    Cari Makanan
                  </Label>
                  <Input
                    placeholder="Ketik nama makanan..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    <Filter className="inline h-4 w-4 mr-1" />
                    Kategori
                  </Label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Kategori</SelectItem>
                      <SelectItem value="protein">Protein</SelectItem>
                      <SelectItem value="carbs">Karbohidrat</SelectItem>
                      <SelectItem value="vegetables">Sayuran</SelectItem>
                      <SelectItem value="fruits">Buah-buahan</SelectItem>
                      <SelectItem value="fats">Lemak Sehat</SelectItem>
                      <SelectItem value="dairy">Produk Susu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Urutkan Berdasarkan</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Nama (A-Z)</SelectItem>
                      <SelectItem value="calories-asc">Kalori (Rendah-Tinggi)</SelectItem>
                      <SelectItem value="calories-desc">Kalori (Tinggi-Rendah)</SelectItem>
                      <SelectItem value="protein">Protein Tertinggi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Food Library Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredLibrary.map((food) => (
                  <Card key={food.id} className="border-gray-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-semibold text-gray-900">{food.name}</h5>
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                          {food.category === "protein" && "Protein"}
                          {food.category === "carbs" && "Karbo"}
                          {food.category === "vegetables" && "Sayur"}
                          {food.category === "fruits" && "Buah"}
                          {food.category === "fats" && "Lemak"}
                          {food.category === "dairy" && "Susu"}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mb-3">{food.description}</p>

                      <div className="space-y-1 mb-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Per 100g:</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Kalori:</span>
                          <span className="font-semibold">{food.calories} kkal</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Protein:</span>
                          <span className="font-semibold">{food.protein}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Karbohidrat:</span>
                          <span className="font-semibold">{food.carbs}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Lemak:</span>
                          <span className="font-semibold">{food.fat}g</span>
                        </div>
                      </div>

                      <Link href="/tracker">
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full border-green-600 text-green-600 hover:bg-green-50 bg-transparent"
                        >
                          Gunakan dalam Rencana
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredLibrary.length === 0 && (
                <div className="text-center py-12 text-gray-500">Tidak ada makanan yang ditemukan</div>
              )}
            </CardContent>
          </Card>

          {/* Education Tips */}
          <Card className="border-green-100 bg-gradient-to-r from-green-50 to-teal-50">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-600" />
                Tips Nutrisi Seimbang
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Kontrol Porsi</h4>
                  <p className="text-sm text-gray-600">
                    Gunakan timbangan makanan untuk mengukur porsi yang akurat. Porsi yang tepat adalah kunci mencapai
                    target nutrisi.
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Keseimbangan Makro</h4>
                  <p className="text-sm text-gray-600">
                    Pastikan setiap makanan mengandung protein, karbohidrat kompleks, dan lemak sehat untuk nutrisi
                    optimal.
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Makan Teratur</h4>
                  <p className="text-sm text-gray-600">
                    Konsumsi makanan 3-4 kali sehari dengan jarak 3-4 jam untuk menjaga metabolisme tetap optimal.
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Hidrasi Cukup</h4>
                  <p className="text-sm text-gray-600">
                    Minum minimal 8 gelas air putih per hari. Hidrasi yang baik mendukung metabolisme dan kesehatan
                    secara keseluruhan.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
