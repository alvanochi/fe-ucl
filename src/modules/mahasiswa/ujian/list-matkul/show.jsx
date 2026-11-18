import { useEffect, useState } from 'react'
import axios from 'axios'
import Button from '../../../../components/Button'
import Modal from '../../../../components/Modal'
import useModal from '../../../../hooks/useModal'
import { Icon } from '@iconify-icon/react'

const ShowUjian = ({ course_code, curr_code }) => {
  const { show, toggle, close } = useModal()

  const [data, setData] = useState({})

  const getData = async (course_code, curr_code) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/ujian`)

      const dataResponse = response.data.data

      setData(dataResponse)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    if (show && id) {
      getData(id)
    }
  }, [show, course_code, curr_code])

  return (
    <>
      <Button
        as="button "
        onClick={toggle}
        variant="info"
        icon={<Icon icon="material-symbols:chevron-right" width={10} height={10} />}
        iconPosition="right"
        pill
      >
        Kerjakan Ujian
      </Button>

      <Modal title="Ujian" show={show} handler={toggle}>
        <h1>Show Ujian</h1>
      </Modal>
    </>
  )
}

export default ShowUjian
