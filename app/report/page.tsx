"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Activity, ArrowLeft, TrendingUp, Calendar, Bell, Target, Apple, Award } from "lucide-react"

export default function ReportPage() {
  const [timeRange, setTimeRange] = useState("weekly")
  const [dataType, setDataType] = useState("calories")

  // Reminder settings
  const [reminderSettings, setReminderSettings] = useState({
    enabled: false,
    breakfast: "08:00",
    lunch: "12:00",
    dinner: "18:00",
    report: "20:00",
  })

  // Report data
  const [reportData, setReportData] = useState({
    weeklyStats: {
      avgCalories: 0,
      avgProtein: 0,
      avgCarbs: 0,
      avgFat: 0,
      targetMet: 0,
      totalDays: 7,
    },
    weightProgress: [] as any[],
    dailyLogs: [] as any[],
  })

  const [profile, setProfile] = useState<any>(null)
  const [goals, setGoals] = useState<any>(null)

  useEffect(() => {
    loadReportData()
    loadReminderSettings()
    loadProfileData()
  }, [timeRange])

  const loadProfileData = () => {
    const savedProfile = localStorage.getItem("healthProfile")
    const savedGoals = localStorage.getItem("weightGoals")

    if (savedProfile) setProfile(JSON.parse(savedProfile))
    if (savedGoals) setGoals(JSON.parse(savedGoals))
  }

  const loadReminderSettings = () => {
    const saved = localStorage.getItem("reminderSettings")
    if (saved) {
      setReminderSettings(JSON.parse(saved))
    }
  }

  const saveReminderSettings = (settings: any) => {
    localStorage.setItem("reminderSettings", JSON.stringify(settings))
    setReminderSettings(settings)
  }

  const loadReportData = () => {
    const days = timeRange === "daily" ? 1 : timeRange === "weekly" ? 7 : 30
    const logs = []
    let totalCalories = 0
    let totalProtein = 0
    let totalCarbs = 0
    let totalFat = 0
    let daysWithData = 0

    // Get goals for target
    const savedGoals = JSON.parse(localStorage.getItem("weightGoals") || "{}")
    const dailyTarget = savedGoals.dailyCalories || 2000

    for (let i = 0; i < days; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateString = date.toISOString().split("T")[0]

      const dayLog = JSON.parse(localStorage.getItem(`foodLog_${dateString}`) || "[]")

      if (dayLog.length > 0) {
        const dayTotals = dayLog.reduce(
          (acc: any, item: any) => ({
            calories: acc.calories + item.calories,
            protein: acc.protein + item.protein,
            carbs: acc.carbs + item.carbs,
            fat: acc.fat + item.fat,
          }),
          { calories: 0, protein: 0, carbs: 0, fat: 0 },
        )

        logs.push({
          date: dateString,
          ...dayTotals,
        })

        totalCalories += dayTotals.calories
        totalProtein += dayTotals.protein
        totalCarbs += dayTotals.carbs
        totalFat += dayTotals.fat
        daysWithData++
      } else {
        logs.push({
          date: dateString,
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
        })
      }
    }

    const avgCalories = daysWithData > 0 ? totalCalories / daysWithData : 0
    const targetMet =
      daysWithData > 0 ? logs.filter((log) => Math.abs(log.calories - dailyTarget) < dailyTarget * 0.1).length : 0

    setReportData({
      weeklyStats: {
        avgCalories: avgCalories,
        avgProtein: daysWithData > 0 ? totalProtein / daysWithData : 0,
        avgCarbs: daysWithData > 0 ? totalCarbs / daysWithData : 0,
        avgFat: daysWithData > 0 ? totalFat / daysWithData : 0,
        targetMet: targetMet,
        totalDays: daysWithData,
      },
      weightProgress: [],
      dailyLogs: logs.reverse(),
    })
  }

  // Simple chart rendering (text-based for simplicity)
  const renderChart = () => {
    const { dailyLogs } = reportData

    if (dailyLogs.length === 0) {
      return <div className="text-center py-12 text-gray-500">Belum ada data untuk ditampilkan</div>
    }

    const maxValue = Math.max(
      ...dailyLogs.map((log) => {
        if (dataType === "calories") return log.calories
        if (dataType === "protein") return log.protein
        if (dataType === "carbs") return log.carbs
        return log.fat
      }),
    )

    return (
      <div className="space-y-2">
        {dailyLogs.map((log, idx) => {
          const value =
            dataType === "calories"
              ? log.calories
              : dataType === "protein"
                ? log.protein
                : dataType === "carbs"
                  ? log.carbs
                  : log.fat
          const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0
          const date = new Date(log.date)
          const dateLabel = date.toLocaleDateString("id-ID", { month: "short", day: "numeric" })

          return (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-16 text-sm text-gray-600">{dateLabel}</div>
              <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    dataType === "calories"
                      ? "bg-green-600"
                      : dataType === "protein"
                        ? "bg-teal-600"
                        : dataType === "carbs"
                          ? "bg-emerald-600"
                          : "bg-cyan-600"
                  }`}
                  style={{ width: `${percentage}%` }}
                />
                <div className="absolute inset-0 flex items-center px-3">
                  <span className="text-sm font-medium text-gray-900">
                    {Math.round(value)} {dataType === "calories" ? "kkal" : "g"}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
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
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Page Title */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Laporan Kesehatan</h2>
            <p className="text-gray-600">Visualisasi progres dan statistik nutrisi Anda</p>
          </div>

          {/* Current Status Overview */}
          {profile && goals && (
            <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-teal-50">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Status Kesehatan Saat Ini</h3>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-green-600" />
                      <div className="text-sm text-gray-600">BMI Anda</div>
                    </div>
                    <div className="text-2xl font-bold text-green-600">{profile.bmi?.toFixed(1) || "-"}</div>
                    <div className="text-xs text-gray-500">{profile.bmiCategory || "Belum ada data"}</div>
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="h-4 w-4 text-teal-600" />
                      <div className="text-sm text-gray-600">Berat Saat Ini</div>
                    </div>
                    <div className="text-2xl font-bold text-teal-600">{profile.weight || "-"}</div>
                    <div className="text-xs text-gray-500">kg</div>
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-emerald-600" />
                      <div className="text-sm text-gray-600">Target Berat</div>
                    </div>
                    <div className="text-2xl font-bold text-emerald-600">{goals.targetWeight || "-"}</div>
                    <div className="text-xs text-gray-500">kg dalam {goals.timeFrame || "-"} minggu</div>
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Apple className="h-4 w-4 text-cyan-600" />
                      <div className="text-sm text-gray-600">Kalori Harian</div>
                    </div>
                    <div className="text-2xl font-bold text-cyan-600">{Math.round(goals.dailyCalories || 0)}</div>
                    <div className="text-xs text-gray-500">kkal/hari</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Report Filters */}
          <Card className="border-green-100">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timeRange">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Rentang Waktu
                  </Label>
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Hari Ini</SelectItem>
                      <SelectItem value="weekly">7 Hari Terakhir</SelectItem>
                      <SelectItem value="monthly">30 Hari Terakhir</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataType">Tipe Data</Label>
                  <Select value={dataType} onValueChange={setDataType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="calories">Kalori</SelectItem>
                      <SelectItem value="protein">Protein</SelectItem>
                      <SelectItem value="carbs">Karbohidrat</SelectItem>
                      <SelectItem value="fat">Lemak</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics Summary */}
          <Card className="border-green-100">
            <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50">
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-green-600" />
                Statistik{" "}
                {timeRange === "daily" ? "Hari Ini" : timeRange === "weekly" ? "7 Hari Terakhir" : "30 Hari Terakhir"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Rata-rata Kalori</div>
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round(reportData.weeklyStats.avgCalories)}
                  </div>
                  <div className="text-xs text-gray-500">kkal/hari</div>
                </div>

                <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Rata-rata Protein</div>
                  <div className="text-2xl font-bold text-teal-600">
                    {Math.round(reportData.weeklyStats.avgProtein)}
                  </div>
                  <div className="text-xs text-gray-500">gram/hari</div>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Rata-rata Karbo</div>
                  <div className="text-2xl font-bold text-emerald-600">
                    {Math.round(reportData.weeklyStats.avgCarbs)}
                  </div>
                  <div className="text-xs text-gray-500">gram/hari</div>
                </div>

                <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Rata-rata Lemak</div>
                  <div className="text-2xl font-bold text-cyan-600">{Math.round(reportData.weeklyStats.avgFat)}</div>
                  <div className="text-xs text-gray-500">gram/hari</div>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Pencapaian Target:</strong> Anda mencapai target kalori harian pada{" "}
                  <strong className="text-green-600">{reportData.weeklyStats.targetMet}</strong> dari{" "}
                  <strong>{reportData.weeklyStats.totalDays}</strong> hari.
                  {reportData.weeklyStats.totalDays > 0 && (
                    <> ({Math.round((reportData.weeklyStats.targetMet / reportData.weeklyStats.totalDays) * 100)}%)</>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Progress Chart */}
          <Card className="border-green-100">
            <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-teal-600" />
                Grafik Progres
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">{renderChart()}</CardContent>
          </Card>

          {/* Insights */}
          <Card className="border-green-100 bg-gradient-to-r from-green-50 to-teal-50">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Wawasan & Rekomendasi</h3>
              <div className="space-y-3">
                {reportData.weeklyStats.avgCalories > 0 ? (
                  <>
                    {goals && reportData.weeklyStats.avgCalories < goals.dailyCalories * 0.9 && (
                      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          <strong>⚠️ Asupan Kalori Kurang:</strong> Rata-rata asupan kalori Anda di bawah target.
                          Pertimbangkan untuk menambah porsi atau camilan sehat.
                        </p>
                      </div>
                    )}

                    {goals && reportData.weeklyStats.avgCalories > goals.dailyCalories * 1.1 && (
                      <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                        <p className="text-sm text-red-800">
                          <strong>⚠️ Asupan Kalori Berlebih:</strong> Rata-rata asupan kalori Anda melebihi target.
                          Perhatikan porsi dan pilih makanan rendah kalori.
                        </p>
                      </div>
                    )}

                    {reportData.weeklyStats.avgProtein < 50 && (
                      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>💪 Tingkatkan Protein:</strong> Asupan protein Anda masih rendah. Tambahkan sumber
                          protein seperti ayam, ikan, telur, atau tempe.
                        </p>
                      </div>
                    )}

                    {reportData.weeklyStats.targetMet >= reportData.weeklyStats.totalDays * 0.7 && (
                      <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                        <p className="text-sm text-green-800">
                          <strong>🎉 Konsistensi Bagus!</strong> Anda berhasil mencapai target pada sebagian besar hari.
                          Pertahankan kebiasaan baik ini!
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>ℹ️ Mulai Catat Makanan:</strong> Belum ada data untuk periode ini. Mulai catat asupan
                      makanan Anda untuk melihat wawasan yang lebih detail.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Reminder Settings */}
          <Card id="reminder" className="border-green-100">
            <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50">
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-green-600" />
                Pengaturan Pengingat
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <h4 className="font-semibold text-gray-900">Aktifkan Pengingat</h4>
                  <p className="text-sm text-gray-600">Dapatkan notifikasi untuk catat makanan dan cek progres</p>
                </div>
                <Switch
                  checked={reminderSettings.enabled}
                  onCheckedChange={(checked) => saveReminderSettings({ ...reminderSettings, enabled: checked })}
                />
              </div>

              {reminderSettings.enabled && (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="breakfast">Pengingat Sarapan</Label>
                      <Input
                        id="breakfast"
                        type="time"
                        value={reminderSettings.breakfast}
                        onChange={(e) => saveReminderSettings({ ...reminderSettings, breakfast: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lunch">Pengingat Makan Siang</Label>
                      <Input
                        id="lunch"
                        type="time"
                        value={reminderSettings.lunch}
                        onChange={(e) => saveReminderSettings({ ...reminderSettings, lunch: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dinner">Pengingat Makan Malam</Label>
                      <Input
                        id="dinner"
                        type="time"
                        value={reminderSettings.dinner}
                        onChange={(e) => saveReminderSettings({ ...reminderSettings, dinner: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="report">Pengingat Cek Laporan</Label>
                      <Input
                        id="report"
                        type="time"
                        value={reminderSettings.report}
                        onChange={(e) => saveReminderSettings({ ...reminderSettings, report: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>ℹ️ Catatan:</strong> Pengingat akan membantu Anda tetap konsisten mencatat makanan dan
                      memantau progres kesehatan. Fitur notifikasi browser diperlukan untuk menerima pengingat.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/profile" className="flex-1">
              <Button
                variant="outline"
                className="w-full border-green-600 text-green-600 hover:bg-green-50 bg-transparent"
              >
                Perbarui Profil & Target
              </Button>
            </Link>
            <Link href="/tracker" className="flex-1">
              <Button className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700">
                Lacak Makanan Hari Ini
              </Button>
            </Link>
            <Link href="/meals" className="flex-1">
              <Button
                variant="outline"
                className="w-full border-teal-600 text-teal-600 hover:bg-teal-50 bg-transparent"
              >
                Sesuaikan Rencana Makan
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
