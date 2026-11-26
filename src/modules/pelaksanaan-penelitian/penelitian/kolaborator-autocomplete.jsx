import { useState, useEffect, useRef, useCallback } from 'react'
import Select, { components } from 'react-select'
import axios from 'axios'
import { Icon } from '@iconify-icon/react'
import resolveConfig from 'tailwindcss/resolveConfig'
import twConfig from '../../../../tailwind.config.js'

export default function KolaboratorExternalAutocomplete({
  value,
  onChange,
  onAddNew,
  defaultList = [],
  placeholder = '-- Cari / Pilih Kolaborator External --',
}) {
  const config = resolveConfig(twConfig)
  const { theme: { colors } } = config

  const [mounted, setMounted] = useState(false)
  const [options, setOptions] = useState([])
  const [selectedOption, setSelectedOption] = useState(null)
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const debounceTimer = useRef(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Fungsi helper memformat data kolaborator ke opsi select: [Nama Lengkap] — [Instansi Asal] ([Negara])
  const formatOption = useCallback(item => {
    if (!item) return null
    const extId = item.ext_id || item.id || item.value
    const nama = item.nama || item.label || ''
    const instansi = item.instansi ? ` — ${item.instansi}` : ''
    const negara = item.negara ? ` (${item.negara})` : ''
    return {
      label: `${nama}${instansi}${negara}` || nama,
      value: extId,
      item,
    }
  }, [])

  // Sync options dari defaultList jika ada data awal
  useEffect(() => {
    if (Array.isArray(defaultList) && defaultList.length > 0) {
      const formatted = defaultList.map(formatOption).filter(Boolean)
      setOptions(prev => {
        const map = new Map()
        formatted.forEach(opt => map.set(opt.value, opt))
        prev.forEach(opt => {
          if (!map.has(opt.value)) map.set(opt.value, opt)
        })
        return Array.from(map.values())
      })
    }
  }, [defaultList, formatOption])

  // Fetch dari GET /kolabExt/search?search={keyword}
  const fetchOptions = useCallback(
    async (keyword = '') => {
      setLoading(true)
      try {
        const query = keyword ? `?search=${encodeURIComponent(keyword)}` : ''
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/kolabExt/search${query}`)
        const data = Array.isArray(res.data?.data) ? res.data.data : Array.isArray(res.data) ? res.data : []
        const formatted = data.map(formatOption).filter(Boolean)
        if (formatted.length > 0 || keyword) {
          setOptions(formatted)
        } else if (Array.isArray(defaultList) && defaultList.length > 0) {
          setOptions(defaultList.map(formatOption).filter(Boolean))
        }
      } catch (err) {
        console.error('Error fetching kolaborator search:', err)
        if (Array.isArray(defaultList) && defaultList.length > 0 && !keyword) {
          setOptions(defaultList.map(formatOption).filter(Boolean))
        }
      } finally {
        setLoading(false)
      }
    },
    [formatOption, defaultList],
  )

  // Initial load
  useEffect(() => {
    fetchOptions('')
  }, [fetchOptions])

  // Sync value prop ke selectedOption
  useEffect(() => {
    if (!value) {
      setSelectedOption(null)
      return
    }

    if (typeof value === 'object' && value.value) {
      setSelectedOption(value)
      return
    }

    // Cari di options yang sudah ada
    const found = options.find(opt => opt.value === value)
    if (found) {
      setSelectedOption(found)
      return
    }

    // Cari di defaultList
    if (Array.isArray(defaultList) && defaultList.length > 0) {
      const foundInDefault = defaultList.find(
        item => (item.ext_id || item.id || item.value) === value,
      )
      if (foundInDefault) {
        const opt = formatOption(foundInDefault)
        setSelectedOption(opt)
        setOptions(prev => (prev.some(p => p.value === opt.value) ? prev : [opt, ...prev]))
        return
      }
    }

    // Jika belum ada di options (misal baru dibuat atau belum di-fetch), fetch detailnya
    let isMounted = true
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/kolabExt/${value}`)
      .then(res => {
        if (!isMounted) return
        const item = res.data?.data || res.data
        if (item && (item.ext_id || item.id)) {
          const opt = formatOption(item)
          setSelectedOption(opt)
          setOptions(prev => (prev.some(p => p.value === opt.value) ? prev : [opt, ...prev]))
        }
      })
      .catch(() => {})

    return () => {
      isMounted = false
    }
  }, [value, options, defaultList, formatOption])

  // Handle typing dengan debounce
  const handleInputChange = (newValue, actionMeta) => {
    if (actionMeta.action === 'input-change') {
      setInputValue(newValue)
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
      if (!newValue || newValue.trim() === '') {
        if (Array.isArray(defaultList) && defaultList.length > 0) {
          setOptions(defaultList.map(formatOption).filter(Boolean))
        }
        fetchOptions('')
      } else {
        debounceTimer.current = setTimeout(() => {
          fetchOptions(newValue)
        }, 300)
      }
    } else if (actionMeta.action === 'menu-close') {
      setInputValue('')
      if (Array.isArray(defaultList) && defaultList.length > 0) {
        setOptions(defaultList.map(formatOption).filter(Boolean))
      }
    }
  }

  const handleChange = selected => {
    setSelectedOption(selected)
    if (!selected) {
      if (Array.isArray(defaultList) && defaultList.length > 0) {
        setOptions(defaultList.map(formatOption).filter(Boolean))
      }
      fetchOptions('')
    }
    if (onChange) {
      onChange(selected)
    }
  }

  // Custom NoOptionsMessage: tampilkan pesan data tidak ada beserta tombol hijau Tambah Data External Baru
  const CustomNoOptionsMessage = props => (
    <components.NoOptionsMessage {...props}>
      <div className="py-2.5 px-3 text-center text-sm space-y-2">
        <div className="text-gray-500 font-medium">Data tidak ditemukan</div>
        <button
          type="button"
          onMouseDown={e => {
            e.preventDefault()
            e.stopPropagation()
            if (typeof onAddNew === 'function') {
              onAddNew(inputValue)
            }
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-md text-xs font-semibold shadow-sm transition"
        >
          <Icon icon="ic:baseline-plus" width={16} height={16} />
          <span>+ Tambah Data External Baru</span>
        </button>
      </div>
    </components.NoOptionsMessage>
  )

  const customStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: 'rgba(224, 242, 241, 0.25)',
      borderColor: state.isFocused
        ? colors?.primary?.[500] || '#126e63'
        : colors?.primary?.[400] || '#4db6ac',
      borderRadius: '0.5rem',
      minHeight: '42px',
      boxShadow: state.isFocused ? `0 0 0 1px ${colors?.primary?.[500] || '#126e63'}` : 'none',
      '&:hover': {
        borderColor: colors?.primary?.[500] || '#126e63',
      },
    }),
    placeholder: base => ({
      ...base,
      color: '#9ca3af',
      fontSize: '0.875rem',
    }),
    singleValue: base => ({
      ...base,
      color: '#111827',
      fontSize: '0.875rem',
    }),
    menu: base => ({
      ...base,
      borderRadius: '0.5rem',
      zIndex: 99999,
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      border: '1px solid #e5e7eb',
      overflow: 'hidden',
    }),
    menuPortal: base => ({
      ...base,
      zIndex: 99999,
      pointerEvents: 'auto',
    }),
    menuList: base => ({
      ...base,
      maxHeight: '380px',
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? colors?.primary?.[500] || '#126e63'
        : state.isFocused
        ? colors?.primary?.[100] || '#e0f2f1'
        : 'transparent',
      color: state.isSelected ? '#ffffff' : '#111827',
      fontSize: '0.875rem',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: state.isSelected
          ? colors?.primary?.[500] || '#126e63'
          : colors?.primary?.[100] || '#e0f2f1',
        color: state.isSelected ? '#ffffff' : '#111827',
      },
      '&:active': {
        backgroundColor: colors?.primary?.[500] || '#126e63',
        color: '#ffffff',
      },
    }),
  }

  return (
    <div className="relative w-full max-w-full">
      <Select
        styles={customStyles}
        value={selectedOption}
        options={options}
        onChange={handleChange}
        onInputChange={handleInputChange}
        onMenuOpen={() => {
          if (!inputValue) {
            if (options.length === 0 && Array.isArray(defaultList) && defaultList.length > 0) {
              setOptions(defaultList.map(formatOption).filter(Boolean))
            }
            fetchOptions('')
          }
        }}
        maxMenuHeight={380}
        isLoading={loading}
        placeholder={placeholder}
        isClearable
        filterOption={() => true} // Server-side filtering lewat /kolabExt/search
        menuPortalTarget={mounted && typeof document !== 'undefined' ? document.body : null}
        menuPosition="fixed"
        menuPlacement="auto"
        components={{
          NoOptionsMessage: CustomNoOptionsMessage,
        }}
      />
    </div>
  )
}
