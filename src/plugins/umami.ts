import axios from 'axios'

const UMAMI_API_URL = `http://umami.santisify.top`
const WEBSITE_ID = '5398afde-5764-4ebc-843c-f0fa4b99d4e5'
const API_KEY = await axios
  .post(`${UMAMI_API_URL}/api/auth/login`, {
    username: 'admin',
    password: '@Jdj20040908'
  })
  .then((res) => res.data.token)

// 类型定义
interface MetricsResponse {
  pageviews: { value: number }
  uniques: { value: number }
}

const getMetrics = async (startDate: Date, endDate: Date): Promise<MetricsResponse> => {
  try {
    const response = await axios.get<MetricsResponse>(
      `${UMAMI_API_URL}/api/websites/${WEBSITE_ID}/metrics`,
      {
        headers: { Authorization: `Bearer ${API_KEY}` },
        params: {
          start_at: startDate.getTime(),
          end_at: endDate.getTime(),
          type: 'pageview,uniques'
        }
      }
    )
    return response.data
  } catch (error) {
    console.error('Umami API 请求失败:', error)
    return { pageviews: { value: 0 }, uniques: { value: 0 } }
  }
}

const getTodayRange = () => {
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  const end = new Date()
  return { start, end }
}

const getYesterdayRange = () => {
  const start = new Date()
  start.setDate(start.getDate() - 1)
  start.setHours(0, 0, 0, 0)
  const end = new Date(start)
  end.setHours(23, 59, 59, 999)
  return { start, end }
}

const getLastMonthRange = () => {
  const start = new Date()
  start.setMonth(start.getMonth() - 1, 1)
  start.setHours(0, 0, 0, 0)
  const end = new Date(start)
  end.setMonth(start.getMonth() + 1, 0)
  end.setHours(23, 59, 59, 999)
  return { start, end }
}

const getLastYearRange = () => {
  const start = new Date()
  start.setFullYear(start.getFullYear() - 1, 0, 1) // 去年1月1日
  start.setHours(0, 0, 0, 0)
  const end = new Date(start)
  end.setFullYear(start.getFullYear() + 1, 0, 0) // 去年12月31日
  end.setHours(23, 59, 59, 999)
  return { start, end }
}

export const getUmamiStats = async () => {
  const todayRange = getTodayRange()
  const yesterdayRange = getYesterdayRange()
  const lastMonthRange = getLastMonthRange()
  const lastYearRange = getLastYearRange()

  const [today, yesterday, lastMonth, lastYear] = await Promise.all([
    getMetrics(todayRange.start, todayRange.end),
    getMetrics(yesterdayRange.start, yesterdayRange.end),
    getMetrics(lastMonthRange.start, lastMonthRange.end),
    getMetrics(lastYearRange.start, lastYearRange.end)
  ])
  return {
    today_uv: today.uniques.value,
    today_pv: today.pageviews.value,
    yesterday_uv: yesterday.uniques.value,
    yesterday_pv: yesterday.pageviews.value,
    last_month_pv: lastMonth.pageviews.value,
    last_year_pv: lastYear.pageviews.value
  }
}
