import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import axios from 'axios'
import Card from '../../../../components/Card'
import Form from '../../../../components/Form'

const StackChart = dynamic(() => import('../../../../components/Chart/stack'), {
  ssr: false,
})

export default function StatistikLaporanModule({ baseURL }) {
  const [data, setData] = useState([])
  const [periode, setPeriode] = useState(1)

  const fetchData = async selectedPeriod => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/laporan/chart`, {
        params: { periode: selectedPeriod },
      })

      if (response.data.isSuccess) {
        setData(response.data.data)
      } else {
        setData([])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setData([])
    }
  }

  const handlePeriodChange = event => {
    const selectedPeriod = parseInt(event.target.value, 10)
    setPeriode(selectedPeriod)
    fetchData(selectedPeriod)
  }

  useEffect(() => {
    fetchData(periode)
  }, [periode])

  // Extract data for the chart
  const labels = data.map(item => item.period)
  const categories = Array.from(new Set(data.flatMap(item => item.categories.map(c => c.label)))) // Unique categories

  const getCategoryColor = index => {
    const hue = (index * 137.5) % 360 // Menggunakan angka emas untuk menghasilkan warna berbeda
    const saturation = 60 // Saturation lebih rendah untuk warna yang lebih lembut
    const lightness = 75 // Lightness lebih tinggi untuk warna yang lebih pastel
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`
  }

  const datasets = categories.map((category, index) => ({
    label: category,
    data: data.map(periodData => {
      const categoryData = periodData.categories.find(c => c.label === category)
      return categoryData ? categoryData.count : 0
    }),
    backgroundColor: getCategoryColor(index), // Menggunakan fungsi dinamis untuk mendapatkan warna
    stack: 'stack1',
  }))

  const dataUse = {
    labels: labels,
    datasets: datasets,
  }

  return (
    <>
      <Card className="col-span-2 sm:col-span-8 lg:col-span-8 mt-8">
        <Card.Body>
          <Form.Group>
            <Form.Select
              className="flex-1"
              name="periode"
              value={periode}
              onChange={handlePeriodChange}
              options={[
                { label: 'Harian', value: 1 },
                { label: 'Mingguan', value: 2 },
                { label: 'Bulanan', value: 3 },
                { label: 'Tahunan', value: 4 },
              ]}
            />
          </Form.Group>
        </Card.Body>
      </Card>

      <Card className="col-span-2 sm:col-span-8 lg:col-span-8 mt-8">
        <Card.Header className="bg-primary-600 text-white text-center text-sm">Grafik</Card.Header>
        <Card.Body>
          {data.length > 0 ? (
            <StackChart data={dataUse} />
          ) : (
            <p>No data available for the selected period.</p>
          )}
        </Card.Body>
      </Card>
    </>
  )
}
