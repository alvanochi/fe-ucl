import { useRouter } from 'next/router'
import Layout from '../../../../components/Layout'
import PageHeader from '../../../../components/PageHeader'
import useUser from '../../../../hooks/useUser'
import useMenu from '../../../../hooks/useMenu'
import { Loading } from '../../../../components/Loading'
import { useEffect, useState } from 'react'
import Card from '../../../../components/Card'
import axios from 'axios'
import { toastAlert } from '../../../../lib/sweetalert'

export default function Soal() {
  const router = useRouter()
  const { user } = useUser({ redirectTo: '/login' })
  const { prefix, menu, setActive } = useMenu()
  const [data, setData] = useState([])
  const [selectedAnswers, setSelectedAnswers] = useState({})

  const fetchData = async id => {
    try {
      const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/ujian/soal`
      const res = await axios.get(API_URL, {
        params: {
          filter: ['id_parentSoal'],
          filterValue: [id],
        },
      })

      setData(res.data.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (router.isReady === false || !user || !router.query.id) return
    fetchData(router.query.id)
  }, [router, user])

  const handleAnswerChange = (soalId, answer) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [soalId]: answer,
    })
  }

  const handleEssayChange = (soalId, answer) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [soalId]: answer,
    })
  }

  const handleSubmit = async () => {
    const submissionData = data.map(row => {
      return {
        id_soal: row.id,
        // type_soal: row.type_soal,
        npm: user.npm,
        hasil_jawaban: selectedAnswers[row.id] || '',
      }
    })

    try {
      const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/ujian/submit`

      const response = await axios.post(API_URL, submissionData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const result = response.data
      if (!result.isSuccess) {
        toastAlert('error', 'terjadi kesalahan pada server')
      }

      toastAlert('success', 'Jawaban Berhasil disimpan')
      return router.push('/mahasiswa/ujian')
    } catch (error) {
      console.error('Terjadi kesalahan:', error.message || error)
    }
  }

  if ([user, menu, data].some(item => item == null)) return <Loading />

  return (
    <Layout>
      <PageHeader title={`soal ${menu.label}`} icon={menu.icon} handler={setActive} />

      <div className="mt-8">
        {data && data.length < 1 && <h1>Tidak ada data</h1>}
        {data &&
          data.map((row, index) => {
            let pgOptions = []
            if (row.pg_pilihan) {
              try {
                pgOptions = Array.isArray(JSON.parse(row.pg_pilihan))
                  ? JSON.parse(row.pg_pilihan)
                  : []
              } catch (e) {
                console.error('Error parsing pg_pilihan:', e)
              }
            }

            const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
            const pgOptionsWithLetters = pgOptions.map((option, index) => {
              const letter = alphabet[index] || String.fromCharCode(65 + index)
              return { letter, option }
            })

            return (
              <Card key={`${index}-row`} className="mt-4">
                <Card.Body>
                  <span className="text-gray-600 text-sm font-bold mb-2">
                    {row?.cpmk?.kode_cmk}: {row?.cpmk?.name_cmk}
                  </span>

                  <h5 className=" text-lg font-bold tracking-tight text-gray-900 flex items-start">
                    <span className="text-gray-700 mr-2">{index + 1}.</span>
                    <div
                      className="soal-content text-gray-700"
                      dangerouslySetInnerHTML={{ __html: row.soal }}
                    />
                  </h5>

                  <div className="mt-2">
                    {row.type_soal === 'PG' && (
                      <div>
                        {pgOptionsWithLetters.length > 0 ? (
                          pgOptionsWithLetters.map((item, index) => (
                            <div key={index} className="mb-2">
                              <input
                                type="radio"
                                id={`option-${index}`}
                                name={`pg_answer_${row.id}`}
                                value={item.letter}
                                checked={selectedAnswers[row.id] === item.letter}
                                onChange={() => handleAnswerChange(row.id, item.letter)}
                                className="mr-2"
                              />
                              <label htmlFor={`option-${index}`} className="text-gray-700">
                                {item.letter}. {item.option}
                              </label>
                            </div>
                          ))
                        ) : (
                          <p className="text-red-500">Tidak ada pilihan tersedia.</p>
                        )}
                      </div>
                    )}

                    {row.type_soal === 'ESAI' && (
                      <div>
                        <textarea
                          className="w-full p-2 border rounded-md"
                          rows="5"
                          value={selectedAnswers[row.id] || ''}
                          onChange={e => handleEssayChange(row.id, e.target.value)}
                          placeholder="Tulis jawaban Anda di sini..."
                        />
                      </div>
                    )}
                  </div>
                </Card.Body>
              </Card>
            )
          })}

        <div className="mt-4">
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded-md">
            Submit Ujian
          </button>
        </div>
      </div>
    </Layout>
  )
}
